'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

interface BuyTicketButtonProps {
  eventId: string;
  eventName: string;
  ticketPrice: number;
}

export default function BuyTicketButton({ eventId, eventName, ticketPrice }: BuyTicketButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleBuyTicket = () => {
    setIsLoading(true);
    
    // Add ticket to cart as a special item
    addItem({
      productId: `ticket-${eventId}`,
      name: `Ticket: ${eventName}`,
      price: ticketPrice,
      quantity: 1,
    });

    // Redirect to cart
    router.push('/shop/cart');
  };

  return (
    <button
      onClick={handleBuyTicket}
      disabled={isLoading}
      className="w-full py-3 bg-amber-500 text-zinc-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Adding...
        </>
      ) : (
        'Buy Ticket'
      )}
    </button>
  );
}
