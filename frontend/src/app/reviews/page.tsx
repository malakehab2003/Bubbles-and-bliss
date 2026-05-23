"use client";
import { useState, useEffect, useMemo } from "react";
import { Star, Quote, PenLine, X, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Review {
  id: number;
  message: string;
  rate: number;
  created_at: string;
  user: { id: number; name: string };
}

function StarRating({ rate }: { rate: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className="w-4 h-4" fill={s <= rate ? "#8B5E3C" : "none"} stroke="#8B5E3C" />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110">
          <Star className="w-7 h-7"
            fill={s <= (hovered || value) ? "#8B5E3C" : "none"} stroke="#8B5E3C" />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<number | "all">("all");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("");

  // Write/Edit form
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [message, setMessage] = useState("");
  const [rate, setRate] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirm
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── Fetch reviews + current user ──────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes] = await Promise.all([
          fetch("http://localhost:5000/api/review/list"),
        ]);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }

      // Get current user id
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("http://localhost:5000/api/user/getMe", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) { setCurrentUserId(data.id); setCurrentUserName(data.name || ""); }
        } catch {}
      }
    };
    fetchData();
  }, []);

  // ── Stats from real reviews ───────────────────────────────────────────────
  const stats = useMemo(() => {
    if (reviews.length === 0) return { total: "0", avg: "—", recommend: "—", fiveStars: "0" };
    const avg = reviews.reduce((s, r) => s + r.rate, 0) / reviews.length;
    const fiveStars = reviews.filter((r) => r.rate === 5).length;
    const recommend = Math.round((reviews.filter((r) => r.rate >= 4).length / reviews.length) * 100);
    return {
      total: `${reviews.length}+`,
      avg: avg.toFixed(1),
      recommend: `${recommend}%`,
      fiveStars: `${fiveStars}`,
    };
  }, [reviews]);

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.rate === filter);

  // ── Open write form ───────────────────────────────────────────────────────
  const openWrite = () => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please sign in first"); return; }
    setEditingReview(null);
    setMessage("");
    setRate(5);
    setShowForm(true);
  };

  // ── Open edit form ────────────────────────────────────────────────────────
  const openEdit = (review: Review) => {
    setEditingReview(review);
    setMessage(review.message);
    setRate(review.rate);
    setShowForm(true);
  };

  // ── Submit (create or update) ─────────────────────────────────────────────
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please sign in first"); return; }
    if (!message.trim()) { toast.error("Please write your review"); return; }

    setSubmitting(true);
    try {
      let res: Response, data: any;

      if (editingReview) {
        // Update
        res = await fetch(`http://localhost:5000/api/review/update/${editingReview.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message, rate }),
        });
        data = await res.json();
        if (res.ok) {
          setReviews((prev) =>
            prev.map((r) => r.id === editingReview.id ? { ...r, message, rate } : r)
          );
          toast.success("Review updated! ✏️");
        } else {
          toast.error(data.err || "Failed to update");
        }
      } else {
        // Create
        const formData = new FormData();
        formData.append("message", message);
        formData.append("rate", String(rate));

        res = await fetch("http://localhost:5000/api/review/create", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        data = await res.json();
        if (res.ok) {
          const newReview = {
            id: data.review?.id || Date.now(),
            message,
            rate,
            created_at: new Date().toISOString(),
            user: { id: currentUserId!, name: currentUserName },
          };
          setReviews((prev) => [newReview, ...prev]);
          toast.success("Review submitted! Thank you 🌸");
        } else {
          toast.error(data.err || "Failed to submit");
        }
      }

      if (res.ok) {
        setShowForm(false);
        setMessage("");
        setRate(5);
        setEditingReview(null);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/review/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        toast.success("Review deleted");
      } else {
        const data = await res.json();
        toast.error(data.err || "Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-[#F3E8DE] min-h-screen">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden py-20 px-4 text-center">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#E6D5C3] rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-[#d4b896] rounded-full opacity-30 blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex justify-center gap-1 mb-4">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className="w-6 h-6" fill="#8B5E3C" stroke="#8B5E3C" />
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#5A3A2A] mb-4 leading-tight">
            What Our Customers<br />
            <span className="italic text-[#8B5E3C]">Are Saying</span>
          </h1>
          <p className="text-[#8B5E3C] text-lg mb-8">
            Real experiences from real people who love Bubbles & Bliss
          </p>
          <button onClick={openWrite}
            className="inline-flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-7 py-3 rounded-full transition duration-300 transform hover:scale-105 shadow-md">
            <PenLine className="w-4 h-4" /> Write a Review
          </button>
        </div>
      </div>

      {/* ── Stats (حقيقية من الـ API) ── */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: stats.total,      label: "Total Reviews" },
            { value: stats.avg,        label: "Average Rating" },
            { value: stats.recommend,  label: "Would Recommend" },
            { value: stats.fiveStars,  label: "Five Star Reviews" },
          ].map((s) => (
            <div key={s.label}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
              <p className="text-3xl font-serif font-bold text-[#5A3A2A] mb-1">{s.value}</p>
              <p className="text-[#8B5E3C] text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter ── */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[#8B5E3C] text-sm font-medium">Filter by:</span>
          {(["all", 5, 4, 3] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm transition ${
                filter === f
                  ? "bg-[#8B5E3C] text-white"
                  : "bg-white/50 text-[#5A3A2A] border border-[#E6D5C3] hover:bg-[#E6D5C3]"
              }`}>
              {f === "all" ? "All Reviews" : <>{f} <Star className="w-3 h-3" fill="currentColor" stroke="currentColor" /></>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Reviews Grid ── */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white/30 rounded-2xl">
            <p className="text-[#8B5E3C] text-lg mb-4">No reviews yet</p>
            <button onClick={openWrite}
              className="bg-[#8B5E3C] text-white px-6 py-2 rounded-full hover:bg-[#5A3A2A] transition">
              Be the first to review!
            </button>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {filtered.map((review) => {
              const isOwner = currentUserId === review.user?.id;
              return (
                <div key={review.id}
                  className="break-inside-avoid bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
                  <div className="flex justify-between items-start mb-3">
                    <Quote className="w-8 h-8 text-[#E6D5C3] group-hover:text-[#d4b896] transition-colors" />
                    {/* Edit/Delete buttons - only for owner */}
                    {isOwner && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(review)}
                          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#E6D5C3] text-[#8B5E3C] transition"
                          title="Edit review">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          disabled={deletingId === review.id}
                          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-100 text-red-400 transition disabled:opacity-50"
                          title="Delete review">
                          {deletingId === review.id
                            ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>

                  <StarRating rate={review.rate} />
                  <p className="text-[#5A3A2A] mt-3 mb-4 leading-relaxed text-sm">{review.message}</p>

                  <div className="border-t border-[#E6D5C3] pt-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-[#5A3A2A] text-sm">
                        {review.user?.name || "Anonymous"}
                        {isOwner && <span className="ml-1 text-xs text-[#8B5E3C]">(you)</span>}
                      </p>
                      <p className="text-[#8B5E3C] text-xs">
                        {new Date(review.created_at).toLocaleDateString("en-EG", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="text-xs bg-green-50 text-green-600 border border-green-100 px-2 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Write / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}>
          <div className="bg-[#F3E8DE] rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}>

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-serif text-[#5A3A2A]">
                  {editingReview ? "Edit Your Review" : "Write a Review"}
                </h2>
                <p className="text-sm text-[#8B5E3C]">
                  {editingReview ? "Update your experience" : "Share your experience with us 🌸"}
                </p>
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E6D5C3] transition text-[#8B5E3C]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-[#5A3A2A] mb-2">Your Rating *</label>
                <StarPicker value={rate} onChange={setRate} />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-[#5A3A2A] mb-2">Your Review *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Share your experience with Bubbles & Bliss..."
                  className="w-full px-4 py-3 bg-white/60 border border-[#E6D5C3] rounded-xl text-[#3a2010] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border-2 border-[#E6D5C3] text-[#8B5E3C] rounded-full hover:bg-[#E6D5C3] transition">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white rounded-full transition disabled:opacity-50">
                  {submitting
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><PenLine className="w-4 h-4" />{editingReview ? "Update" : "Submit"}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}