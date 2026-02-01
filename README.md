# SAGE Club Berlin

A modern e-commerce and event management platform for SAGE Club Berlin, built with Next.js, Supabase, and Stripe.

## Features

- **Public Website**
  - Event listings with ticket purchasing
  - Merchandise shop with cart functionality
  - Club information page
  - Responsive dark-themed design

- **Admin Dashboard**
  - Product management (CRUD)
  - Event management (CRUD)
  - Order tracking and management
  - Sales analytics

- **E-commerce**
  - Shopping cart with persistent storage
  - Stripe checkout integration
  - Order processing and tracking
  - Inventory management

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **State Management**: Zustand
- **Icons**: Lucide React

## Project Structure

```
sage-club-web/
├── apps/web/              # Next.js application
│   ├── src/app/           # App Router pages
│   │   ├── admin/         # Admin dashboard
│   │   ├── api/           # API routes
│   │   ├── checkout/      # Checkout success/cancel pages
│   │   ├── club/          # Club info page
│   │   ├── events/        # Event listings
│   │   ├── shop/          # Shop pages
│   │   └── page.tsx       # Home page
│   ├── src/components/    # React components
│   ├── src/lib/           # Utility functions & clients
│   ├── src/types/         # TypeScript types
│   └── .env.local.example # Environment variables template
├── packages/database/     # Database schema
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
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
```bash
cp apps/web/.env.local.example apps/web/.env.local
# Edit .env.local with your credentials
```

4. Set up the database:
   - Create a new Supabase project
   - Run the SQL schema from `packages/database/schema.sql`

5. Run the development server:
```bash
pnpm dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `NEXT_PUBLIC_SITE_URL` | Your site URL |

### Stripe Webhook Setup

For local development, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Database Schema

### Tables

- **products**: Store merchandise
- **events**: Store club events
- **orders**: Store customer orders
- **order_items**: Store order line items
- **user_roles**: Store admin user roles

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy!

### Supabase

- Enable Row Level Security (RLS)
- Configure authentication if needed
- Set up database policies

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## License

MIT License

## Support

For support, email info@sageclub.berlin or create an issue in the repository.
