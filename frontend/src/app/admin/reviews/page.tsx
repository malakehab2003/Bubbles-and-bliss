"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Star, Trash2, MessageSquare, TrendingUp, Package } from "lucide-react";

interface Review {
  id: number;
  message: string;
  rate: number;
  created_at: string;
  user: { id: number; name: string };
  image?: { id: number; url: string } | null;
}

function StarRating({ rate }: { rate: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className="w-3.5 h-3.5"
          fill={s <= rate ? "#8B5E3C" : "none"} stroke="#8B5E3C" />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [rateFilter, setRateFilter] = useState<number | "all">("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/review/list");
      const data = await res.json();
      if (res.ok) setReviews(data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    setDeletingId(id);
    setConfirmId(null);
    try {
      const res = await fetch(`http://localhost:5000/api/review/admin/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        const data = await res.json();
        alert(data.err || "Failed to delete");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (reviews.length === 0) return { total: 0, avg: 0, positive: 0, negative: 0 };
    const avg = reviews.reduce((s, r) => s + r.rate, 0) / reviews.length;
    return {
      total: reviews.length,
      avg: avg.toFixed(1),
      positive: reviews.filter((r) => r.rate >= 4).length,
      negative: reviews.filter((r) => r.rate <= 2).length,
    };
  }, [reviews]);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() =>
    reviews.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        r.user?.name?.toLowerCase().includes(q) ||
        r.message?.toLowerCase().includes(q) ||
        String(r.id).includes(q);
      const matchRate = rateFilter === "all" || r.rate === rateFilter;
      return matchSearch && matchRate;
    }),
  [reviews, searchQuery, rateFilter]);

  const rateColor = (rate: number) => {
    if (rate >= 4) return "text-green-600 bg-green-50 border-green-200";
    if (rate === 3) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-500 bg-red-50 border-red-200";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-[#5A3A2A]">Reviews Management</h1>
        <p className="text-[#8B5E3C] text-sm mt-1">Monitor and moderate customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-[#8B5E3C]" />
            <p className="text-[#8B5E3C] text-xs">Total Reviews</p>
          </div>
          <p className="text-2xl font-bold text-[#5A3A2A]">{stats.total}</p>
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-sm border-l-4 border-[#8B5E3C]">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-[#8B5E3C]" />
            <p className="text-[#8B5E3C] text-xs">Average Rating</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-[#5A3A2A]">{stats.avg}</p>
            <Star className="w-5 h-5" fill="#8B5E3C" stroke="#8B5E3C" />
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-sm border-l-4 border-green-400">
          <p className="text-green-600 text-xs mb-1">Positive (4-5 ⭐)</p>
          <p className="text-2xl font-bold text-[#5A3A2A]">{stats.positive}</p>
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-sm border-l-4 border-red-400">
          <p className="text-red-500 text-xs mb-1">Negative (1-2 ⭐)</p>
          <p className="text-2xl font-bold text-[#5A3A2A]">{stats.negative}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]" />
          <input type="text" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name or review text..."
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-[#E6D5C3] rounded-xl text-[#5A3A2A] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition" />
        </div>
        <div className="flex gap-2">
          {(["all", 5, 4, 3, 2, 1] as const).map((f) => (
            <button key={f} onClick={() => setRateFilter(f)}
              className={`px-3 py-2 rounded-xl text-sm transition border ${
                rateFilter === f
                  ? "bg-[#8B5E3C] text-white border-[#8B5E3C]"
                  : "bg-white/50 text-[#5A3A2A] border-[#E6D5C3] hover:bg-[#E6D5C3]"
              }`}>
              {f === "all" ? "All" : `${f}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/40 rounded-2xl p-12 text-center shadow-md">
          <MessageSquare className="w-12 h-12 text-[#8B5E3C] mx-auto mb-3 opacity-40" />
          <p className="text-[#8B5E3C]">No reviews found</p>
        </div>
      ) : (
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#E6D5C3] text-xs font-semibold text-[#8B5E3C] uppercase tracking-wide">
            <div className="col-span-1">#</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-2">Rating</div>
            <div className="col-span-5">Review</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#E6D5C3]">
            {filtered.map((review) => (
              <div key={review.id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/30 transition ${
                  deletingId === review.id ? "opacity-40" : ""
                }`}>

                {/* ID */}
                <div className="col-span-1 text-[#8B5E3C] text-sm font-mono">
                  #{review.id}
                </div>

                {/* Customer */}
                <div className="col-span-2">
                  <div className="w-8 h-8 bg-[#E6D5C3] rounded-full flex items-center justify-center text-[#8B5E3C] font-semibold text-sm mb-1">
                    {review.user?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <p className="text-sm font-medium text-[#5A3A2A] leading-tight">
                    {review.user?.name || "Anonymous"}
                  </p>
                </div>

                {/* Rating */}
                <div className="col-span-2">
                  <StarRating rate={review.rate} />
                  <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${rateColor(review.rate)}`}>
                    {review.rate}/5
                  </span>
                </div>

                {/* Message */}
                <div className="col-span-5">
                  <p className="text-sm text-[#5A3A2A] leading-relaxed line-clamp-2">
                    {review.message}
                  </p>
                </div>

                {/* Date */}
                <div className="col-span-1 text-xs text-[#8B5E3C]">
                  {new Date(review.created_at).toLocaleDateString("en-EG", {
                    day: "numeric", month: "short", year: "2-digit",
                  })}
                </div>

                {/* Delete */}
                <div className="col-span-1 flex justify-center">
                  {confirmId === review.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleDelete(review.id)}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg transition">
                        Yes
                      </button>
                      <button onClick={() => setConfirmId(null)}
                        className="text-xs bg-[#E6D5C3] hover:bg-[#d4c4b0] text-[#5A3A2A] px-2 py-1 rounded-lg transition">
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(review.id)}
                      disabled={deletingId === review.id}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 text-red-400 hover:text-red-600 transition disabled:opacity-50"
                      title="Delete review">
                      {deletingId === review.id
                        ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <p className="text-center text-sm text-[#8B5E3C] mt-4">
          Showing {filtered.length} of {reviews.length} reviews
        </p>
      )}
    </div>
  );
}