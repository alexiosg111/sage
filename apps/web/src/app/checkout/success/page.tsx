import Link from 'next/link';
import { CheckCircle, Package, Calendar, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-40 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-xl w-full text-center">
          <div className="w-24 h-24 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle className="w-12 h-12 text-[var(--accent)]" />
          </div>
          
          <div className="mono text-[var(--accent)] mb-4">Erfolg</div>
          <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 tracking-tighter">Vielen Dank!</h1>
          <p className="text-[#888] mb-12 text-lg">
            Deine Bestellung war erfolgreich. Wir haben dir eine Bestätigung per E-Mail gesendet.
          </p>
  
          <div className="bg-[#141414] border border-[#333333] p-10 mb-12 text-left">
            <h2 className="text-xl font-black uppercase mb-8 border-b border-[#333333] pb-4">Wie geht es weiter?</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <Package className="w-6 h-6 text-[var(--accent)] mt-1" />
                <div>
                  <p className="font-bold uppercase tracking-tight">Merchandise</p>
                  <p className="text-[#666] leading-relaxed">
                    Wir bereiten deine Artikel für den Versand vor. Du erhältst eine Sendungsnummer, sobald das Paket unterwegs ist.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <Calendar className="w-6 h-6 text-[var(--accent)] mt-1" />
                <div>
                  <p className="font-bold uppercase tracking-tight">Event Tickets</p>
                  <p className="text-[#666] leading-relaxed">
                    Deine digitalen Tickets werden dir innerhalb von 24 Stunden per E-Mail zugestellt.
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="flex-1 py-5 bg-[var(--accent)] text-black font-bold uppercase hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2"
            >
              Weiter Einkaufen
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/events"
              className="flex-1 py-5 border border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-all"
            >
              Programm ansehen
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
