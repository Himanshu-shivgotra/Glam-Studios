"use client";

import { useState } from "react";
import { LayoutDashboard, CalendarCheck, Store, Scissors, IndianRupee, Lock, LogOut, Plus, Trash2, Check, X, Users, RotateCcw, TrendingUp } from "lucide-react";
import { useStore, priceAt } from "@/lib/store";
import { CATEGORIES, Category, Service, Outlet, Stylist, BookingStatus } from "@/lib/types";
import { inr, fmtDate, uid, cn } from "@/lib/utils";

type Tab = "overview"|"bookings"|"outlets"|"services"|"pricing";

export default function AdminPage() {
  const authed = useStore(s=>s.adminAuthed);
  return authed ? <AdminDash /> : <Login />;
}

function Login() {
  const login = useStore(s=>s.login);
  const [pw,setPw]=useState(""); const [err,setErr]=useState(false);
  return (
    <div className="mx-auto flex max-w-md flex-col px-6 pb-10">
      <div className="rounded-3xl glass p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-pink text-white shadow-glow"><Lock size={24} /></span>
        <h1 className="mt-5 text-3xl font-semibold">Admin Access</h1>
        <p className="mt-2 text-sm text-white/55">Manage outlets, services, pricing and bookings.</p>
        <form onSubmit={e=>{e.preventDefault();if(!login(pw))setErr(true);}} className="mt-6">
          <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false);}} placeholder="Password" className="w-full rounded-xl bg-white/5 px-4 py-3 text-center outline-none focus:ring-2 focus:ring-pink/50" />
          {err && <p className="mt-2 text-sm text-red-400">Wrong password. Try again.</p>}
          <button className="mt-4 w-full rounded-xl bg-pink px-6 py-3 font-semibold text-white shadow-glow hover:bg-pink-deep cursor-pointer">Enter dashboard</button>
          <p className="mt-3 text-xs text-white/35">Demo password: <span className="text-pink">glam123</span></p>
        </form>
      </div>
    </div>
  );
}

function AdminDash() {
  const [tab,setTab]=useState<Tab>("overview");
  const logout=useStore(s=>s.logout);
  const resetDemo=useStore(s=>s.resetDemo);
  const TABS=[
    {id:"overview" as Tab,label:"Overview",icon:<LayoutDashboard size={18}/>},
    {id:"bookings" as Tab,label:"Bookings",icon:<CalendarCheck size={18}/>},
    {id:"outlets" as Tab,label:"Outlets",icon:<Store size={18}/>},
    {id:"services" as Tab,label:"Services",icon:<Scissors size={18}/>},
    {id:"pricing" as Tab,label:"Pricing",icon:<IndianRupee size={18}/>},
  ];
  return (
    <div className="mx-auto max-w-6xl px-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-4xl font-semibold">Admin Dashboard</h1><p className="mt-1 text-sm text-white/55">Glam Studios control center</p></div>
        <div className="flex gap-2">
          <button onClick={()=>{if(confirm("Reset all data to demo defaults?"))resetDemo();}} className="inline-flex items-center gap-1 rounded-xl glass px-4 py-2.5 text-sm hover:text-pink cursor-pointer"><RotateCcw size={15}/> Reset demo</button>
          <button onClick={logout} className="inline-flex items-center gap-1 rounded-xl glass px-4 py-2.5 text-sm hover:text-pink cursor-pointer"><LogOut size={15}/> Logout</button>
        </div>
      </div>
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto rounded-2xl glass p-1.5">
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} className={cn("inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer",tab===t.id?"bg-pink text-white":"text-white/60 hover:text-pink")}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab==="overview" && <Overview/>}
        {tab==="bookings" && <BookingsAdmin/>}
        {tab==="outlets" && <OutletsAdmin/>}
        {tab==="services" && <ServicesAdmin/>}
        {tab==="pricing" && <PricingAdmin/>}
      </div>
    </div>
  );
}

