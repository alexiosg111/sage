# Admin Panel Setup Guide

This guide explains how to set up and use the extended admin panel features including authentication, image upload, and user statistics.

## Features

1. **Authentication** - Secure admin login with role-based access control
2. **Image Upload** - Drag & drop image upload with Supabase Storage
3. **User Analytics** - Detailed statistics and charts for revenue, orders, and customers

## Prerequisites

Before starting, ensure you have:
- Supabase project set up
- Environment variables configured
- Database schema applied
- Storage bucket created

## Setup Steps

### 1. Environment Variables

Create a `.env.local` file in `apps/web/`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Get these from your Supabase project dashboard → Settings → API.

### 2. Create Storage Bucket

Run the following SQL in your Supabase SQL Editor (found at the end of `packages/database/schema.sql`):

```sql
-- Create storage bucket for product and event images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Allow public access to read images
CREATE POLICY "Public Read Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

-- Allow admins to delete images
CREATE POLICY "Admin Delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images' AND
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
```

### 3. Create Admin User

Run the seed script to create an admin user:

```bash
pnpm seed:admin
```

You'll be prompted for:
- Email address
- Password (min 6 characters)

The script will create the user and assign the admin role.

### 4. Verify Setup

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3000/admin/login`

3. Login with the credentials you created

4. You should see the admin dashboard with all sections accessible

## Features Overview

### Authentication

- **Protected Routes**: All `/admin/*` routes except `/admin/login` require authentication
- **Role-Based Access**: Only users with `admin` role can access the admin panel
- **Session Management**: Uses Supabase Auth with token stored in cookies
- **Automatic Redirects**: Unauthenticated users are redirected to login page

### Image Upload

- **Drag & Drop**: Simply drag images onto the upload area
- **Click to Upload**: Or click to select from your computer
- **URL Support**: Still supports pasting image URLs directly
- **File Validation**: Validates file type (images only) and size (max 5MB)
- **Preview**: Shows image preview before saving
- **Supabase Storage**: Images are stored in Supabase Storage under the `images` bucket

### User Analytics

The analytics page (`/admin/analytics`) provides:

- **Key Metrics**:
  - Total Revenue
  - Total Orders
  - Unique Customers
  - Conversion Rate

- **Revenue Trend**: Bar chart showing revenue over the last 6 months

- **Order Status Distribution**: Visual breakdown of order statuses (completed, pending, cancelled)

- **Top Products**: List of best-selling products

- **Recent Activity**: Latest orders with status information

## Navigation

The admin panel sidebar includes:

- **Dashboard**: Overview with key stats and recent orders
- **Analytics**: Detailed analytics and charts
- **Products**: Manage products (create, edit, delete)
- **Events**: Manage events (create, edit, delete)
- **Orders**: View and manage orders
- **View Site**: Opens the public site in new tab
- **Logout**: Sign out and return to login page

## API Endpoints

### Authentication
- `POST /api/admin/logout` - Logout current user

### Image Upload
- `POST /api/admin/upload` - Upload image to Supabase Storage
  - Accepts: multipart/form-data with `file` field
  - Returns: `{ url: string }` with public URL of uploaded image

### Products & Events
- Existing endpoints continue to work with the new image URL format

## Troubleshooting

### Login Issues

**Problem**: Can't login despite having admin role
**Solution**: 
1. Check that the user actually has the admin role in `user_roles` table
2. Verify the email and password are correct
3. Check browser console for error messages

### Image Upload Issues

**Problem**: Images not uploading
**Solution**:
1. Verify the storage bucket `images` exists and is public
2. Check the storage policies allow authenticated users to upload
3. Verify file size is under 5MB
4. Check Supabase logs for upload errors

### Middleware Issues

**Problem**: Always redirected to login
**Solution**:
1. Check that the `sb-access-token` cookie is being set after login
2. Verify the Supabase environment variables are correct
3. Check the middleware is running (check Next.js logs)

## Security Notes

1. **Service Role Key**: Never expose the service role key on the client side. Use it only in server-side code (API routes, server components).

2. **RLS Policies**: Row Level Security is enabled on all tables. Make sure your policies are correctly configured.

3. **Admin Role**: Only users with the admin role can access and modify data in the admin panel.

4. **HTTPS**: Always use HTTPS in production to protect credentials in transit.

## Development Tips

### Testing Authentication Locally

1. Create a test admin user with `pnpm seed:admin`
2. Login at `/admin/login`
3. Try accessing protected routes while logged out (should redirect to login)

### Testing Image Upload

1. Navigate to create/edit product or event page
2. Drag an image file onto the upload area
3. Verify the preview appears
4. Save the product/event
5. Check the image displays in the list view

### Testing Analytics

1. Create some sample orders with different statuses
2. Create products with different prices
3. Check the analytics page for updated statistics

## Future Enhancements

Potential improvements to consider:

- Add more detailed analytics (e.g., customer lifetime value, churn rate)
- Implement image cropping/editing
- Add bulk image upload
- Implement user management (list all users, change roles)
- Add audit logging for admin actions
- Implement two-factor authentication
- Add real-time notifications for new orders
- Export analytics data as CSV/Excel
- Add more chart types and date range filters

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check Next.js documentation: https://nextjs.org/docs
