"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href:"/", label:"Home" },
  { href:"/services", label:"Services" },
  { href:"/outlets", label:"Outlets" },
  { href:"/bookings", label:"My Bookings" },
  { href:"/admin", label:"Admin" },
];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav className={cn("flex w-full max-w-6xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300", scrolled ? "glass shadow-soft" : "bg-transparent")}>
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-pink text-white shadow-glow">
            <Scissors size={18} />
          </span>
          <span className="font-[var(--font-display)] text-lg font-semibold tracking-tight">
            Glam<span className="text-pink"> Studios</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={cn("rounded-lg px-3 py-2 text-sm transition-colors duration-200 cursor-pointer hover:text-pink", path===l.href?"text-pink":"text-white/70")}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link href="/book" className="rounded-xl bg-pink px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-pink-deep cursor-pointer">
            Book Now
          </Link>
        </div>

        <button className="grid h-10 w-10 place-items-center rounded-lg text-white md:hidden cursor-pointer" onClick={() => setOpen(v=>!v)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="absolute inset-x-4 top-20 z-50 flex flex-col gap-1 rounded-2xl glass p-3 md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={cn("rounded-lg px-4 py-3 text-sm cursor-pointer", path===l.href?"bg-pink/15 text-pink":"text-white/80")}>
              {l.label}
            </Link>
          ))}
          <Link href="/book" onClick={() => setOpen(false)} className="mt-1 rounded-lg bg-pink px-4 py-3 text-center text-sm font-semibold text-white cursor-pointer">
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
