"use client";

import Link from "next/link";
import { CalendarX, MapPin, Calendar, Scissors, X } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useStore } from "@/lib/store";
import { inr, fmtDate, cn } from "@/lib/utils";
import { BookingStatus } from "@/lib/types";

const STATUS_STYLE: Record<BookingStatus, string> = {
  Pending:"bg-amber-500/15 text-amber-300",
  Confirmed:"bg-pink/15 text-pink",
  Completed:"bg-emerald-500/15 text-emerald-300",
  Cancelled:"bg-white/10 text-white/40 line-through",
};

export default function BookingsPage() {
  const { bookings, outlets, services, setBookingStatus } = useStore();
  return (
    <div className="mx-auto max-w-4xl px-6 pb-10">
      <Reveal className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-pink">Your visits</p>
        <h1 className="mt-2 text-5xl font-semibold">My Bookings</h1>
      </Reveal>

      {bookings.length===0 ? (
        <div className="mt-12 flex flex-col items-center rounded-3xl glass p-12 text-center">
          <CalendarX size={48} className="text-pink" />
          <h2 className="mt-4 text-xl font-semibold">No bookings yet</h2>
          <p className="mt-2 text-sm text-white/55">Your appointments will show up here.</p>
          <Link href="/book" className="mt-6 rounded-xl bg-pink px-6 py-3 font-semibold text-white shadow-glow hover:bg-pink-deep cursor-pointer">Book now</Link>
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {bookings.map((b,i) => {
            const outlet = outlets.find(o=>o.id===b.outletId);
            const items = services.filter(s=>b.serviceIds.includes(s.id));
            return (
              <Reveal key={b.id} delay={i*0.05}>
                <div className="rounded-2xl glass p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-white/45">{b.id}</span>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_STYLE[b.status])}>{b.status}</span>
                      </div>
                      <h3 className="mt-1.5 text-lg font-semibold">{outlet?.name ?? "Outlet removed"}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-pink">{inr(b.total)}</div>
                      <div className="text-xs text-white/45">{b.customerName}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/60">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-pink" /> {fmtDate(b.date)} · {b.time}</span>
                    {outlet && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-pink" /> {outlet.city}</span>}
                    <span className="flex items-center gap-1.5"><Scissors size={14} className="text-pink" /> {items.length} service(s)</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {items.map(s=><span key={s.id} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">{s.name}</span>)}
                  </div>
                  {b.status!=="Cancelled" && b.status!=="Completed" && (
                    <button onClick={()=>setBookingStatus(b.id,"Cancelled")} className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/60 transition-colors hover:text-red-300 cursor-pointer">
                      <X size={13} /> Cancel booking
                    </button>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
