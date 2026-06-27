"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Booking, BookingStatus, Outlet, Service, Stylist } from "./types";
import { SEED_OUTLETS, SEED_SERVICES } from "./seed";

interface State {
  services: Service[];
  outlets: Outlet[];
  bookings: Booking[];
  adminAuthed: boolean;
  login: (pw: string) => boolean;
  logout: () => void;
  addService: (s: Service) => void;
  updateService: (id: string, patch: Partial<Service>) => void;
  removeService: (id: string) => void;
  addOutlet: (o: Outlet) => void;
  updateOutlet: (id: string, patch: Partial<Outlet>) => void;
  removeOutlet: (id: string) => void;
  setOutletPrice: (outletId: string, serviceId: string, price: number | null) => void;
  toggleOutletService: (outletId: string, serviceId: string) => void;
  addStylist: (outletId: string, st: Stylist) => void;
  removeStylist: (outletId: string, stylistId: string) => void;
  addBooking: (b: Booking) => void;
  setBookingStatus: (id: string, status: BookingStatus) => void;
  removeBooking: (id: string) => void;
  resetDemo: () => void;
}

const ADMIN_PW = "glam123";

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      services: SEED_SERVICES,
      outlets: SEED_OUTLETS,
      bookings: [],
      adminAuthed: false,

      login: (pw) => { const ok = pw === ADMIN_PW; if (ok) set({ adminAuthed: true }); return ok; },
      logout: () => set({ adminAuthed: false }),

      addService: (s) => set({ services: [...get().services, s] }),
      updateService: (id, patch) => set({ services: get().services.map((s) => s.id === id ? { ...s, ...patch } : s) }),
      removeService: (id) => set({
        services: get().services.filter((s) => s.id !== id),
        outlets: get().outlets.map((o) => ({
          ...o,
          disabledServices: o.disabledServices.filter((x) => x !== id),
          priceOverrides: Object.fromEntries(Object.entries(o.priceOverrides).filter(([k]) => k !== id)),
        })),
      }),

      addOutlet: (o) => set({ outlets: [...get().outlets, o] }),
      updateOutlet: (id, patch) => set({ outlets: get().outlets.map((o) => o.id === id ? { ...o, ...patch } : o) }),
      removeOutlet: (id) => set({
        outlets: get().outlets.filter((o) => o.id !== id),
        bookings: get().bookings.filter((b) => b.outletId !== id),
      }),
      setOutletPrice: (outletId, serviceId, price) => set({
        outlets: get().outlets.map((o) => {
          if (o.id !== outletId) return o;
          const po = { ...o.priceOverrides };
          if (price === null || Number.isNaN(price)) delete po[serviceId];
          else po[serviceId] = price;
          return { ...o, priceOverrides: po };
        }),
      }),
      toggleOutletService: (outletId, serviceId) => set({
        outlets: get().outlets.map((o) => {
          if (o.id !== outletId) return o;
          const has = o.disabledServices.includes(serviceId);
          return { ...o, disabledServices: has ? o.disabledServices.filter((x) => x !== serviceId) : [...o.disabledServices, serviceId] };
        }),
      }),
      addStylist: (outletId, st) => set({ outlets: get().outlets.map((o) => o.id === outletId ? { ...o, stylists: [...o.stylists, st] } : o) }),
      removeStylist: (outletId, stylistId) => set({ outlets: get().outlets.map((o) => o.id === outletId ? { ...o, stylists: o.stylists.filter((s) => s.id !== stylistId) } : o) }),

      addBooking: (b) => set({ bookings: [b, ...get().bookings] }),
      setBookingStatus: (id, status) => set({ bookings: get().bookings.map((b) => b.id === id ? { ...b, status } : b) }),
      removeBooking: (id) => set({ bookings: get().bookings.filter((b) => b.id !== id) }),

      resetDemo: () => set({ services: SEED_SERVICES, outlets: SEED_OUTLETS, bookings: [] }),
    }),
    { name: "glam-studios-v1", skipHydration: true }
  )
);

export function priceAt(outlet: Outlet, service: Service): number {
  return outlet.priceOverrides[service.id] ?? service.basePrice;
}

export function servicesAt(outlet: Outlet, services: Service[]): Service[] {
  return services.filter((s) => !outlet.disabledServices.includes(s.id));
}
