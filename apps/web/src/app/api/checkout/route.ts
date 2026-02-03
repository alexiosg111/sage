import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';
import { CheckoutRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { items, customerEmail } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Fetch products from database to verify prices
    const productIds = items.map(item => item.productId);
    const { data, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = data as any[] | null;

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Handle event tickets (they start with 'ticket-')
    const eventIds = items
      .filter(item => item.productId.startsWith('ticket-'))
      .map(item => item.productId.replace('ticket-', ''));

    let events: { id: string; name: string; ticket_price: number }[] = [];
    if (eventIds.length > 0) {
      const { data, error: eventsError } = await supabase
        .from('events')
        .select('id, name, ticket_price')
        .in('id', eventIds);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const eventsData = data as any[] | null;

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        return NextResponse.json(
          { error: 'Failed to fetch events' },
          { status: 500 }
        );
      }
      events = eventsData || [];
    }

    // Create line items for Stripe
    const lineItems = items.map(item => {
      // Check if it's an event ticket
      if (item.productId.startsWith('ticket-')) {
        const eventId = item.productId.replace('ticket-', '');
        const event = events.find(e => e.id === eventId);
        
        if (!event || !event.ticket_price) {
          throw new Error(`Event not found: ${eventId}`);
        }

        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Ticket: ${event.name}`,
            },
            unit_amount: Math.round(event.ticket_price * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      }

      // Regular product
      const product = products?.find(p => p.id === item.productId);
      
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            images: product.image_url ? [product.image_url] : undefined,
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Calculate total
    const total = items.reduce((sum, item) => {
      if (item.productId.startsWith('ticket-')) {
        const eventId = item.productId.replace('ticket-', '');
        const event = events.find(e => e.id === eventId);
        return sum + (event?.ticket_price || 0) * item.quantity;
      }
      const product = products?.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    // Create order in database
    const { data: order, error: orderError } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('orders') as any)
      .insert({
        status: 'pending',
        total,
        customer_email: customerEmail,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        order_id: order.id,
      },
    });

    // Update order with Stripe session ID
    await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('orders') as any)
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    // Create order items
    const orderItems = items.map(item => {
      if (item.productId.startsWith('ticket-')) {
        const eventId = item.productId.replace('ticket-', '');
        const event = events.find(e => e.id === eventId);
        return {
          order_id: order.id,
          product_id: null, // Tickets don't have a product_id
          quantity: item.quantity,
          price: event?.ticket_price || 0,
        };
      }
      const product = products?.find(p => p.id === item.productId);
      return {
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: product?.price || 0,
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('order_items') as any).insert(orderItems);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
