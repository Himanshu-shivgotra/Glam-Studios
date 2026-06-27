"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Scissors, Sparkles, Hand, Flower2, Brush, User, Crown,
  Star, ArrowRight, Clock, MapPin, ShieldCheck, Award,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { useStore, priceAt } from "@/lib/store";
import { CATEGORIES, Category } from "@/lib/types";
import { inr } from "@/lib/utils";

const HeroParticles = dynamic(() => import("@/components/HeroParticles"), { ssr: false });

const CAT_ICON: Record<Category, React.ReactNode> = {
  Hair: <Scissors size={22} />,
  "Skin & Facial": <Sparkles size={22} />,
  Nails: <Hand size={22} />,
  "Spa & Massage": <Flower2 size={22} />,
  Makeup: <Brush size={22} />,
  Grooming: <User size={22} />,
  Bridal: <Crown size={22} />,
};

const TESTIMONIALS = [
  { name:"Neha S.", text:"Best balayage in Noida — the team actually listens. Left feeling like a star.", role:"Regular client" },
  { name:"Arjun M.", text:"Clean, premium, and the barbers know their craft. My go-to for cut + beard.", role:"Member since 2023" },
  { name:"Pooja & Raghav", text:"Booked the bridal package — flawless from trial to the big day. Highly recommend.", role:"Bridal clients" },
];

