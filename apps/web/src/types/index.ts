export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  date: string;
  ticket_price: number | null;
  ticket_stock: number;
  image_url: string | null;
  status: 'published' | 'draft';
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  customer_email: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product?: Product;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface CheckoutRequest {
  items: { productId: string; quantity: number }[];
  customerEmail: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  upcomingEvents: number;
}
