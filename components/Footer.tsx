import Link from "next/link";
import { Scissors, Instagram, Facebook, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line/60 px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-pink text-white"><Scissors size={18} /></span>
            <span className="text-lg font-semibold">Glam<span className="text-pink"> Studios</span></span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Unisex luxury salon. Hair, skin, nails, spa, makeup & bridal — crafted by award-winning artists across Noida.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-lg glass cursor-pointer transition-colors hover:text-pink"><Instagram size={18} /></a>
            <a href="#" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-lg glass cursor-pointer transition-colors hover:text-pink"><Facebook size={18} /></a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li><Link href="/services" className="cursor-pointer hover:text-pink">Services</Link></li>
            <li><Link href="/outlets" className="cursor-pointer hover:text-pink">Outlets</Link></li>
            <li><Link href="/book" className="cursor-pointer hover:text-pink">Book Appointment</Link></li>
            <li><Link href="/bookings" className="cursor-pointer hover:text-pink">My Bookings</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Reach Us</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 text-pink" /> Sector 75, Noida</li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-pink" /> +91 98110 22033</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-line/60 pt-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Glam Studios. All rights reserved.
      </div>
    </footer>
  );
}
