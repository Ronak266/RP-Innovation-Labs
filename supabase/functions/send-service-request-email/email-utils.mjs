
const SERVICE_TYPES = new Set([
  'ERP Analytics Solutions', 'Data Ingestion', 'Data Transformation', 'Data Visualization',
  'Business Intelligence', 'Data Security & Compliance', 'Custom Solution',
]);

const LIMITS = { name: 120, email: 254, company: 160, phone: 40, project_description: 5_000 };

function requiredText(value, field, limit) {
  if (typeof value !== 'string') throw new Error(`${field} is required.`);
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  if (normalized.length > limit) throw new Error(`${field} must be ${limit.toLocaleString()} characters or fewer.`);
  return normalized;
}

export function validateServiceRequest(value) {
  if (!value || typeof value !== 'object') throw new Error('A service request is required.');
  const request = {
    name: requiredText(value.name, 'Name', LIMITS.name),
    email: requiredText(value.email, 'Email', LIMITS.email).toLowerCase(),
    company: requiredText(value.company, 'Company', LIMITS.company),
    phone: requiredText(value.phone, 'Phone number', LIMITS.phone),
    service_type: requiredText(value.service_type, 'Service type', 80),
    project_description: requiredText(value.project_description, 'Project description', LIMITS.project_description),
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) throw new Error('Please provide a valid email address.');
  if (!/^[+\d\s()\-]+$/.test(request.phone)) throw new Error('Please provide a valid phone number.');
  if (request.project_description.length < 20) throw new Error('Project description must contain at least 20 characters.');
  if (!SERVICE_TYPES.has(request.service_type)) throw new Error('Please select a valid service type.');
  return request;
}

export function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function buildEmailRecipients(request) {
  return { admin: 'rpinnovationlabs@gmail.com', customer: request.email };
}

function base64UrlEncode(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function headerValue(value) {
  return String(value).replace(/[\r\n]+/g, ' ').trim();
}

export function buildGmailRawMessage({ to, from, subject, html }) {
  const message = [
    `To: ${headerValue(to)}`,
    `From: ${headerValue(from)}`,
    `Subject: ${headerValue(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    html,
  ].join('\r\n');
  return base64UrlEncode(message);
}

export function isTrustedTurnstileResponse(result, expectedHostname) {
  return result?.success === true && result.hostname === expectedHostname;
}

export function buildTurnstileVerificationBody(secret, token) {
  return new URLSearchParams({ secret, response: token });
}

export function turnstileHostnameFromOrigin(origin) {
  return new URL(origin).hostname;
}

