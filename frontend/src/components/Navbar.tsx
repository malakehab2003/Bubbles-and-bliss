"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Menu, X, Heart, LogOut, Package, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import logo from "../../public/ChatGPT Image Apr 21, 2026, 08_28_17 PM.png";

async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const res = await fetch("http://localhost:5000/api/user/getMe", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getCart() {
  const token = localStorage.getItem("token");
  if (!token) return [];
  try {
    const res = await fetch("http://localhost:5000/api/cart/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.cart || [];
  } catch {
    return [];
  }
}

const navLinks = [
  { href: "/shop",    label: "Shop" },
  { href: "/about",   label: "About" },
  { href: "/reviews", label: "Reviews" },
];

export default function Navbar() {
  const [user, setUser]                         = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen]     = useState(false);
  const [scrolled, setScrolled]                 = useState(false);
  const [isMobile, setIsMobile]                 = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setIsUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const fetchUser = async () => setUser(await getCurrentUser());
    fetchUser();
    window.addEventListener("userChanged", fetchUser);
    return () => window.removeEventListener("userChanged", fetchUser);
  }, []);

  const { data: cartItems = [], refetch: refetchCart } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user,
  });

  useEffect(() => {
    const handle = () => refetchCart();
    window.addEventListener("cartUpdated", handle);
    return () => window.removeEventListener("cartUpdated", handle);
  }, [refetchCart]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    window.dispatchEvent(new Event("userChanged"));
    window.location.href = "/";
  };

  const cartItemCount = cartItems.reduce(
    (total: number, item: any) => total + (item.quantity || 1), 0
  );

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          color: #8B5E3C;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.3s ease;
          padding: 4px 0;
          text-decoration: none;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: #5A3A2A;
          transition: width 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-link:hover { color: #5A3A2A; }
        .nav-link:hover::after { width: 100%; }

        .icon-btn {
          position: relative;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          color: #8B5E3C;
          transition: all 0.25s ease;
          cursor: pointer;
          background: none; border: none;
          text-decoration: none;
        }
        .icon-btn:hover {
          background: #E6D5C3;
          color: #5A3A2A;
          transform: translateY(-1px);
        }

        .cart-badge {
          position: absolute;
          top: 2px; right: 2px;
          min-width: 18px; height: 18px;
          background: #5A3A2A;
          color: #F3E8DE;
          font-size: 10px; font-weight: 700;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
          border: 2px solid #F3E8DE;
          animation: pop 0.2s ease;
        }
        @keyframes pop {
          0%  { transform: scale(0.5); }
          80% { transform: scale(1.15); }
          100%{ transform: scale(1); }
        }

        .user-avatar {
          width: 36px; height: 36px;
          border-radius: 50%; overflow: hidden;
          background: #E6D5C3;
          border: 2px solid transparent;
          transition: all 0.25s ease;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .user-avatar:hover, .user-avatar.open {
          border-color: #8B5E3C;
          transform: scale(1.05);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 12px); right: 0;
          width: 220px;
          background: #FFFAF7;
          border: 1px solid #E6D5C3;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(90,58,42,0.15), 0 4px 12px rgba(90,58,42,0.08);
          overflow: hidden;
          z-index: 200;
          animation: dropIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
          transform-origin: top right;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: scale(0.9) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .dropdown-header {
          padding: 16px;
          background: linear-gradient(135deg, #F3E8DE 0%, #E6D5C3 100%);
          border-bottom: 1px solid #E6D5C3;
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px;
          color: #5A3A2A;
          font-size: 0.875rem; font-weight: 500;
          transition: all 0.2s ease;
          cursor: pointer; text-decoration: none;
        }
        .dropdown-item:hover { background: #F3E8DE; padding-left: 20px; }
        .dropdown-item.danger { color: #dc2626; }
        .dropdown-item.danger:hover { background: #fef2f2; }

        .signin-btn {
          position: relative;
          padding: 8px 24px;
          border: 1.5px solid #8B5E3C;
          border-radius: 100px;
          color: #8B5E3C;
          font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          overflow: hidden;
          transition: color 0.3s ease, transform 0.2s ease;
          background: transparent; cursor: pointer;
        }
        .signin-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: #8B5E3C;
          transform: translateY(101%);
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .signin-btn:hover { color: #F3E8DE; transform: translateY(-1px); }
        .signin-btn:hover::before { transform: translateY(0); }
        .signin-btn span { position: relative; z-index: 1; }

        .mobile-menu-container {
          border-top: 1px solid #E6D5C3;
          background: #FFFAF7;
          padding: 8px 24px 24px;
          animation: slideDown 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mobile-nav-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 0;
          color: #5A3A2A;
          font-size: 1rem; font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase;
          border-bottom: 1px solid #E6D5C3;
          transition: color 0.2s, padding-left 0.2s;
          text-decoration: none;
        }
        .mobile-nav-link:hover { color: #8B5E3C; padding-left: 6px; }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #E6D5C3, transparent);
          margin: 4px 0;
        }

        .nav-wrapper {
          background: rgba(243,232,222,0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(230,213,195,0.8);
          transition: box-shadow 0.3s ease, background 0.3s ease;
        }
        .nav-wrapper.scrolled {
          box-shadow: 0 4px 30px rgba(90,58,42,0.1);
          background: rgba(243,232,222,0.98);
        }
        .logo-text {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 1.1rem; letter-spacing: 0.15em;
          color: #5A3A2A; font-weight: 400;
          transition: letter-spacing 0.3s ease;
        }
        .logo-wrapper:hover .logo-text { letter-spacing: 0.2em; }
        .logo-circle {
          width: 38px; height: 38px;
          border-radius: 50%; overflow: hidden;
          background: #E6D5C3;
          border: 2px solid #E6D5C3;
          transition: border-color 0.3s, transform 0.3s;
          flex-shrink: 0;
        }
        .logo-wrapper:hover .logo-circle {
          border-color: #8B5E3C;
          transform: rotate(-5deg) scale(1.05);
        }
      `}</style>

      <header className="sticky top-0 z-50">
        <div className={`nav-wrapper ${scrolled ? "scrolled" : ""}`}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

              {/* Logo */}
              <Link href="/" className="logo-wrapper"
                style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                <div className="logo-circle" style={{ position: "relative" }}>
                  <Image src={logo} alt="Bubbles & Bliss" fill sizes="38px" style={{ objectFit: "cover" }} />
                </div>
                <span className="logo-text">BUBBLES & BLISS</span>
              </Link>

              {/* Center Nav - Desktop */}
              {!isMobile && (
                <nav style={{ display: "flex", alignItems: "center", gap: 40 }}>
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="nav-link">
                      {link.label}
                    </Link>
                  ))}
                </nav>
              )}

              {/* Right Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

                {/* Wishlist - Desktop */}
                {user && !isMobile && (
                  <Link href="/wishlist" className="icon-btn">
                    <Heart style={{ width: 19, height: 19 }} />
                  </Link>
                )}

                {/* Cart */}
                <Link href="/cart" className="icon-btn">
                  <ShoppingCart style={{ width: 19, height: 19 }} />
                  {cartItemCount > 0 && (
                    <span className="cart-badge">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Link>

                {/* User - Desktop */}
                {!isMobile && (
                  user ? (
                    <div ref={userMenuRef} style={{ position: "relative", marginLeft: 4 }}>
                      <div
                        className={`user-avatar ${isUserMenuOpen ? "open" : ""}`}
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      >
                        {user.image
                          ? <Image src={user.image} alt={user.name} width={36} height={36} style={{ objectFit: "cover" }} />
                          : <User style={{ width: 16, height: 16, color: "#5A3A2A" }} />
                        }
                      </div>

                      {isUserMenuOpen && (
                        <div className="dropdown-menu">
                          <div className="dropdown-header">
                            <p style={{ fontWeight: 700, color: "#5A3A2A", fontSize: "0.9rem", marginBottom: 2 }}>
                              {user.name}
                            </p>
                            <p style={{ color: "#8B5E3C", fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {user.email}
                            </p>
                          </div>
                          <div className="divider" />
                          <Link href="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                            <User style={{ width: 15, height: 15 }} /> My Profile
                          </Link>
                          <Link href="/profile/orders" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                            <Package style={{ width: 15, height: 15 }} /> My Orders
                          </Link>
                          <Link href="/wishlist" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                            <Heart style={{ width: 15, height: 15 }} /> Wishlist
                          </Link>
                          <div className="divider" />
                          <button className="dropdown-item danger"
                            style={{ width: "100%", border: "none", background: "none", textAlign: "left" }}
                            onClick={handleLogout}>
                            <LogOut style={{ width: 15, height: 15 }} /> Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href="/signin" style={{ marginLeft: 8 }}>
                      <button className="signin-btn"><span>Sign In</span></button>
                    </Link>
                  )
                )}

                {/* Mobile Hamburger */}
                {isMobile && (
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="icon-btn"
                    style={{ marginLeft: 4 }}
                  >
                    {isMobileMenuOpen
                      ? <X style={{ width: 20, height: 20 }} />
                      : <Menu style={{ width: 20, height: 20 }} />
                    }
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobile && isMobileMenuOpen && (
            <div className="mobile-menu-container">
              <nav>
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <span>{link.label}</span>
                    <ChevronDown style={{ width: 14, height: 14, transform: "rotate(-90deg)", opacity: 0.5 }} />
                  </Link>
                ))}
                <Link href="/cart" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <span>Cart</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {cartItemCount > 0 && (
                      <span style={{ background: "#5A3A2A", color: "#F3E8DE", fontSize: "0.7rem", fontWeight: 700, borderRadius: 9, padding: "2px 8px" }}>
                        {cartItemCount}
                      </span>
                    )}
                    <ChevronDown style={{ width: 14, height: 14, transform: "rotate(-90deg)", opacity: 0.5 }} />
                  </div>
                </Link>
              </nav>

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #E6D5C3" }}>
                {user ? (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "12px 16px", background: "linear-gradient(135deg, #F3E8DE, #E6D5C3)", borderRadius: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", background: "#E6D5C3", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {user.image
                          ? <Image src={user.image} alt={user.name} width={44} height={44} style={{ objectFit: "cover" }} />
                          : <User style={{ width: 20, height: 20, color: "#5A3A2A" }} />
                        }
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <p style={{ fontWeight: 700, color: "#5A3A2A", fontSize: "0.95rem" }}>{user.name}</p>
                        <p style={{ color: "#8B5E3C", fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                      </div>
                    </div>

                    <Link href="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}><User style={{ width: 15, height: 15 }} /> My Profile</span>
                      <ChevronDown style={{ width: 14, height: 14, transform: "rotate(-90deg)", opacity: 0.5 }} />
                    </Link>
                    <Link href="/profile/orders" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Package style={{ width: 15, height: 15 }} /> My Orders</span>
                      <ChevronDown style={{ width: 14, height: 14, transform: "rotate(-90deg)", opacity: 0.5 }} />
                    </Link>
                    <Link href="/wishlist" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Heart style={{ width: 15, height: 15 }} /> Wishlist</span>
                      <ChevronDown style={{ width: 14, height: 14, transform: "rotate(-90deg)", opacity: 0.5 }} />
                    </Link>

                    <button onClick={handleLogout}
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", marginTop: 12, padding: "12px 0", color: "#dc2626", fontWeight: 600, fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                      <LogOut style={{ width: 15, height: 15 }} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <button style={{ width: "100%", padding: "14px", background: "#5A3A2A", color: "#F3E8DE", border: "none", borderRadius: 100, fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}