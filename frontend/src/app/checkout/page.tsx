"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MapPin, Phone, Tag, ShoppingBag, Truck, Gift } from "lucide-react";
import toast from "react-hot-toast";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;

interface CartItem {
  id: number;
  quantity: number;
  product: { name: string; price: number; sale: number };
}
interface Government { id: number; name: string; }
interface City { id: number; name: string; government_id: number; }

export default function CheckoutPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [governments, setGovernments] = useState<Government[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [phone, setPhone] = useState("");
  const [governmentId, setGovernmentId] = useState("");
  const [cityId, setCityId] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState<{ id: number; code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/signin"); return; }

    const load = async () => {
      try {
        const [cartRes, govRes, cityRes] = await Promise.all([
          fetch("http://localhost:5000/api/cart/list", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5000/api/government/list"),
          fetch("http://localhost:5000/api/city/list"),
        ]);
        const cartData = await cartRes.json();
        const govData = await govRes.json();
        const cityData = await cityRes.json();
        setCartItems(cartData.cart || []);
        setGovernments(govData.governments || []);
        setCities(cityData.citys || cityData.cities || []);
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    load();
  }, [router]);

  useEffect(() => {
    if (!governmentId) { setFilteredCities([]); setCityId(""); return; }
    setFilteredCities(cities.filter((c) => String(c.government_id) === String(governmentId)));
    setCityId("");
  }, [governmentId, cities]);

  const getItemPrice = (item: CartItem) => {
    const p = item.product.price;
    const s = item.product.sale;
    return s > 0 ? p * (1 - s / 100) : p;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : SHIPPING_COST;
  const discount = promoResult ? Math.round((subtotal * promoResult.discount) / 100) : 0;
  const total = subtotal + shipping - discount;

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    const token = localStorage.getItem("token");
    setApplyingPromo(true);
    setPromoError("");
    setPromoResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/promocode/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: promoCode }),
      });
      const data = await res.json();
      if (res.ok) { setPromoResult(data.promocode || data); toast.success("Promo code applied!"); }
      else { setPromoError(data.error || data.err || "Invalid promo code"); }
    } catch { setPromoError("Failed to apply promo code"); }
    finally { setApplyingPromo(false); }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!address.trim()) e.address = "Address is required";
    if (!phone.trim()) e.phone = "Phone is required";
    else if (!/^(\+2)?01[0125][0-9]{8}$/.test(phone)) e.phone = "Enter a valid Egyptian phone";
    if (!governmentId) e.government = "Please select a governorate";
    if (!cityId) e.city = "Please select a city";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const token = localStorage.getItem("token");
    setIsSubmitting(true);
    try {
      const orderBody: Record<string, any> = {
        total_price: total,
        address,
        phone,
        government_id: parseInt(governmentId),
        city_id: parseInt(cityId),
      };
      if (landmark.trim()) orderBody.landmark = landmark;
      if (promoResult) orderBody.promocode_id = promoResult.id;

      const orderRes = await fetch("http://localhost:5000/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderBody),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { toast.error(orderData.err || "Failed to create order"); return; }

      await fetch("http://localhost:5000/api/order/item/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ order_id: orderData.order?.id }),
      });

      setOrderId(orderData.order?.id);
      setOrderSuccess(true);
    } catch { toast.error("Something went wrong, please try again"); }
    finally { setIsSubmitting(false); }
  };

  const inputClass = (err?: string) =>
    `w-full px-4 py-3 bg-white/60 border rounded-xl text-[#3a2010] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition text-sm ${err ? "border-red-400" : "border-[#E6D5C3]"}`;

  if (isLoading) return (
    <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Success screen
  if (orderSuccess) return (
    <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-[#E6D5C3]">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-serif text-[#5A3A2A] mb-2">Order Placed! 🎉</h1>
          <p className="text-[#8B5E3C] mb-1 text-sm">Thank you for your purchase</p>
          {orderId && <p className="text-xs text-[#8B5E3C] mb-6 font-mono bg-[#E6D5C3] inline-block px-3 py-1 rounded-full">Order #{orderId}</p>}
          <div className="flex flex-col gap-3 mt-4">
            <Link href="/profile/orders">
              <button className="w-full bg-[#5A3A2A] hover:bg-[#3D2310] text-[#F3E8DE] py-3 rounded-full transition text-sm font-medium">
                View My Orders
              </button>
            </Link>
            <Link href="/shop">
              <button className="w-full border-2 border-[#E6D5C3] text-[#8B5E3C] hover:bg-[#E6D5C3] py-3 rounded-full transition text-sm">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[#8B5E3C] mb-4">Your cart is empty</p>
        <Link href="/shop"><button className="bg-[#8B5E3C] text-white px-6 py-2 rounded-full hover:bg-[#5A3A2A] transition text-sm">Go Shopping</button></Link>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-serif text-[#5A3A2A] text-center mb-1">Checkout</h1>
        <p className="text-center text-[#8B5E3C] text-sm mb-8">Complete your order</p>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: Form ── */}
          <div className="flex-1 space-y-5">

            {/* Free Shipping Banner */}
            {isFreeShipping ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                <Gift className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-700 font-semibold text-sm">Free Shipping Unlocked! 🎉</p>
                  <p className="text-green-600 text-xs mt-0.5">Your order qualifies for free delivery — you saved {SHIPPING_COST} EGP!</p>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 border border-[#E6D5C3] rounded-2xl px-5 py-4 flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#8B5E3C] flex-shrink-0" />
                <p className="text-[#5A3A2A] text-sm">
                  Add <strong className="text-[#8B5E3C]">{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)} EGP</strong> more to your order for <strong>free shipping</strong>
                </p>
              </div>
            )}

            {/* Shipping Details */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-[#E6D5C3]/50">
              <h2 className="text-lg font-serif text-[#5A3A2A] mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#8B5E3C]" /> Shipping Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5A3A2A] mb-1.5 uppercase tracking-wide">Address *</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street name, building number..." className={inputClass(errors.address)} />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A3A2A] mb-1.5 uppercase tracking-wide">
                    Landmark <span className="text-[#8B5E3C] normal-case font-normal">(optional)</span>
                  </label>
                  <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Near a mosque, school..." className={inputClass()} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A3A2A] mb-1.5 uppercase tracking-wide flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Phone Number *
                  </label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" className={inputClass(errors.phone)} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5A3A2A] mb-1.5 uppercase tracking-wide">Governorate *</label>
                    <select value={governmentId} onChange={(e) => setGovernmentId(e.target.value)} className={inputClass(errors.government)}>
                      <option value="">Select Governorate</option>
                      {governments.map((gov) => <option key={gov.id} value={gov.id}>{gov.name}</option>)}
                    </select>
                    {errors.government && <p className="text-red-500 text-xs mt-1">{errors.government}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A3A2A] mb-1.5 uppercase tracking-wide">City *</label>
                    <select value={cityId} onChange={(e) => setCityId(e.target.value)} disabled={!governmentId} className={`${inputClass(errors.city)} disabled:opacity-50 disabled:cursor-not-allowed`}>
                      <option value="">{governmentId ? "Select City" : "Select governorate first"}</option>
                      {filteredCities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
                    </select>
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-[#E6D5C3]/50">
              <h2 className="text-lg font-serif text-[#5A3A2A] mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#8B5E3C]" /> Promo Code
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  disabled={!!promoResult}
                  className={`flex-1 px-4 py-3 bg-white/60 border border-[#E6D5C3] rounded-xl text-[#3a2010] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition text-sm disabled:opacity-50 font-mono tracking-widest`}
                />
                {promoResult ? (
                  <button onClick={() => { setPromoResult(null); setPromoCode(""); }} className="px-5 py-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition text-sm border border-red-200">
                    Remove
                  </button>
                ) : (
                  <button onClick={applyPromo} disabled={applyingPromo || !promoCode.trim()} className="px-5 py-3 bg-[#5A3A2A] hover:bg-[#3D2310] text-[#F3E8DE] rounded-xl transition text-sm disabled:opacity-50">
                    {applyingPromo ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Apply"}
                  </button>
                )}
              </div>
              {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
              {promoResult && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-2">
                  ✅ <strong>{promoResult.code}</strong> applied — {promoResult.discount}% off
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Summary ── */}
          <div className="lg:w-96">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-[#E6D5C3]/50 sticky top-24">
              <h2 className="text-lg font-serif text-[#5A3A2A] mb-4 pb-3 border-b border-[#E6D5C3] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#8B5E3C]" /> Order Summary
              </h2>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-[#5A3A2A] flex-1 truncate mr-2">
                      {item.product.name}
                      <span className="text-[#8B5E3C] ml-1 text-xs">×{item.quantity}</span>
                    </span>
                    <span className="text-[#8B5E3C] flex-shrink-0 text-xs">
                      {(getItemPrice(item) * item.quantity).toFixed(0)} EGP
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E6D5C3] pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-[#8B5E3C]">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(0)} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B5E3C]">Shipping</span>
                  {isFreeShipping ? (
                    <span className="text-green-600 font-semibold text-xs">FREE 🎉</span>
                  ) : (
                    <span className="text-[#8B5E3C]">{SHIPPING_COST} EGP</span>
                  )}
                </div>
                {promoResult && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({promoResult.discount}%)</span>
                    <span>-{discount} EGP</span>
                  </div>
                )}
                <div className="border-t border-[#E6D5C3] pt-3 flex justify-between text-[#5A3A2A] font-bold text-base">
                  <span>Total</span>
                  <span>{total.toFixed(0)} EGP</span>
                </div>
              </div>

              {isFreeShipping && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs text-green-700 text-center">
                  ✦ Free shipping applied — saved {SHIPPING_COST} EGP!
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-5 flex items-center justify-center gap-2 bg-[#5A3A2A] hover:bg-[#3D2310] text-[#F3E8DE] py-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm tracking-wide"
              >
                {isSubmitting ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order...</>
                ) : (
                  `Confirm Order • ${total.toFixed(0)} EGP`
                )}
              </button>

              <Link href="/cart">
                <button className="w-full mt-3 border border-[#E6D5C3] text-[#8B5E3C] hover:bg-[#E6D5C3] py-3 rounded-full transition text-sm">
                  ← Back to Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}