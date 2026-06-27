export type Category =
  | "Hair"
  | "Skin & Facial"
  | "Nails"
  | "Spa & Massage"
  | "Makeup"
  | "Grooming"
  | "Bridal";

export const CATEGORIES: Category[] = [
  "Hair","Skin & Facial","Nails","Spa & Massage","Makeup","Grooming","Bridal",
];

export interface Service {
  id: string;
  name: string;
  category: Category;
  description: string;
  duration: number;
  basePrice: number;
  forGender: "All" | "Men" | "Women";
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
}

export interface Outlet {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  image: string;
  priceOverrides: Record<string, number>;
  disabledServices: string[];
  stylists: Stylist[];
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
  id: string;
  outletId: string;
  serviceIds: string[];
  stylistId: string | null;
  date: string;
  time: string;
  customerName: string;
  phone: string;
  email: string;
  notes: string;
  total: number;
  status: BookingStatus;
  createdAt: number;
}
