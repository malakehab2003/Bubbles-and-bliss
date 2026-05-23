"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, ArrowRight, Sparkles, Droplets, Leaf, Star } from "lucide-react";
import toast from "react-hot-toast";
import logo from "../../public/ChatGPT Image Apr 21, 2026, 08_28_17 PM.png";
import image from "../../public/ChatGPT Image Apr 21, 2026, 08_38_58 PM.png";
import image2 from "../../public/ChatGPT Image Apr 21, 2026, 09_58_19 PM.png";

interface Product {
  id: number;
  name: string;
  price: number;
  sale: number;
  description?: string;
  image?: { url: string }[];
  images?: { url: string }[];
}

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [wishIds, setWishIds] = useState<Set<number>>(new Set());
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    fetchFeatured();
    const token = localStorage.getItem("token");
    if (token) fetchWishlist(token);

    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/product/list?page=1");
      const data = await res.json();
      setProducts((data.products || []).slice(0, 3));
    } catch {}
  };

  const fetchWishlist = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/wishlist/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setWishIds(new Set((data.wishlist || []).map((w: any) => w.product_id)));
    } catch {}
  };

  const addToCart = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please sign in first"); router.push("/signin"); return; }
    setAddingId(productId);
    try {
      const res = await fetch("http://localhost:5000/api/cart/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      if (res.ok) { toast.success("Added to cart! 🛒"); window.dispatchEvent(new Event("cartUpdated")); }
      else toast.error("Already in cart");
    } catch { toast.error("Something went wrong"); }
    finally { setAddingId(null); }
  };

  const toggleWishlist = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please sign in first"); return; }
    const inWish = wishIds.has(productId);
    try {
      if (inWish) {
        await fetch(`http://localhost:5000/api/wishlist/delete/${productId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        setWishIds(p => { const s = new Set(p); s.delete(productId); return s; });
        toast.success("Removed from wishlist");
      } else {
        await fetch("http://localhost:5000/api/wishlist/addProduct", {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ product_id: productId }),
        });
        setWishIds(p => new Set(p).add(productId));
        toast.success("Saved ❤️");
      }
    } catch {}
  };

  const getImg = (p: Product) => p.image?.[0]?.url || p.images?.[0]?.url || null;
  const getPrice = (p: Product) => p.sale > 0 ? p.price * (1 - p.sale / 100) : p.price;

  return (
    <div style={{ background: "#F3E8DE", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; }

        .hp { font-family: 'DM Sans', sans-serif; color: #3D2310; }

        /* Grain */
        .grain-layer {
          position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.4;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
        }

        /* Animations */
        @keyframes fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-14px); } }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes shimmer-slide {
          0%   { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(300%) rotate(25deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes reveal-line { from { scaleX:0; } to { scaleX:1; } }

        .a1 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) both; }
        .a2 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .a3 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        .a4 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.45s both; }
        .a5 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.6s both; }
        .float { animation: float 7s ease-in-out infinite; }

        /* Serif font */
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }

        /* ── HERO ── */
        .hero-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(3.2rem, 7.5vw, 6rem);
          font-weight: 300;
          line-height: 1.0;
          letter-spacing: -0.02em;
          color: #2C1A0E;
        }
        .hero-title em { font-style: italic; color: #8B5E3C; }

        /* ── BUTTONS ── */
        .btn-dark {
          display: inline-flex; align-items: center; gap: 10px;
          background: #2C1A0E; color: #F3E8DE;
          padding: 16px 40px; border-radius: 100px;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
          text-decoration: none; border: none; cursor: pointer;
          position: relative; overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .btn-dark::after {
          content: ''; position: absolute; top: -50%; left: -60%;
          width: 40%; height: 200%; background: rgba(255,255,255,0.15);
          transform: rotate(25deg);
          transition: left 0.5s ease;
        }
        .btn-dark:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(44,26,14,0.3); }
        .btn-dark:hover::after { left: 120%; }
        .btn-dark svg { transition: transform 0.3s; }
        .btn-dark:hover svg { transform: translateX(5px); }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1.5px solid #C4A882; color: #5A3A2A;
          padding: 13px 30px; border-radius: 100px;
          font-size: 0.78rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
          text-decoration: none; transition: all 0.3s; background: transparent;
          cursor: pointer;
        }
        .btn-outline:hover { background: #2C1A0E; color: #F3E8DE; border-color: #2C1A0E; transform: translateY(-1px); }

        /* ── PRODUCT CARDS ── */
        .pcard {
          position: relative;
          background: rgba(255,255,255,0.45);
          backdrop-filter: blur(16px);
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(230,213,195,0.7);
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .pcard:hover { transform: translateY(-10px); box-shadow: 0 30px 70px rgba(44,26,14,0.16); }
        .pcard-img {
          width: 100%; aspect-ratio: 3/4;
          background: #E6D5C3; overflow: hidden; position: relative;
        }
        .pcard-img img { width:100%; height:100%; object-fit:cover; transition: transform 0.6s ease; }
        .pcard:hover .pcard-img img { transform: scale(1.08); }

        /* shimmer on hover */
        .pcard::before {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%);
          z-index: 5; transition: none; pointer-events: none;
        }
        .pcard:hover::before { animation: shimmer-slide 0.7s ease forwards; }

        .pcard-actions {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 16px;
          background: linear-gradient(to top, rgba(44,26,14,0.85) 0%, transparent 100%);
          display: flex; gap: 8px;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
          z-index: 4;
        }
        .pcard:hover .pcard-actions { transform: translateY(0); }

        .cart-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          background: #F3E8DE; color: #2C1A0E;
          border: none; border-radius: 100px;
          padding: 10px 16px; font-size: 12px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
          transition: all 0.2s;
        }
        .cart-btn:hover { background: white; transform: scale(1.02); }
        .cart-btn:disabled { opacity: 0.6; }

        .wish-btn {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; backdrop-filter: blur(8px);
        }
        .wish-btn:hover { background: rgba(255,255,255,0.35); transform: scale(1.1); }
        .wish-btn.active { background: rgba(229,62,62,0.8); border-color: transparent; }

        /* badge top right */
        .sale-badge {
          position: absolute; top: 14px; left: 14px;
          background: #2C1A0E; color: #F3E8DE;
          font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
          padding: 4px 10px; border-radius: 100px; z-index: 3;
        }

        /* ── MARQUEE ── */
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { display: flex; animation: marquee 22s linear infinite; white-space: nowrap; }
        .marquee-track:hover { animation-play-state: paused; }

        /* ── FEATURES ── */
        .feature-item {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: 36px 28px;
          background: rgba(255,255,255,0.5);
          border: 1px solid #E6D5C3; border-radius: 28px;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }
        .feature-item:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(44,26,14,0.1); background: rgba(255,255,255,0.75); }
        .feature-icon {
          width: 60px; height: 60px; border-radius: 50%;
          background: linear-gradient(135deg, #E6D5C3, #F3E8DE);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px; border: 1px solid #D4B896;
        }

        /* ── ABOUT SECTION ── */
        .about-img-wrap {
          border-radius: 32px 64px 32px 64px;
          overflow: hidden; position: relative;
          box-shadow: 0 40px 100px rgba(44,26,14,0.2);
        }

        /* ── TESTIMONIALS ── */
        .review-card {
          background: rgba(255,255,255,0.55);
          border: 1px solid #E6D5C3; border-radius: 22px;
          padding: 28px; backdrop-filter: blur(10px);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .review-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(44,26,14,0.1); }

        /* ── FOOTER STRIP ── */
        .footer-strip {
          background: #2C1A0E; padding: 24px 32px;
          display: flex; align-items: center; justify-content: center;
          gap: 32px; flex-wrap: wrap;
        }
        .footer-item {
          font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: #C4A882; display: flex; align-items: center; gap: 8px;
        }

        /* Social icons */
        .social-circle {
          width: 48px; height: 48px; border-radius: 50%;
          border: 1.5px solid #E6D5C3;
          background: rgba(255,255,255,0.6);
          display: flex; align-items: center; justify-content: center;
          color: #8B5E3C; transition: all 0.3s; cursor: pointer; text-decoration: none;
        }
        .social-circle:hover { background: #2C1A0E; color: #F3E8DE; border-color: #2C1A0E; transform: translateY(-3px) rotate(-5deg); }

        /* section label */
        .section-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 0.68rem; letter-spacing: 0.28em; text-transform: uppercase; color: #8B5E3C;
          margin-bottom: 14px;
        }
        .section-eyebrow::before, .section-eyebrow::after {
          content: ''; width: 24px; height: 1px; background: #C4A882;
        }

        /* hero image shape */
        .hero-img-shape {
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          overflow: hidden;
          width: 420px; height: 520px;
          box-shadow: 0 48px 120px rgba(44,26,14,0.22);
          position: relative;
        }
        @media (max-width: 900px) {
          .hero-img-shape { width: 300px; height: 370px; }
          .hero-title { font-size: clamp(2.5rem, 8vw, 3.5rem); }
        }
        @media (max-width: 600px) {
          .hero-img-shape { width: 240px; height: 300px; }
        }

        /* drop badge */
        .drop-badge {
          background: #FFFAF7; border: 1px solid #E6D5C3;
          border-radius: 18px; padding: 14px 18px;
          box-shadow: 0 12px 40px rgba(44,26,14,0.13);
          position: absolute; z-index: 10;
        }

        /* star */
        .stars { display: flex; gap: 2px; }

        @media (max-width: 768px) {
          .products-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr 1fr !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <div className="hp">
        <div className="grain-layer" />

        {/* ══════════════════════ HERO ══════════════════════ */}
        <section style={{ minHeight: "95vh", display: "flex", alignItems: "center", padding: "70px 0 50px", position: "relative" }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,168,130,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "15%", left: "3%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,94,60,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", width: "100%", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 64, flexWrap: "wrap" }}>

              {/* ── LEFT ── */}
              <div style={{ flex: 1, minWidth: 280, maxWidth: 580 }}>
                <div className="a1">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(139,94,60,0.1)", border: "1px solid rgba(196,168,130,0.4)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
                    <Droplets style={{ width: 12, height: 12, color: "#8B5E3C" }} />
                    <span style={{ fontSize: "0.67rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#8B5E3C", fontWeight: 500 }}>
                      Luxury Body Splash
                    </span>
                  </div>
                </div>

                <h1 className="hero-title a2">
                  Your Skin<br />
                  Deserves<br />
                  <em>Pure Bliss</em>
                </h1>

                <p className="a3" style={{ marginTop: 28, marginBottom: 44, fontSize: "0.97rem", color: "#6B4A2A", lineHeight: 1.85, fontWeight: 300, maxWidth: 440 }}>
                  Handcrafted body splashes made from the finest natural ingredients. Long-lasting freshness, silky feel, and captivating scents — for skin that glows from within.
                </p>

                <div className="a4" style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                  <Link href="/shop" className="btn-dark">
                    <span>Shop Now</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </Link>
                  <Link href="/about" className="btn-outline">Our Story</Link>
                </div>

                {/* Trust avatars */}
                <div className="a5" style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 52 }}>
                  <div style={{ display: "flex" }}>
                    {["#D4B896","#C4A882","#A8845A","#8B5E3C"].map((c, i) => (
                      <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: "2.5px solid #F3E8DE", marginLeft: i > 0 ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 12, color: "#F3E8DE", fontWeight: 700 }}>{String.fromCharCode(65+i)}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="stars">
                      {[1,2,3,4,5].map(s => <Star key={s} style={{ width: 12, height: 12, fill: "#D4B896", color: "#D4B896" }} />)}
                    </div>
                    <p style={{ fontSize: "0.76rem", color: "#8B5E3C", fontWeight: 300, marginTop: 2 }}>
                      <strong style={{ color: "#2C1A0E" }}>2,400+</strong> happy customers
                    </p>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Image ── */}
              <div style={{ position: "relative", flexShrink: 0 }} className="a2">
                <div className="hero-img-shape float">
                  <Image src={image} alt="Bubbles & Bliss Body Splash" fill style={{ objectFit: "cover" }} />
                </div>

                {/* Badge 1 */}
                <div className="drop-badge" style={{ bottom: 50, left: -24 }}>
                  <p style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B5E3C", marginBottom: 3 }}>Crafted For</p>
                  <p style={{ fontSize: "0.88rem", fontFamily: "'Cormorant Garamond', serif", color: "#2C1A0E", fontWeight: 600 }}>Every Skin Type ✦</p>
                </div>

                {/* Badge 2 */}
                <div className="drop-badge" style={{ top: 40, right: -20 }}>
                  <p style={{ fontSize: "0.62rem", color: "#8B5E3C", marginBottom: 2 }}>🌿 100% Natural</p>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2C1A0E" }}>No Parabens</p>
                </div>

                {/* Deco ring */}
                <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", border: "1px dashed #D4B896", opacity: 0.5, animation: "spin-slow 30s linear infinite" }} />
              </div>
            </div>
          </div>
        </section>



        {/* ══════════════════════ FEATURES ══════════════════════ */}
        <section style={{ padding: "90px 32px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div className="section-eyebrow">Why Choose Us</div>
              <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 400, color: "#2C1A0E" }}>
                The Bubbles & Bliss <em style={{ fontStyle: "italic", color: "#8B5E3C" }}>Difference</em>
              </h2>
            </div>

            <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {[
                { icon: <Droplets style={{ width: 22, height: 22, color: "#8B5E3C" }} />, title: "Ultra-Hydrating", desc: "Infused with moisturising agents that keep your skin soft all day." },
                { icon: <Leaf style={{ width: 22, height: 22, color: "#8B5E3C" }} />, title: "100% Natural", desc: "No harmful chemicals. Only pure, skin-loving ingredients." },
                { icon: <Sparkles style={{ width: 22, height: 22, color: "#8B5E3C" }} />, title: "Long-Lasting", desc: "Our unique formula keeps you fresh and fragrant for hours." },
                { icon: <Star style={{ width: 22, height: 22, color: "#8B5E3C" }} />, title: "Award-Winning", desc: "Loved by thousands of customers across Egypt." },
              ].map((f, i) => (
                <div key={i} className="feature-item">
                  <div className="feature-icon">{f.icon}</div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 600, color: "#2C1A0E", marginBottom: 8 }}>{f.title}</p>
                  <p style={{ fontSize: "0.83rem", color: "#8B5E3C", lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ PRODUCTS ══════════════════════ */}
        <section style={{ padding: "0 32px 100px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
              <div>
                <div className="section-eyebrow">Bestsellers</div>
                <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 400, color: "#2C1A0E", margin: 0 }}>
                  Our <em style={{ fontStyle: "italic", color: "#8B5E3C" }}>Favourites</em>
                </h2>
              </div>
              <Link href="/shop" className="btn-outline">
                View All <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>

            {products.length === 0 ? (
              /* Skeleton */
              <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ borderRadius: 24, overflow: "hidden", background: "rgba(255,255,255,0.4)" }}>
                    <div style={{ aspectRatio: "3/4", background: "linear-gradient(110deg, #E6D5C3 30%, #F3E8DE 50%, #E6D5C3 70%)", backgroundSize: "200% 100%", animation: "shimmer-slide 1.5s ease infinite" }} />
                    <div style={{ padding: 20 }}>
                      <div style={{ height: 16, borderRadius: 8, background: "#E6D5C3", marginBottom: 10, width: "70%" }} />
                      <div style={{ height: 14, borderRadius: 8, background: "#E6D5C3", width: "40%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {products.map((p, idx) => {
                  const imgUrl = getImg(p);
                  const finalPrice = getPrice(p);
                  const inWish = wishIds.has(p.id);
                  const isAdding = addingId === p.id;

                  return (
                    <Link href={`/shop/${p.id}`} key={p.id} className="pcard" style={{ animationDelay: `${idx * 80}ms` }}>
                      <div className="pcard-img">
                        {imgUrl ? (
                          <img src={imgUrl} alt={p.name} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>🧴</div>
                        )}
                        {p.sale > 0 && <span className="sale-badge">-{p.sale}%</span>}

                        <div className="pcard-actions">
                          <button className="cart-btn" onClick={(e) => addToCart(e, p.id)} disabled={isAdding}>
                            {isAdding ? (
                              <div style={{ width: 14, height: 14, border: "2px solid #2C1A0E", borderTopColor: "transparent", borderRadius: "50%", animation: "spin-slow 0.7s linear infinite" }} />
                            ) : (
                              <><ShoppingCart style={{ width: 14, height: 14 }} /> Add to Cart</>
                            )}
                          </button>
                          <button
                            className={`wish-btn ${inWish ? "active" : ""}`}
                            onClick={(e) => toggleWishlist(e, p.id)}
                          >
                            <Heart style={{ width: 16, height: 16, color: inWish ? "white" : "rgba(255,255,255,0.9)", fill: inWish ? "white" : "none" }} />
                          </button>
                        </div>
                      </div>

                      <div style={{ padding: "20px 20px 22px" }}>
                        <h3 className="serif" style={{ fontSize: "1.1rem", fontWeight: 600, color: "#2C1A0E", margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.name}
                        </h3>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                          <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "#2C1A0E" }}>{finalPrice.toFixed(0)} EGP</span>
                          {p.sale > 0 && (
                            <span style={{ fontSize: "0.85rem", color: "#A8845A", textDecoration: "line-through" }}>{p.price} EGP</span>
                          )}
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "#8B5E3C", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5cb85c", display: "inline-block" }} />
                          Hover to add to cart
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════ ABOUT ══════════════════════ */}
        <section style={{ padding: "0 32px 100px", background: "linear-gradient(180deg, #F3E8DE 0%, #EDE0D3 100%)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", alignItems: "center", gap: 72 }}>

              {/* Image */}
              <div style={{ position: "relative" }}>
                <div className="about-img-wrap" style={{ aspectRatio: "4/5", position: "relative" }}>
                  <Image src={image2} alt="Luxury Body Splash" fill style={{ objectFit: "cover" }} />
                </div>
                {/* Stats overlay */}
                <div style={{ position: "absolute", bottom: -24, right: -24, background: "#2C1A0E", borderRadius: 20, padding: "20px 28px", boxShadow: "0 20px 50px rgba(44,26,14,0.3)" }}>
                  <p className="serif" style={{ fontSize: "2.2rem", fontWeight: 300, color: "#F3E8DE", lineHeight: 1, margin: 0 }}>3+</p>
                  <p style={{ fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#C4A882", marginTop: 4 }}>Years of Craft</p>
                </div>
              </div>

              {/* Text */}
              <div>
                <div className="section-eyebrow">Our Philosophy</div>
                <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, color: "#2C1A0E", lineHeight: 1.2, marginBottom: 28 }}>
                  Crafted with<br />
                  <em style={{ fontStyle: "italic", color: "#8B5E3C" }}>Love & Science</em>
                </h2>
                <p style={{ color: "#6B4A2A", lineHeight: 1.9, fontWeight: 300, fontSize: "0.95rem", marginBottom: 20 }}>
                  At Bubbles & Bliss, we believe your skin deserves more than ordinary. Our body splashes are carefully formulated with a blend of natural extracts, vitamin E, and premium fragrance oils.
                </p>
                <p style={{ color: "#6B4A2A", lineHeight: 1.9, fontWeight: 300, fontSize: "0.95rem", marginBottom: 40 }}>
                  Each bottle is a daily ritual — a moment of luxury that nourishes your skin and uplifts your mood. Free from harmful chemicals, kind to your skin, and kind to the planet.
                </p>

                {/* Mini stats */}
                <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
                  {[{ n: "100%", l: "Natural" }, { n: "12+", l: "Scents" }, { n: "2400+", l: "Customers" }].map((s, i) => (
                    <div key={i} style={{ textAlign: "center", padding: "16px 12px", background: "rgba(255,255,255,0.6)", borderRadius: 16, border: "1px solid #E6D5C3" }}>
                      <p className="serif" style={{ fontSize: "1.7rem", fontWeight: 400, color: "#2C1A0E", margin: 0, lineHeight: 1 }}>{s.n}</p>
                      <p style={{ fontSize: "0.67rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B5E3C", marginTop: 5 }}>{s.l}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <Link href="/shop" className="btn-dark"><span>Shop Now</span><ArrowRight style={{ width: 15, height: 15 }} /></Link>
                  <Link href="/about" className="btn-outline">Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════ REVIEWS ══════════════════════ */}
        <section style={{ padding: "80px 32px 100px", background: "#2C1A0E", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(139,94,60,0.25) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div className="section-eyebrow" style={{ color: "#C4A882" }}>
                <span style={{ borderLeft: "24px solid #6B4A2A", height: 1 }} />
                Happy Customers
                <span style={{ borderLeft: "24px solid #6B4A2A", height: 1 }} />
              </div>
              <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 400, color: "#F3E8DE" }}>
                What They <em style={{ fontStyle: "italic", color: "#D4B896" }}>Say About Us</em>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {[
                { name: "Sarah M.", review: "Absolutely obsessed! The scent lasts all day and my skin feels so silky. Best body splash I've ever tried!", rating: 5 },
                { name: "Nour A.", review: "I've been using Bubbles & Bliss for 6 months now. The natural formula is perfect for my sensitive skin. Highly recommend!", rating: 5 },
                { name: "Yasmine K.", review: "The packaging is gorgeous and the fragrance is divine. It's become my daily ritual. Worth every penny!", rating: 5 },
              ].map((r, i) => (
                <div key={i} className="review-card" style={{ background: "rgba(255,250,247,0.07)", borderColor: "rgba(255,255,255,0.1)" }}>
                  <div className="stars" style={{ marginBottom: 14 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} style={{ width: 14, height: 14, fill: s <= r.rating ? "#D4B896" : "transparent", color: "#D4B896" }} />)}
                  </div>
                  <p style={{ color: "rgba(243,232,222,0.85)", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: 18, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
                    "{r.review}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #C4A882, #8B5E3C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#F3E8DE", fontWeight: 700, fontSize: 14 }}>{r.name[0]}</span>
                    </div>
                    <div>
                      <p style={{ color: "#F3E8DE", fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>{r.name}</p>
                      <p style={{ color: "#C4A882", fontSize: "0.7rem", margin: 0 }}>Verified Buyer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ SOCIAL ══════════════════════ */}
        <section style={{ padding: "64px 32px", textAlign: "center", background: "#F3E8DE" }}>
          <div className="section-eyebrow" style={{ justifyContent: "center" }}>Follow Us</div>
          <h2 className="serif" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 400, color: "#2C1A0E", marginBottom: 32 }}>
            Join Our <em style={{ fontStyle: "italic", color: "#8B5E3C" }}>Community</em>
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {[
              { href: "https://facebook.com", svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />, label: "Facebook" },
              { href: "https://instagram.com", svg: <><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>, label: "Instagram" },
              { href: "https://wa.me/", svg: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />, label: "WhatsApp" },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="social-circle" title={s.label}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {s.svg}
                </svg>
              </a>
            ))}
          </div>
        </section>

        {/* ══════════════════════ FOOTER STRIP ══════════════════════ */}
        <div className="footer-strip">
          {["✦ Free Shipping Over 500 EGP", "🌿 100% Natural", "Handcrafted in Egypt ✦"].map((t, i) => (
            <span key={i} className="footer-item">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}