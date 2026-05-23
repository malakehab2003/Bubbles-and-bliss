"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, SlidersHorizontal, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface ProductFilters {
  name?: string;
  min_price?: number;
  max_price?: number;
  category_id?: number;
  status?: "active" | "inactive";
}

const CATEGORIES = ["All", "Signature", "Floral", "Sweet"];

export default function ShopPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [togglingWishlist, setTogglingWishlist] = useState<Set<number>>(new Set());
  const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { products, pagination, isLoading } = useProducts(currentPage, 12, {
    ...(selectedCategory && selectedCategory !== "All" ? { name: selectedCategory } : {}),
    ...filters,
  });

  // Check login & fetch wishlist
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) fetchWishlist(token);
  }, []);

  const fetchWishlist = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/wishlist/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const ids = new Set<number>((data.wishlist || []).map((w: any) => w.product_id));
        setWishlistIds(ids);
      }
    } catch {}
  };

  const getProductImage = (product: any) => {
    if (product.image?.length > 0) return product.image[0]?.url || null;
    if (product.images?.length > 0) return product.images[0]?.url || null;
    if (product.images_url?.length > 0) return product.images_url[0] || null;
    return null;
  };

  const getFinalPrice = (product: any) => {
    const price = product.price || 0;
    const sale = product.sale || 0;
    return sale > 0 ? price * (1 - sale / 100) : price;
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please sign in first"); router.push("/signin"); return; }
    if (addingToCart.has(productId)) return;

    setAddingToCart((prev) => new Set(prev).add(productId));
    try {
      const res = await fetch("http://localhost:5000/api/cart/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      if (res.ok) {
        toast.success("Added to cart! 🛒");
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast((t) => (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>Already in cart!</span>
            <button
              onClick={() => { router.push("/cart"); toast.dismiss(t.id); }}
              style={{ background: "#8B5E3C", color: "white", border: "none", borderRadius: 8, padding: "4px 12px", cursor: "pointer", fontSize: 13 }}
            >
              View Cart
            </button>
          </div>
        ), { duration: 4000 });
      }
    } catch { toast.error("Something went wrong"); }
    finally { setAddingToCart((prev) => { const s = new Set(prev); s.delete(productId); return s; }); }
  };

  const handleToggleWishlist = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please sign in first"); router.push("/signin"); return; }
    if (togglingWishlist.has(productId)) return;

    setTogglingWishlist((prev) => new Set(prev).add(productId));
    const inWishlist = wishlistIds.has(productId);

    try {
      if (inWishlist) {
        const res = await fetch(`http://localhost:5000/api/wishlist/delete/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setWishlistIds((prev) => { const s = new Set(prev); s.delete(productId); return s; });
          toast.success("Removed from wishlist");
        }
      } else {
        const res = await fetch("http://localhost:5000/api/wishlist/addProduct", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ product_id: productId }),
        });
        if (res.ok) {
          setWishlistIds((prev) => new Set(prev).add(productId));
          toast.success("Added to wishlist ❤️");
        }
      }
    } catch { toast.error("Something went wrong"); }
    finally { setTogglingWishlist((prev) => { const s = new Set(prev); s.delete(productId); return s; }); }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => { setFilters({}); setSelectedCategory(undefined); setCurrentPage(1); };
  const hasFilters = Object.values(filters).some((v) => v !== undefined) || !!selectedCategory;

  return (
    <div style={{ background: "#F3E8DE", minHeight: "100vh" }}>
      <style>{`
        .product-card {
          background: rgba(255,255,255,0.45);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          border: 1px solid rgba(230,213,195,0.6);
          position: relative;
        }
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px rgba(90,58,42,0.14);
          background: rgba(255,255,255,0.65);
        }
        .product-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #E6D5C3;
        }
        .product-image-wrap img {
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
          object-fit: cover;
        }
        .product-card:hover .product-image-wrap img {
          transform: scale(1.07);
        }
        .wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          z-index: 2;
          opacity: 0;
        }
        .product-card:hover .wishlist-btn {
          opacity: 1;
        }
        .wishlist-btn.active {
          opacity: 1;
          background: #fff0f0;
        }
        .wishlist-btn:hover {
          transform: scale(1.1);
          background: #fff;
          box-shadow: 0 4px 12px rgba(90,58,42,0.15);
        }
        .wishlist-btn.spinning {
          animation: spin-once 0.4s ease;
        }
        @keyframes spin-once {
          0% { transform: scale(0.8) rotate(-20deg); }
          60% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .sale-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #5A3A2A;
          color: #F3E8DE;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 100px;
          letter-spacing: 0.05em;
          z-index: 2;
        }
        .add-cart-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 0;
          background: #8B5E3C;
          color: white;
          border: none;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .add-cart-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #5A3A2A;
          transform: translateX(-101%);
          transition: transform 0.3s ease;
        }
        .add-cart-btn:hover::before { transform: translateX(0); }
        .add-cart-btn span, .add-cart-btn svg { position: relative; z-index: 1; }
        .add-cart-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .cat-pill {
          padding: 8px 22px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.07em;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 1.5px solid #8B5E3C;
          background: transparent;
          color: #8B5E3C;
          text-transform: uppercase;
        }
        .cat-pill.active, .cat-pill:hover {
          background: #8B5E3C;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(139,94,60,0.25);
        }
        .filter-panel {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(20px);
          border: 1px solid #E6D5C3;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 32px;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .filter-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #E6D5C3;
          border-radius: 12px;
          background: rgba(255,255,255,0.7);
          color: #5A3A2A;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .filter-input:focus { border-color: #8B5E3C; }
        .filter-label { display: block; font-size: 12px; font-weight: 700; color: #8B5E3C; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
        .page-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid #E6D5C3;
          background: rgba(255,255,255,0.5);
          color: #8B5E3C;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 600;
        }
        .page-btn:hover:not(:disabled) { background: #8B5E3C; color: white; border-color: #8B5E3C; }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .page-btn.current { background: #5A3A2A; color: #F3E8DE; border-color: #5A3A2A; }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        @media (max-width: 640px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
        }
        .stagger-in {
          animation: staggerIn 0.5s ease both;
        }
        @keyframes staggerIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>

        {/* Hero Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(139,94,60,0.1)", borderRadius: 100, padding: "6px 18px", marginBottom: 16 }}>
            <Sparkles style={{ width: 14, height: 14, color: "#8B5E3C" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#8B5E3C", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Handcrafted with Love
            </span>
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#5A3A2A", fontWeight: 400, margin: 0, lineHeight: 1.2 }}>
            Our Collection
          </h1>
          {pagination && (
            <p style={{ color: "#8B5E3C", fontSize: 14, marginTop: 8 }}>
              {pagination.total || products.length} products
            </p>
          )}
        </div>

        {/* Controls Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          {/* Categories */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-pill ${(cat === "All" && !selectedCategory) || selectedCategory === cat ? "active" : ""}`}
                onClick={() => { setSelectedCategory(cat === "All" ? undefined : cat); setCurrentPage(1); }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filter Toggle */}
          <div style={{ display: "flex", gap: 10 }}>
            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 100, border: "1.5px solid #E6D5C3", background: "transparent", color: "#8B5E3C", fontSize: 13, cursor: "pointer", fontWeight: 600 }}
              >
                <X style={{ width: 14, height: 14 }} /> Clear
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 100, border: "1.5px solid #8B5E3C", background: showFilters ? "#8B5E3C" : "transparent", color: showFilters ? "white" : "#8B5E3C", fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all 0.25s" }}
            >
              <SlidersHorizontal style={{ width: 14, height: 14 }} />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
              <div>
                <label className="filter-label">Min Price (EGP)</label>
                <input
                  type="number"
                  className="filter-input"
                  placeholder="0"
                  min={0}
                  value={filters.min_price ?? ""}
                  onChange={(e) => setFilters((p) => ({ ...p, min_price: e.target.value ? +e.target.value : undefined }))}
                />
              </div>
              <div>
                <label className="filter-label">Max Price (EGP)</label>
                <input
                  type="number"
                  className="filter-input"
                  placeholder="9999"
                  min={0}
                  value={filters.max_price ?? ""}
                  onChange={(e) => setFilters((p) => ({ ...p, max_price: e.target.value ? +e.target.value : undefined }))}
                />
              </div>
              <div>
                <label className="filter-label">Status</label>
                <select
                  className="filter-input"
                  value={filters.status ?? ""}
                  onChange={(e) => setFilters((p) => ({ ...p, status: (e.target.value as "active" | "inactive") || undefined }))}
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
            <div style={{ width: 48, height: 48, border: "4px solid #8B5E3C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧴</div>
            <p style={{ color: "#8B5E3C", fontSize: 18, marginBottom: 20 }}>No products found</p>
            {hasFilters && (
              <button onClick={clearFilters} className="cat-pill active">Clear Filters</button>
            )}
          </div>
        ) : (
          <>
            <div className="product-grid">
              {products.map((product: any, idx: number) => {
                const imageUrl = getProductImage(product);
                const finalPrice = getFinalPrice(product);
                const inWishlist = wishlistIds.has(product.id);
                const isCartLoading = addingToCart.has(product.id);
                const isWishlistLoading = togglingWishlist.has(product.id);

                return (
                  <div
                    key={product.id}
                    className="product-card stagger-in"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Image */}
                    <Link href={`/shop/${product.id}`} style={{ display: "block", textDecoration: "none" }}>
                      <div className="product-image-wrap">
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.name} style={{ width: "100%", height: "100%" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🧴</div>
                        )}

                        {/* Sale Badge */}
                        {product.sale > 0 && (
                          <span className="sale-badge">-{product.sale}%</span>
                        )}
                      </div>
                    </Link>

                    {/* Wishlist Button — outside Link to avoid navigation */}
                    <button
                      className={`wishlist-btn ${inWishlist ? "active" : ""} ${isWishlistLoading ? "spinning" : ""}`}
                      onClick={(e) => handleToggleWishlist(e, product.id)}
                      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      style={{ top: 12, right: 12, position: "absolute" }}
                    >
                      <Heart
                        style={{ width: 16, height: 16, color: inWishlist ? "#e53e3e" : "#8B5E3C", fill: inWishlist ? "#e53e3e" : "none", transition: "all 0.2s" }}
                      />
                    </button>

                    {/* Info */}
                    <div style={{ padding: "16px 16px 18px" }}>
                      <Link href={`/shop/${product.id}`} style={{ textDecoration: "none" }}>
                        <h3 style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 600, color: "#5A3A2A", margin: "0 0 4px", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: "#5A3A2A" }}>
                          {finalPrice.toFixed(0)} EGP
                        </span>
                        {product.sale > 0 && (
                          <span style={{ fontSize: 13, color: "#8B5E3C", textDecoration: "line-through" }}>
                            {product.price} EGP
                          </span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <button
                        className="add-cart-btn"
                        onClick={(e) => handleAddToCart(e, product.id)}
                        disabled={isCartLoading}
                      >
                        {isCartLoading ? (
                          <div style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        ) : (
                          <>
                            <ShoppingCart style={{ width: 15, height: 15 }} />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 52 }}>
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft style={{ width: 16, height: 16 }} />
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === "..." ? (
                      <span key={`dots-${idx}`} style={{ color: "#8B5E3C", fontSize: 14 }}>…</span>
                    ) : (
                      <button
                        key={p}
                        className={`page-btn ${p === currentPage ? "current" : ""}`}
                        onClick={() => handlePageChange(p as number)}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  <ChevronRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}