function Overview() {
  const {bookings,outlets,services}=useStore();
  const revenue=bookings.filter(b=>b.status!=="Cancelled").reduce((s,b)=>s+b.total,0);
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {icon:<CalendarCheck/>,label:"Total bookings",value:bookings.length},
          {icon:<TrendingUp/>,label:"Revenue (booked)",value:inr(revenue)},
          {icon:<Store/>,label:"Outlets",value:outlets.length},
          {icon:<Scissors/>,label:"Services",value:services.length},
        ].map(s=>(
          <div key={s.label} className="rounded-2xl glass p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-pink/15 text-pink">{s.icon}</span>
            <div className="mt-4 text-2xl font-semibold">{s.value}</div>
            <div className="text-sm text-white/50">{s.label}</div>
          </div>
        ))}
      </div>
      <h2 className="mt-8 mb-3 text-lg font-semibold">Recent bookings</h2>
      <div className="rounded-2xl glass divide-y divide-white/5">
        {bookings.slice(0,6).map(b=>{
          const o=outlets.find(x=>x.id===b.outletId);
          return (<div key={b.id} className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm font-medium">{b.customerName} <span className="text-white/40">· {b.serviceIds.length} svc</span></div>
              <div className="text-xs text-white/45">{o?.name} · {fmtDate(b.date)} {b.time}</div>
            </div>
            <div className="text-sm font-semibold text-pink">{inr(b.total)}</div>
          </div>);
        })}
        {bookings.length===0 && <div className="p-6 text-center text-sm text-white/45">No bookings yet.</div>}
      </div>
    </div>
  );
}

function StatusPill({status}:{status:BookingStatus}) {
  const map:Record<BookingStatus,string>={Pending:"bg-amber-500/15 text-amber-300",Confirmed:"bg-pink/15 text-pink",Completed:"bg-emerald-500/15 text-emerald-300",Cancelled:"bg-white/10 text-white/40"};
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium",map[status])}>{status}</span>;
}

