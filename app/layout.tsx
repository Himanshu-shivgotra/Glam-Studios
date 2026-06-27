import type { Metadata } from "next";
import "./globals.css";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hydrate from "@/components/Hydrate";

export const metadata: Metadata = {
  title: "Glam Studios — Unisex Luxury Salon, Noida",
  description: "Book hair, skin, nails, spa, makeup & bridal services at Glam Studios. Award-winning unisex salon with multiple outlets across Noida.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Background />
        <Hydrate />
        <Navbar />
        <main className="min-h-screen pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
