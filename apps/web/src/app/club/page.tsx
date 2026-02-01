import { MapPin, Clock, Mail, Phone, Instagram, Music } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function ClubPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />
      
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About SAGE Club</h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            SAGE Club is Berlin&apos;s premier destination for electronic music, 
            bringing together world-class DJs and passionate music lovers in an intimate setting.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <MapPin className="w-8 h-8 text-amber-500 mb-4" />
            <h2 className="text-xl font-bold mb-3">Location</h2>
            <p className="text-zinc-400">
              Alexanderplatz 1<br />
              10178 Berlin, Germany
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <Clock className="w-8 h-8 text-amber-500 mb-4" />
            <h2 className="text-xl font-bold mb-3">Opening Hours</h2>
            <p className="text-zinc-400">
              Thursday - Saturday<br />
              23:00 - 08:00
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <Music className="w-8 h-8 text-amber-500 mb-4" />
            <h2 className="text-xl font-bold mb-3">Music</h2>
            <p className="text-zinc-400">
              Techno, House, Electronic<br />
              Underground & Experimental
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-zinc-900 rounded-2xl p-8 lg:p-12 border border-zinc-800 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-zinc-300">
                <p>
                  Founded in 2015, SAGE Club has established itself as a cornerstone of Berlin&apos;s 
                  vibrant nightlife scene. Our mission is to create unforgettable experiences 
                  through cutting-edge sound systems, immersive lighting, and carefully curated lineups.
                </p>
                <p>
                  We believe in the power of music to bring people together. Every night at SAGE 
                  is a journey through sound, where local talent meets international headliners 
                  in an atmosphere that celebrates freedom and expression.
                </p>
                <p>
                  Our commitment to quality extends beyond the dance floor. From our state-of-the-art 
                  Funktion-One sound system to our sustainable practices, we strive to set new 
                  standards for club culture in Berlin.
                </p>
              </div>
            </div>
            <div className="aspect-video bg-zinc-800 rounded-xl flex items-center justify-center">
              <Music className="w-24 h-24 text-zinc-700" />
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="mailto:info@sageclub.berlin"
              className="flex items-center gap-3 px-6 py-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <Mail className="w-5 h-5 text-amber-500" />
              <span>info@sageclub.berlin</span>
            </a>
            <a
              href="tel:+4930123456789"
              className="flex items-center gap-3 px-6 py-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <Phone className="w-5 h-5 text-amber-500" />
              <span>+49 30 123 456 789</span>
            </a>
            <a
              href="https://instagram.com/sageclub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <Instagram className="w-5 h-5 text-amber-500" />
              <span>@sageclub</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
