#!/bin/bash

# SAGE Club Berlin - Setup Script

echo "🚀 Starting setup for SAGE Club Berlin..."

# Check for pnpm
if ! command -v pnpm &> /dev/null
then
    echo "❌ pnpm could not be found. Please install it first: https://pnpm.io/installation"
    exit
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Setup environment variables
echo "⚙️ Setting up environment variables..."

if [ ! -f apps/web/.env.local ]; then
    cp apps/web/.env.example apps/web/.env.local
    echo "✅ Created apps/web/.env.local"
else
    echo "ℹ️ apps/web/.env.local already exists"
fi

if [ ! -f apps/admin/.env.local ]; then
    cp apps/admin/.env.example apps/admin/.env.local
    echo "✅ Created apps/admin/.env.local"
else
    echo "ℹ️ apps/admin/.env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo "---------------------------------------------------"
echo "Next steps:"
echo "1. Update the .env.local files in apps/web/ and apps/admin/ with your credentials."
echo "2. Run the SQL schema from packages/database/schema.sql in your Supabase project."
echo "3. Run 'pnpm dev' to start the development server."
echo "---------------------------------------------------"