function BookingsAdmin() {
  const {bookings,outlets,services,setBookingStatus,removeBooking}=useStore();
  const next:Record<BookingStatus,BookingStatus|null>={Pending:"Confirmed",Confirmed:"Completed",Completed:null,Cancelled:null};
  return (
    <div className="space-y-3">
      {bookings.length===0 && <div className="rounded-2xl glass p-8 text-center text-sm text-white/45">No bookings yet.</div>}
      {bookings.map(b=>{
        const o=outlets.find(x=>x.id===b.outletId);
        const items=services.filter(s=>b.serviceIds.includes(s.id));
        const adv=next[b.status];
        return (
          <div key={b.id} className="rounded-2xl glass p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2"><span className="font-mono text-xs text-white/45">{b.id}</span><StatusPill status={b.status}/></div>
                <div className="mt-1 font-semibold">{b.customerName} · <span className="text-white/55">{b.phone}</span></div>
                <div className="text-xs text-white/45">{o?.name} · {fmtDate(b.date)} {b.time}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">{items.map(s=><span key={s.id} className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-white/70">{s.name}</span>)}</div>
                {b.notes && <div className="mt-2 text-xs text-white/45">Note: {b.notes}</div>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-lg font-semibold text-pink">{inr(b.total)}</div>
                <div className="flex gap-2">
                  {adv && <button onClick={()=>setBookingStatus(b.id,adv)} className="rounded-lg bg-pink/15 px-3 py-1.5 text-xs font-medium text-pink hover:bg-pink hover:text-white cursor-pointer">Mark {adv}</button>}
                  {b.status!=="Cancelled"&&b.status!=="Completed" && <button onClick={()=>setBookingStatus(b.id,"Cancelled")} className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:text-red-300 cursor-pointer">Cancel</button>}
                  <button onClick={()=>removeBooking(b.id)} className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-white/50 hover:text-red-400 cursor-pointer"><Trash2 size={13}/></button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ServicesAdmin() {
  const {services,addService,updateService,removeService}=useStore();
  const blank={name:"",category:"Hair" as Category,description:"",duration:45,basePrice:500,forGender:"All" as Service["forGender"]};
  const [draft,setDraft]=useState(blank);
  const [showAdd,setShowAdd]=useState(false);
  function add(){ if(!draft.name.trim())return; addService({id:uid("s"),...draft}); setDraft(blank);setShowAdd(false); }
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Services ({services.length})</h2>
        <button onClick={()=>setShowAdd(v=>!v)} className="inline-flex items-center gap-1 rounded-xl bg-pink px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-pink-deep cursor-pointer"><Plus size={16}/> Add service</button>
      </div>
      {showAdd && (
        <div className="mb-5 rounded-2xl glass-pink p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <In label="Name" value={draft.name} onChange={v=>setDraft({...draft,name:v})}/>
            <Sel label="Category" value={draft.category} options={CATEGORIES} onChange={v=>setDraft({...draft,category:v as Category})}/>
            <Sel label="For" value={draft.forGender} options={["All","Women","Men"]} onChange={v=>setDraft({...draft,forGender:v as Service["forGender"]})}/>
            <In label="Duration (min)" type="number" value={String(draft.duration)} onChange={v=>setDraft({...draft,duration:+v||0})}/>
            <In label="Base price (₹)" type="number" value={String(draft.basePrice)} onChange={v=>setDraft({...draft,basePrice:+v||0})}/>
            <In label="Description" value={draft.description} onChange={v=>setDraft({...draft,description:v})} full/>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={add} className="rounded-lg bg-pink px-5 py-2 text-sm font-semibold text-white cursor-pointer">Save</button>
            <button onClick={()=>{setShowAdd(false);setDraft(blank);}} className="rounded-lg glass px-5 py-2 text-sm cursor-pointer">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {services.map(s=>(
          <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl glass p-4">
            <span className="rounded-full bg-pink/15 px-2.5 py-0.5 text-xs text-pink">{s.category}</span>
            <input defaultValue={s.name} onBlur={e=>updateService(s.id,{name:e.target.value})} className="flex-1 min-w-[160px] bg-transparent text-sm font-medium outline-none focus:text-pink"/>
            <label className="flex items-center gap-1 text-xs text-white/45">₹<input type="number" defaultValue={s.basePrice} onBlur={e=>updateService(s.id,{basePrice:+e.target.value||0})} className="w-20 rounded bg-white/5 px-2 py-1 text-sm text-white outline-none"/></label>
            <label className="flex items-center gap-1 text-xs text-white/45"><input type="number" defaultValue={s.duration} onBlur={e=>updateService(s.id,{duration:+e.target.value||0})} className="w-16 rounded bg-white/5 px-2 py-1 text-sm text-white outline-none"/> min</label>
            <button onClick={()=>{if(confirm(`Delete "${s.name}"?`))removeService(s.id);}} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/50 hover:text-red-400 cursor-pointer"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutletsAdmin() {
  const {outlets,addOutlet,updateOutlet,removeOutlet,addStylist,removeStylist}=useStore();
  const blank={name:"",address:"",city:"",phone:"",hours:"10:00 AM – 9:00 PM",image:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"};
  const [draft,setDraft]=useState(blank);
  const [showAdd,setShowAdd]=useState(false);
  const [stName,setStName]=useState<Record<string,{name:string;role:string}>>({});
  function add(){ if(!draft.name.trim())return; addOutlet({id:uid("o"),...draft,priceOverrides:{},disabledServices:[],stylists:[]}); setDraft(blank);setShowAdd(false); }
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Outlets ({outlets.length})</h2>
        <button onClick={()=>setShowAdd(v=>!v)} className="inline-flex items-center gap-1 rounded-xl bg-pink px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-pink-deep cursor-pointer"><Plus size={16}/> Add outlet</button>
      </div>
      {showAdd && (
        <div className="mb-5 rounded-2xl glass-pink p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <In label="Outlet name" value={draft.name} onChange={v=>setDraft({...draft,name:v})}/>
            <In label="City" value={draft.city} onChange={v=>setDraft({...draft,city:v})}/>
            <In label="Address" value={draft.address} onChange={v=>setDraft({...draft,address:v})}/>
            <In label="Phone" value={draft.phone} onChange={v=>setDraft({...draft,phone:v})}/>
            <In label="Hours" value={draft.hours} onChange={v=>setDraft({...draft,hours:v})}/>
            <In label="Image URL" value={draft.image} onChange={v=>setDraft({...draft,image:v})} full/>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={add} className="rounded-lg bg-pink px-5 py-2 text-sm font-semibold text-white cursor-pointer">Save outlet</button>
            <button onClick={()=>{setShowAdd(false);setDraft(blank);}} className="rounded-lg glass px-5 py-2 text-sm cursor-pointer">Cancel</button>
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {outlets.map(o=>(
          <div key={o.id} className="rounded-2xl glass p-5">
            <div className="flex items-start gap-3">
              <img src={o.image} alt={o.name} className="h-16 w-16 rounded-xl object-cover"/>
              <div className="flex-1">
                <input defaultValue={o.name} onBlur={e=>updateOutlet(o.id,{name:e.target.value})} className="w-full bg-transparent text-base font-semibold outline-none focus:text-pink"/>
                <input defaultValue={o.address} onBlur={e=>updateOutlet(o.id,{address:e.target.value})} className="mt-1 w-full bg-transparent text-xs text-white/55 outline-none"/>
                <div className="mt-1 flex gap-2">
                  <input defaultValue={o.city} onBlur={e=>updateOutlet(o.id,{city:e.target.value})} className="w-20 bg-transparent text-xs text-white/55 outline-none"/>
                  <input defaultValue={o.phone} onBlur={e=>updateOutlet(o.id,{phone:e.target.value})} className="flex-1 bg-transparent text-xs text-white/55 outline-none"/>
                </div>
              </div>
              <button onClick={()=>{if(confirm(`Delete outlet "${o.name}"?`))removeOutlet(o.id);}} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/50 hover:text-red-400 cursor-pointer"><Trash2 size={14}/></button>
            </div>
            <div className="mt-4 border-t border-white/5 pt-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/45"><Users size={12}/> Stylists</div>
              <div className="flex flex-wrap gap-1.5">
                {o.stylists.map(st=>(
                  <span key={st.id} className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs">
                    {st.name} <span className="text-pink">· {st.role}</span>
                    <button onClick={()=>removeStylist(o.id,st.id)} className="ml-1 text-white/40 hover:text-red-400 cursor-pointer"><X size={11}/></button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input placeholder="Name" value={stName[o.id]?.name??""} onChange={e=>setStName({...stName,[o.id]:{...(stName[o.id]??{role:""}),name:e.target.value}})} className="w-24 rounded-lg bg-white/5 px-2 py-1.5 text-xs outline-none"/>
                <input placeholder="Role" value={stName[o.id]?.role??""} onChange={e=>setStName({...stName,[o.id]:{...(stName[o.id]??{name:""}),role:e.target.value}})} className="flex-1 rounded-lg bg-white/5 px-2 py-1.5 text-xs outline-none"/>
                <button onClick={()=>{const d=stName[o.id];if(!d?.name?.trim())return;addStylist(o.id,{id:uid("st"),name:d.name.trim(),role:d.role?.trim()||"Stylist"});setStName({...stName,[o.id]:{name:"",role:""}});}} className="rounded-lg bg-pink/15 px-3 py-1.5 text-xs font-medium text-pink hover:bg-pink hover:text-white cursor-pointer">Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingAdmin() {
  const {outlets,services,setOutletPrice,toggleOutletService}=useStore();
  const [outletId,setOutletId]=useState(outlets[0]?.id??"");
  const outlet=outlets.find(o=>o.id===outletId);
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Per-outlet pricing & availability</h2>
        <select value={outletId} onChange={e=>setOutletId(e.target.value)} className="rounded-xl bg-white/5 px-4 py-2.5 text-sm outline-none cursor-pointer">
          {outlets.map(o=><option key={o.id} value={o.id} className="bg-ink">{o.name}</option>)}
        </select>
      </div>
      {!outlet ? (
        <div className="rounded-2xl glass p-8 text-center text-sm text-white/45">Add an outlet first.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl glass">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-white/10 px-5 py-3 text-xs uppercase tracking-wider text-white/45">
            <span>Service</span><span>Base</span><span>This outlet</span><span>Available</span>
          </div>
          <div className="divide-y divide-white/5">
            {services.map(s=>{
              const disabled=outlet.disabledServices.includes(s.id);
              const override=outlet.priceOverrides[s.id];
              return (
                <div key={s.id} className={cn("grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-5 py-3",disabled&&"opacity-40")}>
                  <div><div className="text-sm font-medium">{s.name}</div><div className="text-xs text-white/40">{s.category}</div></div>
                  <div className="text-sm text-white/50">{inr(s.basePrice)}</div>
                  <input type="number" defaultValue={override??""} placeholder={String(s.basePrice)} onBlur={e=>{const v=e.target.value.trim();setOutletPrice(outlet.id,s.id,v===""?null:+v);}} className="w-24 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-pink outline-none focus:ring-2 focus:ring-pink/40"/>
                  <button onClick={()=>toggleOutletService(outlet.id,s.id)} className={cn("grid h-8 w-8 place-items-center rounded-lg cursor-pointer",disabled?"bg-white/5 text-white/40":"bg-emerald-500/15 text-emerald-300")} title={disabled?"Disabled":"Available"}>
                    {disabled?<X size={15}/>:<Check size={15}/>}
                  </button>
                </div>
              );
            })}
          </div>
          <p className="border-t border-white/10 px-5 py-3 text-xs text-white/40">Leave price blank to use base price. Toggle check to hide a service at this outlet.</p>
        </div>
      )}
    </div>
  );
}

function In({label,value,onChange,type="text",full}:{label:string;value:string;onChange:(v:string)=>void;type?:string;full?:boolean}) {
  return (
    <label className={cn("block",full&&"sm:col-span-2")}>
      <span className="mb-1 block text-xs text-white/55">{label}</span>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink/40"/>
    </label>
  );
}
function Sel({label,value,options,onChange}:{label:string;value:string;options:readonly string[];onChange:(v:string)=>void}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-white/55">{label}</span>
      <select value={value} onChange={e=>onChange(e.target.value)} className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm outline-none cursor-pointer">
        {options.map(o=><option key={o} value={o} className="bg-ink">{o}</option>)}
      </select>
    </label>
  );
}

// suppress unused import warning
const _priceAt = priceAt;
void _priceAt;
