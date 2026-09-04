# Gmail API Email Setup

The service-request form sends two messages through the Gmail API:

- A full request notification to `rpinnovationlabs@gmail.com`.
- A thank-you message to the email address supplied by the customer.

The website never contains Gmail credentials. Configure the following values as **Supabase Edge Function secrets**, not as Bolt variables and not in GitHub:

- `GMAIL_CLIENT_ID` — OAuth client ID from Google Cloud.
- `GMAIL_CLIENT_SECRET` — OAuth client secret from Google Cloud.
- `GMAIL_REFRESH_TOKEN` — refresh token authorized for `rpinnovationlabs@gmail.com` with the `gmail.send` scope.
- `GMAIL_SENDER_EMAIL` — `rpinnovationlabs@gmail.com`.
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret key.
- `TURNSTILE_HOSTNAME` — the exact hostname registered with Turnstile.
- `ALLOWED_ORIGIN` — the exact public Bolt website origin.

The public Bolt deployment also needs `VITE_TURNSTILE_SITE_KEY`.

## Google Cloud requirements

1. Enable the Gmail API.
2. Configure the OAuth consent screen as External and add `rpinnovationlabs@gmail.com` as a test user.
3. Add `https://www.googleapis.com/auth/gmail.send` in Data Access.
4. Create a Web application OAuth client.
5. Generate the refresh token using that client. Never add it to a repository, browser code, or a chat message.

While the OAuth consent app is in Testing, Google may expire the refresh token after about seven days. For uninterrupted production delivery, complete Google's publishing and verification requirements or renew the token when Google expires it.

## Delivery behavior

The server validates the form, verifies Turnstile, applies a rate limit, stores the request, then sends both emails. If Gmail rejects delivery, the request remains stored with `delivery_status = 'failed'` and the customer is told that delivery could not be confirmed.

