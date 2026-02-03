import { MapPin, Clock, Mail, Phone, Instagram, Music, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ClubPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navigation />
      
      <div className="py-24 px-6 max-w-[1200px] mx-auto">
        {/* Hero */}
        <div className="mb-24">
          <div className="mono text-[var(--accent)] mb-4">Über uns</div>
          <h1 className="text-4xl md:text-8xl font-black uppercase mb-12 tracking-tighter leading-[0.9]">
            LEGENDARY<br />BERLIN<br />HISTORY
          </h1>
          <p className="text-xl md:text-2xl text-[#888] max-w-3xl leading-relaxed">
            Der Sage Club ist eine Berliner Institution. Seit Jahrzehnten prägen wir die Nachtkultur der Hauptstadt mit kompromisslosem Sound und einer einzigartigen industriellen Atmosphäre.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <div className="bg-[#141414] border border-[#333333] p-10">
            <MapPin className="w-8 h-8 text-[var(--accent)] mb-6" />
            <h2 className="text-xl font-bold uppercase mb-4">Location</h2>
            <p className="text-[#888] leading-relaxed">
              Köpenicker Str. 173<br />
              10997 Berlin, Germany
            </p>
          </div>

          <div className="bg-[#141414] border border-[#333333] p-10">
            <Clock className="w-8 h-8 text-[var(--accent)] mb-6" />
            <h2 className="text-xl font-bold uppercase mb-4">Öffnungszeiten</h2>
            <p className="text-[#888] leading-relaxed">
              Donnerstag - Samstag<br />
              Ab 22:00 Uhr
            </p>
          </div>

          <div className="bg-[#141414] border border-[#333333] p-10">
            <Music className="w-8 h-8 text-[var(--accent)] mb-6" />
            <h2 className="text-xl font-bold uppercase mb-4">Music</h2>
            <p className="text-[#888] leading-relaxed">
              Techno, Industrial, Electronic<br />
              & Experimental underground sound
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="border border-[#333333] bg-[#141414] overflow-hidden mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 lg:p-20 flex flex-col justify-center">
              <div className="mono text-[var(--accent)] mb-6">Unsere Geschichte</div>
              <h2 className="text-3xl md:text-5xl font-black uppercase mb-8 leading-tight">Industrielles Erbe trifft Moderne</h2>
              <div className="space-y-6 text-[#888] text-lg leading-relaxed">
                <p>
                  Beheimatet in einem ehemaligen Heizkraftwerk, atmet jede Wand des Sage Clubs Geschichte. Die rohen Betonstrukturen und massiven Stahlelemente bieten die perfekte Kulisse für ungefilterte musikalische Exzesse.
                </p>
                <p>
                  Wir glauben an die verbindende Kraft der Musik. Jede Nacht im Sage ist eine Reise durch den Sound, bei der lokale Talente auf internationale Headliner treffen – in einer Atmosphäre, die Freiheit und Selbstentfaltung feiert.
                </p>
              </div>
              <Link href="/events" className="mt-12 inline-flex items-center gap-3 bg-[var(--accent)] text-black px-8 py-4 font-bold uppercase hover:bg-[var(--accent-hover)] transition-all self-start">
                Programm entdecken <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative aspect-square lg:aspect-auto min-h-[400px]">
              <Image 
                src="https://picsum.photos/seed/sage-interior/800/1000" 
                alt="Sage Club Interior" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-black border border-[#333333] py-20 px-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-12">Kontakt</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              href="mailto:info@sageclub.berlin"
              className="flex items-center gap-3 px-8 py-4 border border-[#333333] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all font-bold uppercase text-sm tracking-widest"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
            <a
              href="tel:+4930123456789"
              className="flex items-center gap-3 px-8 py-4 border border-[#333333] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all font-bold uppercase text-sm tracking-widest"
            >
              <Phone className="w-5 h-5" />
              <span>Telefon</span>
            </a>
            <a
              href="https://instagram.com/sageclub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 border border-[#333333] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all font-bold uppercase text-sm tracking-widest"
            >
              <Instagram className="w-5 h-5" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
