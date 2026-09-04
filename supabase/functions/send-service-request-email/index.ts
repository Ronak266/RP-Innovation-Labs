import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { buildEmailRecipients, buildGmailRawMessage, buildTurnstileVerificationBody, escapeHtml, isTrustedTurnstileResponse, turnstileHostnameFromOrigin, validateServiceRequest } from "./email-utils.mjs";

const jsonHeaders = { "Content-Type": "application/json" };

function reply(body: Record<string, unknown>, status: number, allowedOrigin?: string) {
  return new Response(JSON.stringify(body), { status, headers: { ...jsonHeaders, ...(allowedOrigin ? { "Access-Control-Allow-Origin": allowedOrigin, "Vary": "Origin" } : {}) } });
}

function clientIp(request: Request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function verifyTurnstile(token: string, allowedOrigin: string) {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) throw new Error("Bot protection is not configured.");
  const hostname = turnstileHostnameFromOrigin(allowedOrigin);
  const form = buildTurnstileVerificationBody(secret, token);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  const result = response.ok ? await response.json() : null;
  if (!isTrustedTurnstileResponse(result, hostname)) throw new Error("Bot verification failed. Please try again.");
}

function customerEmail(request: Record<string, string>) {
  return `<p>Dear ${escapeHtml(request.name)},</p><p>Thank you for reaching out to RP Innovation Labs. We received your service request and will respond within 24 hours.</p><p><strong>Service:</strong> ${escapeHtml(request.service_type)}<br><strong>Company:</strong> ${escapeHtml(request.company)}</p><p>Best regards,<br><strong>RP Innovation Labs Team</strong></p>`;
}

function adminEmail(request: Record<string, string>) {
  return `<h1>New Service Request Received</h1><p><strong>Name:</strong> ${escapeHtml(request.name)}<br><strong>Email:</strong> ${escapeHtml(request.email)}<br><strong>Company:</strong> ${escapeHtml(request.company)}<br><strong>Phone:</strong> ${escapeHtml(request.phone)}<br><strong>Service:</strong> ${escapeHtml(request.service_type)}</p><h2>Project Description</h2><p>${escapeHtml(request.project_description).replaceAll("\n", "<br>")}</p>`;
}

async function gmailAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = response.ok ? await response.json() : null;
  if (typeof result?.access_token !== "string") throw new Error("Gmail authorization could not be refreshed.");
  return result.access_token;
}

async function sendWithGmail(accessToken: string, to: string, from: string, subject: string, html: string) {
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
    body: JSON.stringify({ raw: buildGmailRawMessage({ to, from, subject, html }) }),
  });
  if (!response.ok) throw new Error("Email delivery was rejected by Gmail.");
}

Deno.serve(async (request: Request) => {
  const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN");
  const origin = request.headers.get("origin") || undefined;
  const corsOrigin = allowedOrigin && origin === allowedOrigin ? allowedOrigin : undefined;

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsOrigin ? { "Access-Control-Allow-Origin": corsOrigin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin" } : {} });
  if (request.method !== "POST") return reply({ success: false, error: "Method not allowed." }, 405, corsOrigin);
  if (!corsOrigin) return reply({ success: false, error: "Origin is not allowed." }, 403);

  try {
    const payload = await request.json();
    const turnstileToken = typeof payload.turnstileToken === "string" ? payload.turnstileToken : "";
    if (!turnstileToken) throw new Error("Bot verification is required.");
    const serviceRequest = validateServiceRequest(payload);
    await verifyTurnstile(turnstileToken, corsOrigin);
    const ip = clientIp(request);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const gmailClientId = Deno.env.get("GMAIL_CLIENT_ID");
    const gmailClientSecret = Deno.env.get("GMAIL_CLIENT_SECRET");
    const gmailRefreshToken = Deno.env.get("GMAIL_REFRESH_TOKEN");
    const gmailSenderEmail = Deno.env.get("GMAIL_SENDER_EMAIL");
    if (!supabaseUrl || !serviceRoleKey || !gmailClientId || !gmailClientSecret || !gmailRefreshToken || !gmailSenderEmail) throw new Error("The Gmail email configuration is incomplete.");
    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    const { data: allowed, error: rateLimitError } = await supabase.rpc("consume_service_request_rate_limit", { request_key: await sha256(`${ip}:${serviceRequest.email}`) });
    if (rateLimitError) throw new Error("Rate-limit service is unavailable.");
    if (!allowed) return reply({ success: false, error: "Too many requests. Please try again later." }, 429, corsOrigin);

    const { data: stored, error: insertError } = await supabase.from("service_requests").insert({ ...serviceRequest, delivery_status: "pending" }).select("id").single();
    if (insertError) throw new Error("Unable to save your request.");

    const recipients = buildEmailRecipients(serviceRequest);

    try {
      const accessToken = await gmailAccessToken(gmailClientId, gmailClientSecret, gmailRefreshToken);
      await Promise.all([
        sendWithGmail(accessToken, recipients.customer, gmailSenderEmail, "Thank you for your service request — RP Innovation Labs", customerEmail(serviceRequest)),
        sendWithGmail(accessToken, recipients.admin, gmailSenderEmail, `New service request from ${serviceRequest.company}`, adminEmail(serviceRequest)),
      ]);
      await supabase.from("service_requests").update({ delivery_status: "sent", delivery_error: null }).eq("id", stored.id);
      return reply({ success: true, message: "Request received and confirmation email sent." }, 200, corsOrigin);
    } catch (emailError) {
      await supabase.from("service_requests").update({ delivery_status: "failed", delivery_error: "Email dispatch failed" }).eq("id", stored.id);
      console.error("Service request email dispatch failed", emailError instanceof Error ? emailError.message : "unknown error");
      return reply({ success: false, error: "Your request was saved, but email delivery could not be confirmed. Please contact us directly." }, 502, corsOrigin);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process the request.";
    const status = /valid|required|characters|phone|service type|Bot verification/i.test(message) ? 400 : 500;
    return reply({ success: false, error: message }, status, corsOrigin);
  }
});

