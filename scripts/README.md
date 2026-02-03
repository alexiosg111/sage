# Admin Setup Scripts

This directory contains scripts for setting up and managing the SAGE admin panel.

## seed-admin.ts

Creates a new admin user or assigns admin role to an existing user.

### Usage

Make sure you have your environment variables set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Run the script:
```bash
pnpm seed:admin
```

### What it does

1. Prompts for an email and password
2. Creates a new user in Supabase Auth (or finds existing user by email)
3. Assigns the 'admin' role to the user in the `user_roles` table
4. Displays the user ID and confirmation message

### Notes

- The password must be at least 6 characters
- If the user already exists, it will just assign the admin role
- After running the script, you can login at `/admin/login`

### Environment Variables

You can create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

The service role key can be found in your Supabase project settings under API keys.