export default function Home() {
  const { services, outlets } = useStore();
  const featured = services.slice(0, 6);
  const homeOutlet = outlets[0];

  return (
    <div className="overflow-hidden">
      {/* HERO — full-bleed video + Three.js particles */}
      <section className="relative -mt-24 flex min-h-screen items-center overflow-hidden">
        {/* Animated CSS fallback (shows while/if video loads) */}
        <div className="absolute inset-0 hero-gradient-bg" />

        {/* Salon video background */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          style={{ zIndex:1 }}
          autoPlay muted loop playsInline preload="auto"
          poster="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=1920&q=80"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-getting-a-hair-treatment-at-a-beauty-salon-42954-large.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/3196081/3196081-hd_1920_1080_25fps.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/3196081/3196081-sd_640_360_25fps.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ zIndex:2, background:"linear-gradient(to right,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.6) 55%,rgba(0,0,0,0.15) 100%)" }} />
        <div className="absolute inset-0" style={{ zIndex:2, background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 45%,rgba(0,0,0,0.3) 100%)" }} />
        <div className="absolute pointer-events-none" style={{ zIndex:2, left:"-5%", top:"40%", width:560, height:560, borderRadius:"50%", background:"radial-gradient(circle,rgba(236,72,153,0.22) 0%,transparent 70%)", filter:"blur(40px)", transform:"translateY(-50%)" }} />

        {/* Three.js particles */}
        <HeroParticles />

        {/* Content */}
        <div className="relative w-full max-w-6xl mx-auto px-6 pt-28 pb-16" style={{ zIndex:10 }}>
          <motion.span
            initial={{ opacity:0, y:-12 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.55 }}
            className="inline-flex items-center gap-2 rounded-full glass-pink px-4 py-1.5 text-xs font-medium text-pink-soft"
          >
            <Sparkles size={13} /> Unisex Luxury Salon · Noida
          </motion.span>

          <div className="mt-5 overflow-hidden">
            <motion.div initial={{ y:"110%" }} animate={{ y:0 }} transition={{ duration:0.75, delay:0.1, ease:[0.22,1,0.36,1] }}>
              <h1 className="text-[clamp(3.2rem,8vw,6.5rem)] font-semibold leading-[0.97] tracking-tight">Walk in.</h1>
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div initial={{ y:"110%" }} animate={{ y:0 }} transition={{ duration:0.75, delay:0.22, ease:[0.22,1,0.36,1] }}>
              <h1 className="text-[clamp(3.2rem,8vw,6.5rem)] font-semibold leading-[0.97] tracking-tight text-gradient">Glow out.</h1>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity:0, y:18 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.42 }}
            className="mt-7 max-w-[480px] text-lg leading-relaxed text-white/68"
          >
            Hair · Skin · Nails · Spa · Makeup · Bridal.<br />
            Award-winning artists. Book in under a minute.
          </motion.p>

          <motion.div
            initial={{ opacity:0, y:18 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6, delay:0.56 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link href="/book" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-pink px-8 py-4 text-base font-semibold text-white shadow-glow cursor-pointer">
              <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
              Book Appointment
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 rounded-2xl border border-white/22 px-8 py-4 text-base font-semibold text-white/90 backdrop-blur-sm transition-all duration-200 hover:border-pink hover:text-pink cursor-pointer">
              Explore Services
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ duration:1, delay:0.75 }}
            className="mt-14 flex flex-wrap gap-x-8 gap-y-4"
          >
            {[
              { n:"15K+", l:"Happy clients" },
              { n:`${services.length}+`, l:"Services" },
              { n:`${outlets.length}`, l:"Outlets" },
              { n:"4.9 ★", l:"Rating" },
            ].map((s,i) => (
              <div key={s.l} className="relative">
                {i!==0 && <div className="absolute -left-4 top-1/2 h-7 w-px -translate-y-1/2 bg-white/12" />}
                <div className="text-[1.6rem] font-semibold leading-none text-white">{s.n}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-white/42">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex:10 }}>
          <motion.div animate={{ y:[0,9,0] }} transition={{ duration:1.6, repeat:Infinity, ease:"easeInOut" }}
            className="flex h-10 w-5 items-start justify-center rounded-full border border-white/20 pt-1.5">
            <div className="h-2 w-0.5 rounded-full bg-pink" />
          </motion.div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">Scroll</span>
        </div>
      </section>

      <style jsx global>{`
        .hero-gradient-bg {
          background: linear-gradient(135deg,#0a0005 0%,#1a000f 35%,#0f0005 65%,#1a000f 100%);
          background-size: 400% 400%;
          animation: heroBgShift 10s ease infinite;
        }
        @keyframes heroBgShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Reveal className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-pink">What we do</p>
          <h2 className="mt-2 text-4xl font-semibold">Every look, under one roof</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((c,i) => (
            <Reveal key={c} delay={i*0.05}>
              <Link href={`/services?cat=${encodeURIComponent(c)}`} className="group flex h-full flex-col items-center gap-3 rounded-2xl glass p-5 text-center transition-colors hover:glass-pink cursor-pointer">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-pink/15 text-pink transition-colors group-hover:bg-pink group-hover:text-white">
                  {CAT_ICON[c]}
                </span>
                <span className="text-xs font-medium text-white/80">{c}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-pink">Popular</p>
            <h2 className="mt-2 text-4xl font-semibold">Featured services</h2>
          </div>
          <Link href="/services" className="hidden items-center gap-1 text-sm text-pink hover:underline sm:flex cursor-pointer">All services <ArrowRight size={16} /></Link>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s,i) => (
            <Reveal key={s.id} delay={(i%3)*0.08}>
              <div className="group flex h-full flex-col rounded-2xl glass p-6 transition-all duration-300 hover:glass-pink hover:shadow-soft">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-pink/15 px-3 py-1 text-xs text-pink">{s.category}</span>
                  <span className="flex items-center gap-1 text-xs text-white/50"><Clock size={13} /> {s.duration}m</span>
                </div>
                <h3 className="text-xl font-semibold">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{s.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-lg font-semibold text-pink">{homeOutlet ? inr(priceAt(homeOutlet,s)) : inr(s.basePrice)}</span>
                  <Link href={`/book?service=${s.id}`} className="rounded-lg bg-pink/15 px-4 py-2 text-sm font-medium text-pink transition-colors hover:bg-pink hover:text-white cursor-pointer">Book</Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon:<ShieldCheck />, t:"Hygiene first", d:"Sterilised tools, single-use kits, sanitised stations after every guest." },
            { icon:<Award />, t:"Expert artists", d:"Certified stylists trained on the latest global techniques and trends." },
            { icon:<Sparkles />, t:"Premium products", d:"Only trusted, skin-friendly and ammonia-free professional brands." },
          ].map((f,i) => (
            <Reveal key={f.t} delay={i*0.1}>
              <div className="h-full rounded-2xl glass p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-pink text-white shadow-glow">{f.icon}</span>
                <h3 className="mt-4 text-xl font-semibold">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OUTLETS */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Reveal className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-pink">Find us</p>
          <h2 className="mt-2 text-4xl font-semibold">Our outlets</h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {outlets.map((o,i) => (
            <Reveal key={o.id} delay={i*0.1}>
              <Link href={`/book?outlet=${o.id}`} className="group block overflow-hidden rounded-2xl glass cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img src={o.image} alt={o.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{o.name}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-white/55"><MapPin size={15} className="text-pink" /> {o.address}, {o.city}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-white/55"><Clock size={15} className="text-pink" /> {o.hours}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Reveal className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-pink">Loved by Noida</p>
          <h2 className="mt-2 text-4xl font-semibold">Don&apos;t take our word for it</h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t,i) => (
            <Reveal key={t.name} delay={i*0.1}>
              <div className="h-full rounded-2xl glass p-7">
                <div className="flex gap-1 text-pink">{Array.from({length:5}).map((_,k)=><Star key={k} size={15} className="fill-pink" />)}</div>
                <p className="mt-4 text-sm leading-relaxed text-white/75">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-5">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-white/45">{t.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl glass-pink p-10 text-center md:p-16">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink/30 blur-3xl" />
            <h2 className="text-4xl font-semibold md:text-5xl">Ready for your glow-up?</h2>
            <p className="mx-auto mt-4 max-w-md text-white/65">Book online in seconds. Pick your outlet, service and time — we&apos;ll handle the rest.</p>
            <Link href="/book" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-pink px-8 py-4 font-semibold text-white shadow-glow transition-colors hover:bg-pink-deep cursor-pointer">
              Book Your Appointment <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
