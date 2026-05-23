import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReactQueryProvider from "@/lib/providers/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BUBBLES & BLISS | Luxury Body Splash",
  description: "Handcrafted body splashes made from the finest natural ingredients.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <ReactQueryProvider>

          {/* ── Announcement Marquee — فوق كل حاجة ── */}
          <div style={{ background: "#2C1A0E", padding: "10px 0", overflow: "hidden", position: "relative", zIndex: 51 }}>
            <style>{`
              @keyframes marquee-scroll {
                from { transform: translateX(0); }
                to   { transform: translateX(-50%); }
              }
              .marquee-inner {
                display: flex;
                animation: marquee-scroll 25s linear infinite;
                white-space: nowrap;
              }
              .marquee-inner:hover { animation-play-state: paused; }
            `}</style>
            <div className="marquee-inner">
              {Array(10).fill(null).map((_, i) => (
                <span key={i} style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#C4A882",
                  padding: "0 28px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 18,
                  whiteSpace: "nowrap",
                }}>
                  ✦ Free Shipping Over 500 EGP
                  <span style={{ color: "#4A2E1A" }}>|</span>
                  🌿 100% Natural Ingredients
                  <span style={{ color: "#4A2E1A" }}>|</span>
                  Long-Lasting Freshness
                  <span style={{ color: "#4A2E1A" }}>|</span>
                  Handcrafted in Egypt
                </span>
              ))}
            </div>
          </div>

          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />

          <Toaster
            position="top-center"
            toastOptions={{
              duration: 1500,
              style: { background: "#363636", color: "#fff" },
              success: {
                duration: 1500,
                iconTheme: { primary: "#8B5E3C", secondary: "#fff" },
              },
              error: {
                duration: 2000,
                iconTheme: { primary: "#ef4444", secondary: "#fff" },
              },
            }}
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}