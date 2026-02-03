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

2. Run the setup script:
   - **Windows:** Double-click `setup.bat`.
   - **Linux/macOS:** Run `chmod +x setup.sh && ./setup.sh`

This script will check for prerequisites (Node.js, pnpm), install dependencies, and create your environment files.

3. Set up your credentials:
Update the `.env.local` files in `apps/web` and `apps/admin` with your actual Supabase and Stripe credentials.

4. Run the development server:
   - **Windows:** Double-click `start.bat`.
   - **Linux/macOS:** Run `chmod +x start.sh && ./start.sh`

The website will be available at `http://localhost:3000` and the Admin Dashboard at `http://localhost:3000/admin`.

## Admin Dashboard as Desktop App

The Admin Dashboard can also be run as a native desktop application (Electron).

1. Ensure the development server is running (`pnpm dev`).
2. Run the following command in a new terminal:
```bash
pnpm --filter admin electron
```

### Building the Setup.exe

To generate a standalone `setup.exe` for Windows locally:
```bash
pnpm --filter admin dist
```
The executable will be generated in `apps/admin/dist/`.

### Automated Release

A GitHub Action is configured to automatically create a release and build the `setup.exe` whenever a tag starting with `v` is pushed:

```bash
git tag v1.0.0
git push origin v1.0.0
```
The release will appear on your GitHub repository's "Releases" page with the `setup.exe` attached.

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
