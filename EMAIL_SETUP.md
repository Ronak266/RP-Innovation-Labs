# Email Setup Guide for RP Innovation Labs

The website's service request form is now configured to send emails using **Resend**, a modern email API service.

## Current Status

- **Form submissions are saved to the database** ✅
- **Email functionality is ready** ✅
- **Email sending requires API key configuration** ⚠️

## How Email Works

When a user submits a service request:

1. **Data is saved** to the Supabase database
2. **Two emails are sent**:
   - **Confirmation email** to the customer
   - **Notification email** to your admin team

## Setting Up Email Delivery

To enable actual email sending, you need to configure Resend:

### Step 1: Create a Resend Account

1. Visit [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day on free tier)
3. Verify your email address

### Step 2: Get Your API Key

1. Log into your Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Copy the API key (starts with `re_`)

### Step 3: Add a Verified Domain (Recommended)

For production use, verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Add your domain (e.g., `rpinnovationlabs.com`)
4. Add the DNS records shown by Resend to your domain DNS
5. Wait for verification (usually takes a few minutes)

### Step 4: Configure Environment Variables

You need to set these environment variables in your Supabase project:

- **RESEND_API_KEY** - Your Resend API key (required)
- **FROM_EMAIL** - The sender email (e.g., `noreply@yourdomain.com`)
- **ADMIN_EMAIL** - Where admin notifications should go (e.g., `admin@yourdomain.com`)

#### How to Set Environment Variables in Supabase:

These secrets are automatically configured in your Supabase Edge Functions environment.

**Note**: For development/testing without a verified domain, Resend allows you to send emails to your own verified email address only.

## Email Templates

The system sends two types of emails:

### 1. Customer Confirmation Email
- **Subject**: "Thank You for Your Service Request - RP Innovation Labs"
- **Content**: Thanks the customer and summarizes their request
- **Sent to**: Customer's email address from the form

### 2. Admin Notification Email
- **Subject**: "New Service Request from [Company Name]"
- **Content**: Full details of the service request with client information
- **Sent to**: Admin email (configured in ADMIN_EMAIL environment variable)

## Testing Email Delivery

1. **Without API Key**: Form submissions save to database but emails won't send
2. **With API Key (unverified domain)**: Can send to verified email addresses only
3. **With API Key (verified domain)**: Can send to any email address

## Alternative Email Providers

If you prefer a different email service, you can modify the Edge Function to use:

- **SendGrid** - Popular enterprise email service
- **AWS SES** - Amazon's email service
- **Mailgun** - Developer-focused email API
- **SMTP** - Any standard SMTP server

The Edge Function is located at:
`supabase/functions/send-service-request-email/index.ts`

## Current Behavior

**Without Email Configuration:**
- Form submissions work perfectly
- Data is saved to the database
- Users see a success message
- No emails are sent (gracefully handled)

**With Email Configuration:**
- Everything above, plus
- Confirmation emails sent to customers
- Notification emails sent to admin team

## Support

For questions about:
- **Resend**: Visit [resend.com/docs](https://resend.com/docs)
- **Supabase Edge Functions**: Visit [supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)

## Cost

**Resend Pricing:**
- Free tier: 100 emails/day, 3,000 emails/month
- Pro tier: $20/month for 50,000 emails/month
- More at [resend.com/pricing](https://resend.com/pricing)
