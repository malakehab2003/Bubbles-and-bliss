"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useProduct } from "@/hooks/useProduct";
import {
  Heart, ShoppingCart, Zap, ArrowLeft, Star,
  Package, ChevronLeft, ChevronRight, Shield, Truck, RefreshCw
} from "lucide-react";

const SIZES = ["Small", "Medium", "Large", "X-Large"];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  const { product, isLoading } = useProduct(productId);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token && productId) checkWishlist(token);
  }, [productId]);

  const checkWishlist = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/wishlist/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const ids = new Set((data.wishlist || []).map((w: any) => w.product_id));
        setInWishlist(ids.has(productId));
      }
    } catch {}
  };

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please sign in first"); router.push("/signin"); return; }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        const res = await fetch(`http://localhost:5000/api/wishlist/delete/${productId}`, {
          method: "DELETE", headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) { setInWishlist(false); toast.success("Removed from wishlist"); }
      } else {
        const res = await fetch("http://localhost:5000/api/wishlist/addProduct", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ product_id: productId }),
        });
        if (res.ok) { setInWishlist(true); toast.success("Added to wishlist ❤️"); }
      }
    } catch { toast.error("Something went wrong"); }
    finally { setWishlistLoading(false); }
  };

  const handleAddToCart = async (redirect = false) => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please sign in first"); router.push("/signin"); return; }
    setIsAddingToCart(true);
    try {
      const payload: any = { product_id: productId, quantity };
      if (selectedSize) payload.size = selectedSize;
      const res = await fetch("http://localhost:5000/api/cart/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Added to cart! 🛒`);
        window.dispatchEvent(new Event("cartUpdated"));
        if (redirect) router.push("/checkout");
      } else {
        toast.error(data.err || "Failed to add to cart");
      }
    } catch { toast.error("Something went wrong"); }
    finally { setIsAddingToCart(false); }
  };

  const getImages = () => {
    if (product?.images && product.images.length > 0) return product.images;
    if ((product as any)?.image && (product as any).image.length > 0) return (product as any).image;
    return [];
  };

  if (isLoading) {
    return (
      <div style={{ background: "#F3E8DE", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "4px solid #8B5E3C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#8B5E3C", fontSize: 14 }}>Loading product...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: "#F3E8DE", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#5A3A2A", marginBottom: 8 }}>Product Not Found</h1>
          <p style={{ color: "#8B5E3C", marginBottom: 24 }}>This product may have been removed.</p>
          <Link href="/shop">
            <button style={{ background: "#8B5E3C", color: "white", border: "none", borderRadius: 100, padding: "12px 28px", cursor: "pointer", fontWeight: 600 }}>
              Back to Shop
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const images = getImages();
  const finalPrice = product.sale > 0 ? product.price * (1 - product.sale / 100) : product.price;
  const currentImage = images[activeImage]?.url || null;
  const outOfStock = product.stock === 0;

  return (
    <div style={{ background: "#F3E8DE", minHeight: "100vh" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .heart-pop { animation: heartPop 0.4s ease; }
        .size-btn {
          padding: 8px 20px;
          border-radius: 100px;
          border: 1.5px solid #E6D5C3;
          background: rgba(255,255,255,0.6);
          color: #5A3A2A;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .size-btn:hover { border-color: #8B5E3C; background: rgba(139,94,60,0.08); }
        .size-btn.active { background: #8B5E3C; color: white; border-color: #8B5E3C; }
        .qty-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1.5px solid #E6D5C3;
          background: rgba(255,255,255,0.6);
          color: #5A3A2A;
          font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 300;
        }
        .qty-btn:hover:not(:disabled) { background: #8B5E3C; color: white; border-color: #8B5E3C; }
        .qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .action-btn-primary {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 20px;
          background: #5A3A2A;
          color: white;
          border: none; border-radius: 100px;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative; overflow: hidden;
        }
        .action-btn-primary:hover:not(:disabled) { background: #3d2519; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(90,58,42,0.3); }
        .action-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .action-btn-secondary {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 20px;
          background: transparent;
          color: #8B5E3C;
          border: 2px solid #8B5E3C; border-radius: 100px;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .action-btn-secondary:hover:not(:disabled) { background: #8B5E3C; color: white; transform: translateY(-2px); }
        .action-btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
        .thumb-btn {
          width: 68px; height: 68px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          background: #E6D5C3;
          flex-shrink: 0;
        }
        .thumb-btn.active { border-color: #8B5E3C; }
        .thumb-btn:hover { border-color: #8B5E3C; transform: scale(1.05); }
        .badge-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.7);
          border: 1px solid #E6D5C3;
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12px;
          color: #5A3A2A;
          font-weight: 600;
        }
        .feature-card {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.5);
          border-radius: 14px;
          border: 1px solid #E6D5C3;
        }
        .wishlist-circle {
          width: 48px; height: 48px;
          border-radius: 50%;
          border: 2px solid #E6D5C3;
          background: rgba(255,255,255,0.7);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.25s;
          flex-shrink: 0;
        }
        .wishlist-circle:hover { border-color: #e53e3e; background: #fff0f0; transform: scale(1.05); }
        .wishlist-circle.active { border-color: #e53e3e; background: #fff0f0; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* Back Link */}
        <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#8B5E3C", textDecoration: "none", fontSize: 14, fontWeight: 600, marginBottom: 32, transition: "color 0.2s" }}>
          <ArrowLeft style={{ width: 16, height: 16 }} />
          Back to Collection
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, background: "rgba(255,255,255,0.4)", backdropFilter: "blur(16px)", borderRadius: 28, padding: 40, border: "1px solid rgba(230,213,195,0.6)", boxShadow: "0 20px 60px rgba(90,58,42,0.08)" }}>

          {/* ─── LEFT: Images ─── */}
          <div>
            {/* Main Image */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", background: "#E6D5C3", borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
              {currentImage ? (
                <img src={currentImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72 }}>🧴</div>
              )}

              {/* Sale Badge */}
              {product.sale > 0 && (
                <div style={{ position: "absolute", top: 16, left: 16, background: "#5A3A2A", color: "#F3E8DE", borderRadius: 100, padding: "5px 14px", fontSize: 13, fontWeight: 700 }}>
                  -{product.sale}% OFF
                </div>
              )}

              {/* Wishlist on image */}
              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className={`wishlist-circle ${inWishlist ? "active" : ""} ${wishlistLoading ? "heart-pop" : ""}`}
                style={{ position: "absolute", top: 16, right: 16 }}
                title={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart style={{ width: 20, height: 20, color: inWishlist ? "#e53e3e" : "#8B5E3C", fill: inWishlist ? "#e53e3e" : "none", transition: "all 0.25s" }} />
              </button>

              {/* Arrow nav if multiple images */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.8)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChevronLeft style={{ width: 18, height: 18, color: "#5A3A2A" }} />
                  </button>
                  <button onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.8)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChevronRight style={{ width: 18, height: 18, color: "#5A3A2A" }} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {images.map((img: any, idx: number) => (
                  <button key={idx} className={`thumb-btn ${activeImage === idx ? "active" : ""}`} onClick={() => setActiveImage(idx)}>
                    <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── RIGHT: Info ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* Status badges */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {product.stock > 0 ? (
                <span className="badge-pill" style={{ color: "#16a34a", borderColor: "#bbf7d0", background: "rgba(220,252,231,0.6)" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
                  In Stock
                </span>
              ) : (
                <span className="badge-pill" style={{ color: "#dc2626", borderColor: "#fecaca", background: "rgba(254,226,226,0.6)" }}>
                  Out of Stock
                </span>
              )}
              {product.sale > 0 && (
                <span className="badge-pill" style={{ color: "#d97706", borderColor: "#fde68a", background: "rgba(254,243,199,0.6)" }}>
                  ⚡ On Sale
                </span>
              )}
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#5A3A2A", fontWeight: 400, margin: "0 0 8px", lineHeight: 1.25 }}>
              {product.name}
            </h1>

            {/* Rating placeholder */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 20 }}>
              {[1,2,3,4,5].map((s) => (
                <Star key={s} style={{ width: 15, height: 15, fill: s <= 4 ? "#d97706" : "none", color: "#d97706" }} />
              ))}
              <span style={{ color: "#8B5E3C", fontSize: 13, marginLeft: 4 }}>4.0</span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #E6D5C3" }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: "#5A3A2A", letterSpacing: "-0.02em" }}>
                {finalPrice.toFixed(0)} EGP
              </span>
              {product.sale > 0 && (
                <span style={{ fontSize: 18, color: "#8B5E3C", textDecoration: "line-through" }}>
                  {product.price} EGP
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p style={{ color: "#6b4c35", fontSize: 15, lineHeight: 1.7, margin: "0 0 24px" }}>
                {product.description}
              </p>
            )}



            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#8B5E3C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Colors</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.colors.map((color: string, i: number) => (
                    <span key={i} style={{ padding: "6px 16px", background: "rgba(255,255,255,0.6)", border: "1.5px solid #E6D5C3", borderRadius: 100, fontSize: 13, color: "#5A3A2A", fontWeight: 500 }}>
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#8B5E3C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Quantity</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>−</button>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#5A3A2A", minWidth: 32, textAlign: "center" }}>{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <button className="action-btn-primary" onClick={() => handleAddToCart(false)} disabled={isAddingToCart || outOfStock}>
                {isAddingToCart ? (
                  <div style={{ width: 18, height: 18, border: "2.5px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                ) : (
                  <><ShoppingCart style={{ width: 17, height: 17 }} /><span>Add to Cart</span></>
                )}
              </button>
              <button className="action-btn-secondary" onClick={() => handleAddToCart(true)} disabled={isAddingToCart || outOfStock}>
                <Zap style={{ width: 16, height: 16 }} /><span>Buy Now</span>
              </button>
              <button
                className={`wishlist-circle ${inWishlist ? "active" : ""}`}
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart style={{ width: 19, height: 19, color: inWishlist ? "#e53e3e" : "#8B5E3C", fill: inWishlist ? "#e53e3e" : "none", transition: "all 0.25s" }} />
              </button>
            </div>

            {outOfStock && (
              <p style={{ textAlign: "center", color: "#dc2626", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
                ⚠️ This product is currently out of stock
              </p>
            )}

            {/* Feature Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="feature-card">
                <Truck style={{ width: 16, height: 16, color: "#8B5E3C", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#5A3A2A", margin: 0 }}>Free Shipping</p>
                  <p style={{ fontSize: 11, color: "#8B5E3C", margin: 0 }}>Orders over 500 EGP</p>
                </div>
              </div>
              <div className="feature-card">
                <Shield style={{ width: 16, height: 16, color: "#8B5E3C", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#5A3A2A", margin: 0 }}>Secure Payment</p>
                  <p style={{ fontSize: 11, color: "#8B5E3C", margin: 0 }}>100% protected</p>
                </div>
              </div>
              <div className="feature-card">
                <RefreshCw style={{ width: 16, height: 16, color: "#8B5E3C", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#5A3A2A", margin: 0 }}>Easy Returns</p>
                  <p style={{ fontSize: 11, color: "#8B5E3C", margin: 0 }}>Within 14 days</p>
                </div>
              </div>
              <div className="feature-card">
                <Package style={{ width: 16, height: 16, color: "#8B5E3C", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#5A3A2A", margin: 0 }}>Handcrafted</p>
                  <p style={{ fontSize: 11, color: "#8B5E3C", margin: 0 }}>Made with love</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}