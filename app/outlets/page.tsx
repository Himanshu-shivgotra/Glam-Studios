"use client";

import Link from "next/link";
import { MapPin, Clock, Phone, ArrowRight, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useStore, servicesAt } from "@/lib/store";

export default function OutletsPage() {
  const { outlets, services } = useStore();
  return (
    <div className="mx-auto max-w-6xl px-6 pb-10">
      <Reveal className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-pink">Locations</p>
        <h1 className="mt-2 text-5xl font-semibold">Our Outlets</h1>
        <p className="mx-auto mt-3 max-w-md text-white/55">Same Glam standard, multiple neighbourhoods.</p>
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {outlets.map((o,i) => (
          <Reveal key={o.id} delay={i*0.1}>
            <div className="overflow-hidden rounded-3xl glass">
              <div className="relative h-56 overflow-hidden">
                <img src={o.image} alt={o.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <h2 className="absolute bottom-4 left-6 text-2xl font-semibold">{o.name}</h2>
              </div>
              <div className="space-y-3 p-6">
                <p className="flex items-center gap-2 text-sm text-white/65"><MapPin size={16} className="text-pink" /> {o.address}, {o.city}</p>
                <p className="flex items-center gap-2 text-sm text-white/65"><Clock size={16} className="text-pink" /> {o.hours}</p>
                <p className="flex items-center gap-2 text-sm text-white/65"><Phone size={16} className="text-pink" /> {o.phone}</p>
                <p className="flex items-center gap-2 text-sm text-white/65"><Users size={16} className="text-pink" /> {servicesAt(o,services).length} services · {o.stylists.length} stylists</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {o.stylists.map(st=>(
                    <span key={st.id} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">{st.name} · <span className="text-pink">{st.role}</span></span>
                  ))}
                </div>
                <Link href={`/book?outlet=${o.id}`} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink px-5 py-3 font-semibold text-white shadow-glow transition-colors hover:bg-pink-deep cursor-pointer">
                  Book at this outlet <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
