"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock, Search } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useStore, priceAt, servicesAt } from "@/lib/store";
import { CATEGORIES, Category } from "@/lib/types";
import { inr, fmtDuration, cn } from "@/lib/utils";

function ServicesInner() {
  const sp = useSearchParams();
  const initialCat = (sp.get("cat") as Category) || "All";
  const { services, outlets } = useStore();

  const [cat, setCat] = useState<Category|"All">(CATEGORIES.includes(initialCat as Category) ? initialCat : "All");
  const [gender, setGender] = useState<"All"|"Men"|"Women">("All");
  const [outletId, setOutletId] = useState<string>(outlets[0]?.id ?? "");
  const [q, setQ] = useState("");

  const outlet = outlets.find(o=>o.id===outletId) ?? outlets[0];

  const filtered = useMemo(() => {
    let list = outlet ? servicesAt(outlet, services) : services;
    if (cat!=="All") list=list.filter(s=>s.category===cat);
    if (gender!=="All") list=list.filter(s=>s.forGender===gender||s.forGender==="All");
    if (q.trim()) { const t=q.toLowerCase(); list=list.filter(s=>s.name.toLowerCase().includes(t)||s.description.toLowerCase().includes(t)); }
    return list;
  }, [services, outlet, cat, gender, q]);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-10">
      <Reveal className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-pink">Menu</p>
        <h1 className="mt-2 text-5xl font-semibold">Our Services</h1>
        <p className="mx-auto mt-3 max-w-md text-white/55">Prices shown for <span className="text-pink">{outlet?.name ?? "our salon"}</span>. Switch outlet to compare.</p>
      </Reveal>

      <div className="sticky top-24 z-30 mt-8 rounded-2xl glass p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3">
            <Search size={16} className="text-white/40" />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search services…" className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-white/40" />
          </div>
          <select value={outletId} onChange={e=>setOutletId(e.target.value)} className="rounded-xl bg-white/5 px-3 py-2.5 text-sm outline-none cursor-pointer">
            {outlets.map(o=><option key={o.id} value={o.id} className="bg-ink">{o.name}</option>)}
          </select>
          <select value={gender} onChange={e=>setGender(e.target.value as "All"|"Men"|"Women")} className="rounded-xl bg-white/5 px-3 py-2.5 text-sm outline-none cursor-pointer">
            <option value="All" className="bg-ink">Everyone</option>
            <option value="Women" className="bg-ink">Women</option>
            <option value="Men" className="bg-ink">Men</option>
          </select>
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {(["All",...CATEGORIES] as const).map(c=>(
            <button key={c} onClick={()=>setCat(c)} className={cn("whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors cursor-pointer", cat===c?"bg-pink text-white":"bg-white/5 text-white/60 hover:text-pink")}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s,i) => (
          <Reveal key={s.id} delay={(i%3)*0.06}>
            <div className="group flex h-full flex-col rounded-2xl glass p-6 transition-all hover:glass-pink hover:shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-pink/15 px-3 py-1 text-xs text-pink">{s.category}</span>
                {s.forGender!=="All" && <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/60">{s.forGender}</span>}
              </div>
              <h3 className="text-xl font-semibold">{s.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{s.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/45"><Clock size={13} /> {fmtDuration(s.duration)}</div>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-lg font-semibold text-pink">{outlet ? inr(priceAt(outlet,s)) : inr(s.basePrice)}</span>
                <Link href={`/book?service=${s.id}${outlet?`&outlet=${outlet.id}`:""}`} className="rounded-lg bg-pink/15 px-4 py-2 text-sm font-medium text-pink transition-colors hover:bg-pink hover:text-white cursor-pointer">Book</Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      {filtered.length===0 && <p className="mt-16 text-center text-white/50">No services match your filters.</p>}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-white/50">Loading…</div>}>
      <ServicesInner />
    </Suspense>
  );
}
