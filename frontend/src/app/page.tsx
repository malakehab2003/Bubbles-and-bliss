"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/ChatGPT Image Apr 21, 2026, 08_28_17 PM.png";
import image from "../../public/ChatGPT Image Apr 21, 2026, 08_38_58 PM.png";
import image2 from "../../public/ChatGPT Image Apr 21, 2026, 09_58_19 PM.png"
export default function HomePage() {
  const products = [
    {
      id: 1,
      name: "Midnight Wishes",
      price: "250 EGP",
    },
    {
      id: 2,
      name: "Sakura Soul",
      price: "250 EGP",
    },
    {
      id: 3,
      name: "Vanilla Peach",
      price: "250 EGP",
    },
  ];

  return (
    <div className="bg-[#F3E8DE] min-h-screen">
      {/* CONTAINER 1: Hero Section */}
      <section className="container mx-auto px-4 py-4 ">
        <div className="flex justify-center mb-12">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto relative rounded-full overflow-hidden bg-[#E6D5C3] mb-3">
              <Image
                src={logo}
                alt="BUBBLES & BLISS Logo"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#5A3A2A] tracking-wider">
              BUBBLES & BLISS
            </h1>
            <p className="text-base text-[#8B5E3C] tracking-wide">
              Fine Fragrance Collection
            </p>
          </div>
        </div>

        {/* محتوى الصورة والكلام جنب بعض */}
        <div className="flex flex-col md:flex-row items-center gap-6 mt-2">
          
          {/* Left Side - النص والزرار (على الشمال) */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-light text-[#5A3A2A] mb-4">
                THE POWER OF DUALITY
              </h2>
              <p className="text-base md:text-lg text-[#8B5E3C] leading-relaxed">
                Unlock the Mystery...<br />
                Unleash the Scent.
              </p>
            </div>

            <Link href="/shop">
              <button className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-5 py-3 rounded-full transition duration-300 transform hover:scale-105">
                Shop Now
              </button>
            </Link>
          </div>

          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-50 h-50 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] overflow-hidden">
              <Image
                src={image}
                alt="Perfume"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTAINER 2: Discover Your Collection - Products */}
      <section className="bg-[#E6D5C3] py-5 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl text-center text-[#5A3A2A] mb-12 font-serif tracking-wide">
            Discover Your Collection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                {/* صورة مربعة - مش دائرية */}
                <div className="w-full h-64 bg-[#F3E8DE] rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-[#D4C4B0] flex items-center justify-center text-[#8B5E3C]">
                    image
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#5A3A2A] mb-2">
                  {product.name}
                </h3>
                <p className="text-[#8B5E3C] mb-4">
                  {product.price}
                </p>
                <button 
                  onClick={() => alert(`Added ${product.name} to cart!`)}
                  className="border-2 border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white px-6 py-2 rounded-full transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTAINER 3: Experience Luxury & Bliss */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
          
          {/* Left Side - النص */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl text-[#5A3A2A] mb-6 font-serif">
              Experience Luxury & Bliss
            </h2>
            <p className="text-[#8B5E3C] leading-relaxed">
              At Bubbles & Bliss, we craft scents that enchant. Whether you seek the mysterious allure 
              of a starry night or the fresh, delicate bloom of a cherry orchard, our Fine Fragrance Mists 
              are designed to be a daily luxury, each one a thousand possibilities. Discover your signature 
              scent today.
            </p>
          </div>

          {/* Right Side - الصورة الجديدة */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-100 lg:h-100 overflow-hidden  rounded-2xl">
              <Image
                src={image2}
                alt="Luxury Perfume"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}