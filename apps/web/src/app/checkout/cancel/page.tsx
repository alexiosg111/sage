import Link from 'next/link';
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-40 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-xl w-full text-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-10">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          
          <div className="mono text-red-500 mb-4">Abbruch</div>
          <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 tracking-tighter">Zahlung abgebrochen</h1>
          <p className="text-[#888] mb-12 text-lg">
            Dein Bezahlvorgang wurde abgebrochen. Keine Sorge, dein Warenkorb ist noch gespeichert.
          </p>
  
          <div className="bg-[#141414] border border-[#333333] p-10 mb-12 text-left">
            <h2 className="text-xl font-black uppercase mb-8 border-b border-[#333333] pb-4">Brauchst du Hilfe?</h2>
            <p className="text-[#888] leading-relaxed">
              Falls technische Probleme aufgetreten sind, versuche es bitte erneut oder kontaktiere unser Support-Team unter <span className="text-white underline">shop@sage-club.de</span>.
            </p>
          </div>
  
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop/cart"
              className="flex-1 py-5 bg-[var(--accent)] text-black font-bold uppercase hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              ZUM WARENKORB
            </Link>
            <Link
              href="/shop"
              className="flex-1 py-5 border border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              WEITER EINKAUFEN
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
