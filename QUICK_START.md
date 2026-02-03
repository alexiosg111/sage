# Quick Start Guide - Admin Panel Extensions

Get up and running with the new admin panel features in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Supabase project created
- Access to Supabase dashboard

## Step 1: Install Dependencies (2 minutes)

```bash
pnpm install
```

## Step 2: Environment Setup (1 minute)

Create `apps/web/.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these from: Supabase Dashboard → Settings → API

## Step 3: Create Storage Bucket (1 minute)

Open Supabase SQL Editor and run:

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

CREATE POLICY "Public Read Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Admin Delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images' AND
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
```

## Step 4: Create Admin User (30 seconds)

```bash
pnpm seed:admin
```

Enter your email and password when prompted.

## Step 5: Start and Login (30 seconds)

```bash
pnpm dev
```

Visit `http://localhost:3000/admin/login` and login with your credentials.

## You're Done! 🎉

You now have access to:
- ✅ Secure admin panel with authentication
- ✅ Drag & drop image upload for products and events
- ✅ Analytics dashboard with revenue, orders, and customer stats

## What's Next?

- Create your first product with an image at `/admin/products/new`
- Check the analytics at `/admin/analytics`
- Review the detailed setup guide in `docs/ADMIN_PANEL_SETUP.md`

## Need Help?

- See `IMPLEMENTATION_SUMMARY.md` for technical details
- Check `docs/ADMIN_PANEL_SETUP.md` for troubleshooting
- Review Supabase docs at https://supabase.com/docs

## Common Issues

**"Missing Supabase environment variables"**
- Make sure `.env.local` is in `apps/web/` directory
- Check variable names match exactly

**"No file or directory" running seed script**
- Make sure you ran `pnpm install` first
- Check that `tsx` is installed

**"Cannot upload images"**
- Verify storage bucket exists in Supabase
- Check storage policies are created
- Confirm file is under 5MB

**"Always redirected to login"**
- Clear browser cookies
- Verify admin role is assigned to user
- Check browser console for errors
