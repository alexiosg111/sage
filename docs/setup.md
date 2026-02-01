# SAGE Club Berlin - Setup Guide

## Initial Setup

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor
3. Run the schema from `packages/database/schema.sql`
4. Note down your project URL and anon key from Settings > API

### 2. Stripe Setup

1. Create an account at [stripe.com](https://stripe.com)
2. Get your API keys from Developers > API Keys
3. Set up webhook endpoint for `/api/webhooks/stripe`
4. Note down your webhook signing secret

### 3. Environment Variables

Create `.env.local` in `apps/web/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Running Locally

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

### 5. Stripe Webhook (Local Development)

Install Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Admin Access

To create an admin user:

1. Sign up a user through Supabase Auth
2. Insert into `user_roles` table:
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

## Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Supabase (Production)

1. Enable RLS policies
2. Configure CORS if needed
3. Set up production database
