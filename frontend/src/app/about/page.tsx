import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/ChatGPT Image Apr 21, 2026, 08_28_17 PM.png";

export default function AboutPage() {
  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section صغير */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto relative rounded-full overflow-hidden bg-[#E6D5C3] mb-4">
            <Image
              src={logo}
              alt="BUBBLES & BLISS Logo"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#5A3A2A] tracking-wide">
            About Us
          </h1>
          <p className="text-[#8B5E3C] mt-2">Discover Our Story</p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Card 1 - Our Story */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-md">
            <h2 className="text-2xl font-serif text-[#5A3A2A] mb-4 text-center">
              Our Story
            </h2>
            <p className="text-[#8B5E3C] leading-relaxed mb-4">
              At Bubbles & Bliss, we believe that fragrance is more than just a scent—it's an emotion, 
              a memory, and a statement of who you are. Founded with a passion for luxury and accessibility, 
              we bring you the finest fragrance mists that capture the essence of life's most beautiful moments.
            </p>
            <p className="text-[#8B5E3C] leading-relaxed">
              Each bottle in our collection is carefully crafted to provide a daily luxury experience, 
              whether you're drawn to the mysterious allure of midnight blooms or the fresh, delicate 
              whisper of spring blossoms.
            </p>
          </div>

          {/* Card 2 - Our Mission */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-md">
            <h2 className="text-2xl font-serif text-[#5A3A2A] mb-4 text-center">
              Our Mission
            </h2>
            <p className="text-[#8B5E3C] leading-relaxed mb-4">
              Our mission is to make luxury fragrances accessible to everyone without compromising 
              on quality. We carefully source the finest ingredients to create scents that linger, 
              enchant, and become an integral part of your daily ritual.
            </p>
            <p className="text-[#8B5E3C] leading-relaxed">
              We are committed to sustainability, using eco-friendly packaging and responsible 
              sourcing practices to ensure that our beautiful fragrances don't come at the cost 
              of our planet.
            </p>
          </div>

          {/* Card 3 - Why Choose Us */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-md">
            <h2 className="text-2xl font-serif text-[#5A3A2A] mb-4 text-center">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">✨</div>
                <h3 className="font-semibold text-[#5A3A2A] mb-2">Premium Quality</h3>
                <p className="text-[#8B5E3C] text-sm">
                  Long-lasting fragrances made with premium ingredients
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💝</div>
                <h3 className="font-semibold text-[#5A3A2A] mb-2">Affordable Luxury</h3>
                <p className="text-[#8B5E3C] text-sm">
                  Luxury scents at prices you'll love
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🚚</div>
                <h3 className="font-semibold text-[#5A3A2A] mb-2">Fast Shipping</h3>
                <p className="text-[#8B5E3C] text-sm">
                  Quick delivery across Egypt
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-semibold text-[#5A3A2A] mb-2">100% Authentic</h3>
                <p className="text-[#8B5E3C] text-sm">
                  Guaranteed original products
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <Link href="/">
              <button className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-8 py-3 rounded-full transition duration-300 transform hover:scale-105">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}