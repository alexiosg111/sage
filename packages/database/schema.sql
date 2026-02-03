-- SAGE Club Berlin Database Schema

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  ticket_price NUMERIC(10,2),
  ticket_stock INT DEFAULT 0,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  stripe_session_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  customer_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles table (for admin access)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read active products
CREATE POLICY "Anyone can read active products" ON products
  FOR SELECT USING (status = 'active');

-- Products: Only admins can write
CREATE POLICY "Only admins can insert products" ON products
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can update products" ON products
  FOR UPDATE USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Events: Anyone can read published events
CREATE POLICY "Anyone can read published events" ON events
  FOR SELECT USING (status = 'published');

-- Events: Only admins can write
CREATE POLICY "Only admins can insert events" ON events
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can update events" ON events
  FOR UPDATE USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can delete events" ON events
  FOR DELETE USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Orders: Users can only see their own orders (or admins can see all)
CREATE POLICY "Users can see own orders" ON orders
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Orders: Anyone can create (for checkout)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Orders: Only service role or admins can update
CREATE POLICY "Service role or admins can update orders" ON orders
  FOR UPDATE USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Order items: Users can see their own order items
CREATE POLICY "Users can see own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
    )
  );

-- Order items: Anyone can create (for checkout)
CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- User roles: Only admins can read/write
CREATE POLICY "Only admins can read user roles" ON user_roles
  FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can manage user roles" ON user_roles
  FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Storage Bucket Setup (run these commands in Supabase SQL Editor)
--
-- Create storage bucket for product and event images
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
--
-- Allow public access to read images
-- CREATE POLICY "Public Read Access" ON storage.objects
--   FOR SELECT USING (bucket_id = 'images');
--
-- Allow authenticated users to upload images
-- CREATE POLICY "Authenticated Upload" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'images' AND
--     auth.role() = 'authenticated'
--   );
--
-- Allow admins to delete images
-- CREATE POLICY "Admin Delete" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'images' AND
--     EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
--   );
