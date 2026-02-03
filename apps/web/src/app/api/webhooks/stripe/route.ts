import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';
import Stripe from 'stripe';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !endpointSecret) {
    return NextResponse.json(
      { error: 'Missing signature or endpoint secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        // Find the order by Stripe session ID
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_session_id', session.id)
          .single();

        if (orderError || !order) {
          console.error('Order not found:', orderError);
          return NextResponse.json(
            { error: 'Order not found' },
            { status: 404 }
          );
        }

        // Update order status to completed
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'completed',
            total: (session.amount_total || 0) / 100, // Convert from cents
          })
          .eq('id', order.id);

        if (updateError) {
          console.error('Error updating order:', updateError);
          return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
          );
        }

        // Update product stock
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        if (orderItems) {
          for (const item of orderItems) {
            if (item.product_id) {
              // Get current stock
              const { data: product } = await supabase
                .from('products')
                .select('stock')
                .eq('id', item.product_id)
                .single();

              if (product) {
                // Update stock
                await supabase
                  .from('products')
                  .update({ stock: Math.max(0, product.stock - item.quantity) })
                  .eq('id', item.product_id);
              }
            }
          }
        }

        console.log(`Order ${order.id} marked as completed`);
      } catch (error) {
        console.error('Error processing checkout completion:', error);
        return NextResponse.json(
          { error: 'Failed to process checkout' },
          { status: 500 }
        );
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        // Find and cancel the order
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_session_id', session.id)
          .single();

        if (order) {
          await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', order.id);

          console.log(`Order ${order.id} marked as cancelled (expired)`);
        }
      } catch (error) {
        console.error('Error processing expired session:', error);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
