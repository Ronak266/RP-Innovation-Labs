# RP Innovation Labs Website

A modern, professional website for RP Innovation Labs - a cutting-edge IT services company specializing in ERP-driven data analytics, data ingestion, transformation, and visualization.

## Features

- **Modern Design**: Clean, futuristic design with blue/white tech-themed color palette
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Engaging transitions and micro-interactions throughout
- **Service Request Form**: Complete form with validation and database integration
- **Email Notifications**: Automated email system via Edge Functions (ready for SMTP configuration)
- **Database Integration**: Supabase backend for storing service requests
- **SEO Optimized**: Clean semantic HTML structure

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Backend**: Supabase Edge Functions
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx      # Responsive navigation with smooth scroll
│   ├── Hero.tsx            # Hero section with CTA
│   ├── About.tsx           # Mission and vision section
│   ├── Services.tsx        # Services showcase with animated cards
│   ├── WhyChooseUs.tsx     # Benefits and value propositions
│   ├── ServiceRequest.tsx  # Service request form with validation
│   ├── Contact.tsx         # Contact information section
│   └── Footer.tsx          # Footer with links and social icons
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles and animations

supabase/
└── functions/
    └── send-service-request-email/
        └── index.ts        # Edge function for email notifications
```

## Key Sections

1. **Home**: Compelling hero section with statistics and call-to-action
2. **About**: Company mission, vision, and core values
3. **Services**: Six core service offerings with detailed descriptions
4. **Why Choose Us**: Six key benefits including scalability and business intelligence
5. **Service Request**: Full-featured form with validation
6. **Contact**: Contact information and business hours
7. **Footer**: Navigation links, social media, and company info

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

### Development

The development server starts automatically. If you need to restart it:

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Database Schema

The application uses a `service_requests` table with the following structure:

- `id` (uuid) - Unique identifier
- `name` (text) - Client name
- `email` (text) - Client email
- `company` (text) - Company name
- `phone` (text) - Phone number
- `service_type` (text) - Selected service
- `project_description` (text) - Project details
- `status` (text) - Request status (new, in_progress, completed, cancelled)
- `created_at` (timestamp) - Submission timestamp
- `updated_at` (timestamp) - Last update timestamp

### Row Level Security

- Public users can submit service requests (INSERT)
- Authenticated users can view and update requests (SELECT, UPDATE)

## Edge Functions

### send-service-request-email

Handles email notifications when service requests are submitted:
- Sends confirmation email to the client
- Sends notification email to admin team

**Note**: Email delivery requires SMTP configuration. The function currently prepares email templates but requires an email service provider to be integrated.

## Form Validation

The service request form includes comprehensive validation:

- **Name**: Required field
- **Email**: Required, valid email format
- **Company**: Required field
- **Phone**: Required, valid phone format
- **Service Type**: Required selection from dropdown
- **Project Description**: Required, minimum 20 characters

## Customization

### Colors

The theme uses a blue color palette. To customize:

1. Update Tailwind config in `tailwind.config.js`
2. Modify gradient classes in components
3. Update CSS variables in `index.css`

### Content

All content can be edited directly in the component files:

- Company information: `Navigation.tsx`, `Footer.tsx`
- Services: `Services.tsx`
- Contact details: `Contact.tsx`, `Footer.tsx`

### Email Templates

Email templates can be customized in:
- `supabase/functions/send-service-request-email/index.ts`

## Performance Optimizations

- Lazy loading for images
- Optimized animations using CSS transforms
- Efficient re-renders with React hooks
- Production build with code splitting
- Compressed assets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Focus states for interactive elements
- Sufficient color contrast ratios

## Future Enhancements

Consider adding:

- **Testimonials Section**: Client success stories
- **Blog/Resources**: Industry insights and case studies
- **Live Chat**: Real-time customer support
- **Analytics Integration**: Google Analytics or similar
- **Multi-language Support**: i18n implementation
- **Admin Dashboard**: Manage service requests
- **Email Service Integration**: SendGrid, Resend, or similar

## License

Copyright © 2026 RP Innovation Labs. All rights reserved.

## Support

For questions or issues:
- Email: info@rpinnovationlabs.com
- Phone: +1 (555) 123-4567
