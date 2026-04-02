import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ServiceRequest {
  name: string;
  email: string;
  company: string;
  phone: string;
  service_type: string;
  project_description: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const requestData: ServiceRequest = await req.json();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'remor143@gmail.com';
    const FROM_EMAIL_ENV = Deno.env.get('FROM_EMAIL');
    const FROM_EMAIL = (FROM_EMAIL_ENV && FROM_EMAIL_ENV.includes('@'))
      ? FROM_EMAIL_ENV
      : 'onboarding@resend.dev';

    const userEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          h1 { margin: 0; font-size: 28px; }
          h2 { color: #2563eb; font-size: 20px; margin-top: 0; }
          .label { font-weight: bold; color: #4b5563; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Request!</h1>
          </div>
          <div class="content">
            <p>Dear ${requestData.name},</p>
            <p>Thank you for reaching out to RP Innovation Labs. We have received your service request and our team is excited to help transform your data strategy.</p>

            <div class="info-box">
              <h2>Request Summary</h2>
              <p><span class="label">Service Type:</span> ${requestData.service_type}</p>
              <p><span class="label">Company:</span> ${requestData.company}</p>
              <p><span class="label">Contact:</span> ${requestData.email} | ${requestData.phone}</p>
            </div>

            <h2>What Happens Next?</h2>
            <p>Our specialist team will review your request and get back to you within 24 hours. In the meantime, feel free to explore our resources or contact us if you have any questions.</p>

            <p style="margin-top: 30px;">Best regards,<br><strong>RP Innovation Labs Team</strong></p>
          </div>
          <div class="footer">
            <p>RP Innovation Labs | Sri Navika opposite to Abyaas Juniour collage Bachupally</p>
            <p>rpinnovationlabs@gmail.com | +91 8374737488</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const adminEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: #1e293b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .detail-row { display: flex; padding: 12px; margin: 8px 0; background: white; border-radius: 6px; }
          .detail-label { font-weight: bold; min-width: 180px; color: #475569; }
          .detail-value { color: #1e293b; }
          .description-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
          h1 { margin: 0; font-size: 24px; }
          h2 { color: #2563eb; margin-top: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Service Request Received</h1>
          </div>
          <div class="content">
            <h2>Client Information</h2>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${requestData.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${requestData.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Company:</span>
              <span class="detail-value">${requestData.company}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${requestData.phone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service Type:</span>
              <span class="detail-value">${requestData.service_type}</span>
            </div>

            <div class="description-box">
              <h2>Project Description</h2>
              <p>${requestData.project_description}</p>
            </div>

            <p style="margin-top: 30px; padding: 15px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
              <strong>Action Required:</strong> Please follow up with this client within 24 hours.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured. Emails will not be sent.");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Request saved successfully. Email sending is not configured yet.",
          emailsNotSent: true
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailPromises = [];

    emailPromises.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [requestData.email],
          subject: `Thank You for Your Service Request - RP Innovation Labs`,
          html: userEmailHTML,
        }),
      })
    );

    emailPromises.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [ADMIN_EMAIL],
          subject: `New Service Request from ${requestData.company}`,
          html: adminEmailHTML,
        }),
      })
    );

    const emailResults = await Promise.allSettled(emailPromises);

    const responses = await Promise.all(
      emailResults.map(async (result, index) => {
        if (result.status === 'fulfilled') {
          const response = result.value;
          const responseData = await response.json();
          return {
            success: response.ok,
            status: response.status,
            data: responseData,
            type: index === 0 ? 'customer' : 'admin'
          };
        }
        return {
          success: false,
          error: result.reason,
          type: index === 0 ? 'customer' : 'admin'
        };
      })
    );

    console.log("Email sending results:", JSON.stringify(responses, null, 2));

    const emailsFailed = responses.some(r => !r.success);

    return new Response(
      JSON.stringify({
        success: true,
        message: emailsFailed ? "Request received but some emails failed to send" : "Request received and emails sent successfully!",
        emailsSent: !emailsFailed
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
