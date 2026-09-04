
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildGmailRawMessage,
  buildEmailRecipients,
  buildTurnstileVerificationBody,
  escapeHtml,
  isTrustedTurnstileResponse,
  validateServiceRequest,
} from './email-utils.mjs';

function decodeBase64Url(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  return new TextDecoder().decode(Uint8Array.from(atob(padded), (character) => character.charCodeAt(0)));
}

const validRequest = {
  name: 'Taylor & Co',
  email: 'taylor@example.com',
  company: 'Example <Partners>',
  phone: '+91 98765 43210',
  service_type: 'Data Ingestion',
  project_description: 'We need a reliable data ingestion pipeline for our analytics team.',
};

test('rejects an invalid customer email before it reaches Resend', () => {
  assert.throws(
    () => validateServiceRequest({ ...validRequest, email: 'not-an-email' }),
    /valid email/i,
  );
});

test('rejects unbounded request data before it reaches storage or Resend', () => {
  assert.throws(
    () => validateServiceRequest({ ...validRequest, project_description: 'x'.repeat(5_001) }),
    /5,000 characters/i,
  );
});

test('escapes customer text before rendering email HTML', () => {
  assert.equal(escapeHtml('<img src=x onerror=alert(1)> & "quote"'), '&lt;img src=x onerror=alert(1)&gt; &amp; &quot;quote&quot;');
});

test('always sends the admin notification to RP Innovation Labs and confirmation to the submitted email', () => {
  const request = validateServiceRequest(validRequest);
  assert.deepEqual(
    buildEmailRecipients(request),
    { admin: 'rpinnovationlabs@gmail.com', customer: 'taylor@example.com' },
  );
});

test('accepts a Turnstile response only for the configured hostname', () => {
  assert.equal(isTrustedTurnstileResponse({ success: true, hostname: 'www.rpinnovationlabs.com' }, 'www.rpinnovationlabs.com'), true);
  assert.equal(isTrustedTurnstileResponse({ success: true, hostname: 'attacker.example' }, 'www.rpinnovationlabs.com'), false);
});

test('verifies a Turnstile token without proxy IP metadata', () => {
  const body = buildTurnstileVerificationBody('test-secret', 'test-token');
  assert.equal(body.toString(), 'secret=test-secret&response=test-token');
});

test('builds a Gmail API message with a UTF-8 HTML body and cannot inject extra headers through the subject', () => {
  const raw = buildGmailRawMessage({
    to: 'taylor@example.com',
    from: 'rpinnovationlabs@gmail.com',
    subject: 'Thanks\r\nBcc: attacker@example.com',
    html: '<p>Thank you — RP Innovation Labs</p>',
  });

  assert.match(raw, /^[A-Za-z0-9_-]+$/);
  const message = decodeBase64Url(raw);
  assert.match(message, /^To: taylor@example\.com\r\nFrom: rpinnovationlabs@gmail\.com\r\n/m);
  assert.doesNotMatch(message, /\r\nBcc:/i);
  assert.match(message, /Content-Type: text\/html; charset=UTF-8/);
  assert.match(message, /Thank you — RP Innovation Labs/);
});

