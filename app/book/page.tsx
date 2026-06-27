"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, MapPin, Clock, Scissors, Calendar, User, PartyPopper, Plus } from "lucide-react";
import { useStore, priceAt, servicesAt } from "@/lib/store";
import { Booking } from "@/lib/types";
import { inr, fmtDuration, fmtDate, uid, cn } from "@/lib/utils";

const TIME_SLOTS = ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];
const STEPS = ["Outlet","Services","Schedule","Details","Done"];

function todayStr() { return new Date().toISOString().slice(0,10); }

function BookInner() {
  const sp = useSearchParams();
  const { outlets, services, addBooking } = useStore();

  const [step, setStep] = useState(0);
  const [outletId, setOutletId] = useState(sp.get("outlet")||outlets[0]?.id||"");
  const [picked, setPicked] = useState<string[]>(sp.get("service")?[sp.get("service")!]:[]);
  const [stylistId, setStylistId] = useState<string|null>(null);
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState("");
  const [form, setForm] = useState({ name:"", phone:"", email:"", notes:"" });
  const [confirmedId, setConfirmedId] = useState<string|null>(null);

  const outlet = outlets.find(o=>o.id===outletId);
  const available = outlet ? servicesAt(outlet,services) : [];
  const pickedServices = services.filter(s=>picked.includes(s.id));
  const total = useMemo(()=>(outlet?pickedServices.reduce((sum,s)=>sum+priceAt(outlet,s),0):0),[pickedServices,outlet]);
  const totalMins = pickedServices.reduce((sum,s)=>sum+s.duration,0);

  const canNext = (step===0&&!!outletId)||(step===1&&picked.length>0)||(step===2&&!!date&&!!time)||(step===3&&form.name.trim()&&form.phone.trim().length>=8);

  function toggleService(id:string){ setPicked(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); }

  function confirm(){
    if(!outlet) return;
    const b:Booking={ id:uid("GS"), outletId, serviceIds:picked, stylistId, date, time,
      customerName:form.name.trim(), phone:form.phone.trim(), email:form.email.trim(),
      notes:form.notes.trim(), total, status:"Pending", createdAt:Date.now() };
    addBooking(b); setConfirmedId(b.id); setStep(4);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-10">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-pink">Appointment</p>
        <h1 className="mt-2 text-5xl font-semibold">Book your visit</h1>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        {STEPS.map((s,i)=>(
          <div key={s} className="flex items-center gap-2">
            <div className={cn("flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              i===step?"bg-pink text-white":i<step?"bg-pink/20 text-pink":"bg-white/5 text-white/40")}>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15 text-[10px]">
                {i<step?<Check size={12}/>:i+1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </div>
            {i<STEPS.length-1 && <div className="h-px w-4 bg-white/15 sm:w-6" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="rounded-3xl glass p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.3}}>

              {step===0 && (
                <div>
                  <h2 className="text-2xl font-semibold">Choose an outlet</h2>
                  <div className="mt-5 space-y-3">
                    {outlets.map(o=>(
                      <button key={o.id} onClick={()=>setOutletId(o.id)} className={cn("flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors cursor-pointer",outletId===o.id?"border-pink glass-pink":"border-white/10 hover:border-pink/40")}>
                        <img src={o.image} alt={o.name} className="h-16 w-16 rounded-xl object-cover" />
                        <div className="flex-1">
                          <div className="font-semibold">{o.name}</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-white/55"><MapPin size={12} className="text-pink" /> {o.address}, {o.city}</div>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-white/55"><Clock size={12} className="text-pink" /> {o.hours}</div>
                        </div>
                        {outletId===o.id && <Check className="text-pink" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step===1 && (
                <div>
                  <h2 className="text-2xl font-semibold">Pick your services</h2>
                  <p className="mt-1 text-sm text-white/50">Select one or more.</p>
                  <div className="no-scrollbar mt-5 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                    {available.map(s=>{
                      const on=picked.includes(s.id);
                      return (
                        <button key={s.id} onClick={()=>toggleService(s.id)} className={cn("flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors cursor-pointer",on?"border-pink glass-pink":"border-white/10 hover:border-pink/40")}>
                          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg",on?"bg-pink text-white":"bg-white/5 text-white/40")}>
                            {on?<Check size={16}/>:<Plus size={16}/>}
                          </span>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{s.name}</div>
                            <div className="text-xs text-white/45">{s.category} · {fmtDuration(s.duration)}</div>
                          </div>
                          <span className="text-sm font-semibold text-pink">{outlet?inr(priceAt(outlet,s)):inr(s.basePrice)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step===2 && (
                <div>
                  <h2 className="text-2xl font-semibold">Pick date, time & stylist</h2>
                  <label className="mt-5 block text-sm text-white/60">Date</label>
                  <input type="date" value={date} min={todayStr()} onChange={e=>setDate(e.target.value)} className="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 text-sm outline-none [color-scheme:dark] cursor-pointer" />
                  <label className="mt-5 block text-sm text-white/60">Time slot</label>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {TIME_SLOTS.map(t=>(
                      <button key={t} onClick={()=>setTime(t)} className={cn("rounded-lg py-2.5 text-sm transition-colors cursor-pointer",time===t?"bg-pink text-white":"bg-white/5 text-white/70 hover:text-pink")}>{t}</button>
                    ))}
                  </div>
                  <label className="mt-5 block text-sm text-white/60">Stylist (optional)</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button onClick={()=>setStylistId(null)} className={cn("rounded-lg px-4 py-2 text-sm transition-colors cursor-pointer",stylistId===null?"bg-pink text-white":"bg-white/5 text-white/70")}>Any available</button>
                    {outlet?.stylists.map(st=>(
                      <button key={st.id} onClick={()=>setStylistId(st.id)} className={cn("rounded-lg px-4 py-2 text-sm transition-colors cursor-pointer",stylistId===st.id?"bg-pink text-white":"bg-white/5 text-white/70")}>{st.name}</button>
                    ))}
                  </div>
                </div>
              )}

              {step===3 && (
                <div>
                  <h2 className="text-2xl font-semibold">Your details</h2>
                  <div className="mt-5 space-y-4">
                    {[{l:"Full name *",k:"name",p:"Jane Doe"},{l:"Phone *",k:"phone",p:"+91 98xxx xxxxx"},{l:"Email",k:"email",p:"you@email.com"}].map(f=>(
                      <label key={f.k} className="block">
                        <span className="mb-1.5 block text-sm text-white/60">{f.l}</span>
                        <input value={form[f.k as keyof typeof form]} onChange={e=>setForm({...form,[f.k]:e.target.value})} placeholder={f.p} className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-pink/50 placeholder:text-white/35" />
                      </label>
                    ))}
                    <label className="block">
                      <span className="mb-1.5 block text-sm text-white/60">Notes</span>
                      <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Any preferences or allergies?" rows={3} className="w-full resize-none rounded-xl bg-white/5 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-pink/50 placeholder:text-white/35" />
                    </label>
                  </div>
                </div>
              )}

              {step===4 && confirmedId && (
                <div className="py-6 text-center">
                  <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:200}} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-pink text-white shadow-glow">
                    <PartyPopper size={36} />
                  </motion.div>
                  <h2 className="mt-5 text-3xl font-semibold">Booking confirmed!</h2>
                  <p className="mt-2 text-white/60">Reference <span className="font-mono text-pink">{confirmedId}</span></p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-white/50">See you on {fmtDate(date)} at {time}, {outlet?.name}.</p>
                  <div className="mt-7 flex justify-center gap-3">
                    <Link href="/bookings" className="rounded-xl bg-pink px-6 py-3 font-semibold text-white shadow-glow hover:bg-pink-deep cursor-pointer">My Bookings</Link>
                    <Link href="/" className="rounded-xl glass px-6 py-3 font-semibold hover:text-pink cursor-pointer">Home</Link>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step<4 && (
            <div className="mt-8 flex items-center justify-between">
              <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} className={cn("inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm transition-colors",step===0?"opacity-0":"glass hover:text-pink cursor-pointer")}>
                <ChevronLeft size={16} /> Back
              </button>
              {step<3 ? (
                <button onClick={()=>canNext&&setStep(s=>s+1)} disabled={!canNext} className={cn("inline-flex items-center gap-1 rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors",canNext?"bg-pink text-white shadow-glow hover:bg-pink-deep cursor-pointer":"bg-white/10 text-white/40 cursor-not-allowed")}>
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={()=>canNext&&confirm()} disabled={!canNext} className={cn("inline-flex items-center gap-1 rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors",canNext?"bg-pink text-white shadow-glow hover:bg-pink-deep cursor-pointer":"bg-white/10 text-white/40 cursor-not-allowed")}>
                  Confirm booking <Check size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-3xl glass-pink p-6">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            {[
              { icon:<MapPin size={14}/>, label:"Outlet", value:outlet?.name??"—" },
              { icon:<Calendar size={14}/>, label:"When", value:time?`${fmtDate(date)} · ${time}`:"—" },
              { icon:<User size={14}/>, label:"Stylist", value:outlet?.stylists.find(s=>s.id===stylistId)?.name??"Any available" },
            ].map(r=>(
              <div key={r.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-white/50"><span className="text-pink">{r.icon}</span>{r.label}</span>
                <span className="text-right font-medium text-white/90">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-white/50"><Scissors size={12} /> Services ({picked.length})</div>
            {pickedServices.length===0 && <p className="text-sm text-white/40">None selected yet</p>}
            {pickedServices.map(s=>(
              <div key={s.id} className="flex items-center justify-between py-1 text-sm">
                <span className="text-white/75">{s.name}</span>
                <span className="text-white/90">{outlet?inr(priceAt(outlet,s)):inr(s.basePrice)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm text-white/55"><span>Duration</span><span>{fmtDuration(totalMins)}</span></div>
            <div className="mt-1 flex items-center justify-between text-lg font-semibold"><span>Total</span><span className="text-pink">{inr(total)}</span></div>
            <p className="mt-1 text-xs text-white/40">Pay at outlet after service.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-white/50">Loading…</div>}>
      <BookInner />
    </Suspense>
  );
}
