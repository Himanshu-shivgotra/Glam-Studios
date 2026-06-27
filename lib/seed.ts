import { Service, Outlet } from "./types";

export const SEED_SERVICES: Service[] = [
  { id:"s-haircut-w", name:"Haircut & Styling (Women)", category:"Hair", description:"Consultation, wash, precision cut and blow-dry styling.", duration:60, basePrice:899, forGender:"Women" },
  { id:"s-haircut-m", name:"Haircut & Beard Shape (Men)", category:"Hair", description:"Classic or modern cut with beard line-up.", duration:45, basePrice:499, forGender:"Men" },
  { id:"s-color", name:"Global Hair Colour", category:"Hair", description:"Ammonia-free full-head colour with gloss finish.", duration:120, basePrice:2499, forGender:"All" },
  { id:"s-highlights", name:"Highlights / Balayage", category:"Hair", description:"Hand-painted dimension for natural sun-kissed depth.", duration:150, basePrice:3999, forGender:"All" },
  { id:"s-keratin", name:"Keratin Smoothening", category:"Hair", description:"Frizz control and shine for up to 4 months.", duration:180, basePrice:4999, forGender:"All" },
  { id:"s-spa-hair", name:"Hair Spa & Scalp Treatment", category:"Hair", description:"Deep-conditioning ritual with scalp massage.", duration:50, basePrice:1199, forGender:"All" },
  { id:"s-facial", name:"Signature Glam Facial", category:"Skin & Facial", description:"Brightening facial with serum infusion and massage.", duration:60, basePrice:1799, forGender:"All" },
  { id:"s-cleanup", name:"Express Clean-up", category:"Skin & Facial", description:"Deep cleanse, exfoliation and hydration boost.", duration:40, basePrice:799, forGender:"All" },
  { id:"s-derma", name:"Dermaplaning Glow", category:"Skin & Facial", description:"Smooths texture and removes peach fuzz for instant glow.", duration:45, basePrice:2299, forGender:"All" },
  { id:"s-mani", name:"Luxury Manicure", category:"Nails", description:"Shaping, cuticle care, massage and polish.", duration:45, basePrice:699, forGender:"All" },
  { id:"s-pedi", name:"Spa Pedicure", category:"Nails", description:"Soak, scrub, callus care and relaxing massage.", duration:50, basePrice:899, forGender:"All" },
  { id:"s-gel", name:"Gel Extensions & Art", category:"Nails", description:"Long-lasting gel extensions with custom nail art.", duration:90, basePrice:1999, forGender:"All" },
  { id:"s-massage", name:"Aroma Relaxation Massage", category:"Spa & Massage", description:"Full-body de-stress massage with essential oils.", duration:60, basePrice:1999, forGender:"All" },
  { id:"s-deeptissue", name:"Deep Tissue Therapy", category:"Spa & Massage", description:"Targets knots and muscle tension.", duration:75, basePrice:2499, forGender:"All" },
  { id:"s-makeup-party", name:"Party / Event Makeup", category:"Makeup", description:"HD makeup with lashes for any occasion.", duration:60, basePrice:2499, forGender:"Women" },
  { id:"s-makeup-bridal", name:"Bridal Makeup", category:"Bridal", description:"Premium airbrush bridal look with draping.", duration:150, basePrice:14999, forGender:"Women" },
  { id:"s-shave", name:"Royal Shave & Face Care", category:"Grooming", description:"Hot-towel shave with face massage.", duration:30, basePrice:399, forGender:"Men" },
  { id:"s-detan", name:"De-Tan Treatment", category:"Grooming", description:"Removes tan, evens skin tone.", duration:30, basePrice:599, forGender:"All" },
];

export const SEED_OUTLETS: Outlet[] = [
  {
    id:"o-sec75", name:"Glam Studios — Sector 75",
    address:"Near Indosam Arcade Society, Sector 75", city:"Noida",
    phone:"+91 98110 22033", hours:"10:00 AM – 9:00 PM",
    image:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    priceOverrides:{}, disabledServices:[],
    stylists:[
      { id:"st-1", name:"Aanya Kapoor", role:"Senior Hair Stylist" },
      { id:"st-2", name:"Rohit Mehra", role:"Master Barber" },
      { id:"st-3", name:"Priya Nair", role:"Skin & Makeup Expert" },
    ],
  },
  {
    id:"o-sec18", name:"Glam Studios — Sector 18",
    address:"Atta Market, Sector 18", city:"Noida",
    phone:"+91 98110 22044", hours:"11:00 AM – 9:30 PM",
    image:"https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
    priceOverrides:{"s-haircut-w":1099,"s-makeup-bridal":17999},
    disabledServices:["s-deeptissue"],
    stylists:[
      { id:"st-4", name:"Sara Khan", role:"Creative Director" },
      { id:"st-5", name:"Vikram Singh", role:"Hair Colour Specialist" },
    ],
  },
];
