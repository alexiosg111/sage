# SAGE Club Berlin

A modern e-commerce and event management platform for SAGE Club Berlin, built with Next.js, Supabase, and Stripe.

## Features

- **Public Website** (`apps/web`)
  - Event listings with ticket purchasing
  - Merchandise shop with cart functionality
  - Club information page
  - Responsive dark-themed design ("Industrial Brutalism")
  - Automatic proxy to Admin Dashboard at `/admin`

- **Admin Dashboard** (`apps/admin`)
  - Product management (CRUD) with image previews
  - Event management (CRUD) with ticket tracking
  - Detailed Order tracking and customer management
  - Sales analytics and revenue overview
  - Clean, professional industrial UI

- **E-commerce**
  - Shopping cart with persistent storage
  - Stripe checkout integration
  - Order processing and tracking
  - Inventory management

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes (Server Components)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **State Management**: Zustand
- **Icons**: Lucide React

## Project Structure

```
sage-club-web/
├── apps/
│   ├── web/               # Main website (Consumer facing)
│   └── admin/             # Admin dashboard (Internal use)
├── packages/
│   └── database/          # Database schema and SQL
├── package.json           # Workspace configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/installation)
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/alexiosg111/sage-club-web.git
cd sage-club-web
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in both `apps/web` and `apps/admin`. Use the following templates:

**apps/web/.env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**apps/admin/.env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Set up the database:
   - Create a new Supabase project.
   - Run the SQL schema from `packages/database/schema.sql` in the Supabase SQL Editor.
   - (Optional) Insert some initial products and events via the Admin UI.

5. Run the development server:
```bash
pnpm dev
```
The website will be available at `http://localhost:3000` and the Admin Dashboard at `http://localhost:3000/admin`.

## Stripe Webhook Setup

For local development, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the provided webhook secret to your `apps/web/.env.local` as `STRIPE_WEBHOOK_SECRET`.

## Deployment

The project is optimized for **Vercel**. 

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Vercel will automatically detect the monorepo structure. Configure `apps/web` and `apps/admin` accordingly if deploying separately, or deploy `apps/web` and let it handle the admin via rewrites (standard configuration).
4. Add all environment variables in the Vercel dashboard.

## License

MIT License

## Support

For support, email info@sageclub.berlin or create an issue in the repository.
