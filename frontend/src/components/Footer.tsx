import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#E6D5C3] ">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <span className="text-[#5A3A2A] font-serif text-sm tracking-wide">bubbles and Bliss</span>
          <span className="text-[#5A3A2A] font-serif text-sm tracking-wide">Bubbles & Bliss</span>
          <span className="text-[#5A3A2A] font-serif text-sm tracking-wide">OUR SIGNATURE SCENTS</span>
          <span className="text-[#5A3A2A] font-serif text-sm tracking-wide">LIMITED EDITIONS</span>
        </div>
        <div className="text-center text-[#8B5E3C] text-sm">
          <p>&copy; 2026 BUBBLES & BLISS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}