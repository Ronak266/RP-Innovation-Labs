import assert from 'node:assert/strict';
import test from 'node:test';

import { privacyPolicy } from './privacy-policy.mjs';

test('privacy policy explains collected form data and Gmail delivery', () => {
  assert.match(privacyPolicy.dataUse, /Gmail/i);
  assert.match(privacyPolicy.contact, /rpinnovationlabs@gmail\.com/i);
  assert.match(privacyPolicy.collectedData.join(' '), /email address/i);
});

