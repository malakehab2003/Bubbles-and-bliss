"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Tag, X, Save, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

interface PromoCode {
  id: number;
  code: string;
  description?: string;
  discount: string;
}

// ── Modal إنشاء / تعديل ──────────────────────────────────────────
function PromoModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: PromoCode | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [code, setCode]         = useState(initial?.code || "");
  const [description, setDesc]  = useState(initial?.description || "");
  const [discount, setDiscount] = useState(initial?.discount || "");
  const [saving, setSaving]     = useState(false);

  const submit = async () => {
    if (!code || !discount) return toast.error("Code and discount are required");
    const token = localStorage.getItem("token");
    setSaving(true);
    try {
      const url = initial
        ? `http://localhost:5000/api/promocode/update/${initial.id}`
        : `http://localhost:5000/api/promocode/create`;
      const method = initial ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code, description, discount: parseFloat(discount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed");

      toast.success(initial ? "Updated!" : "Created!");
      onSave();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#F3E8DE] rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-serif text-[#5A3A2A]">
            {initial ? "Edit Promo Code" : "New Promo Code"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E6D5C3] text-[#8B5E3C]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#5A3A2A] mb-1">Code *</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER20"
              className="w-full px-4 py-3 bg-white/60 border border-[#E6D5C3] rounded-xl text-[#3a2010] uppercase placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#5A3A2A] mb-1">Discount % *</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="e.g. 20"
              min="1"
              max="100"
              className="w-full px-4 py-3 bg-white/60 border border-[#E6D5C3] rounded-xl text-[#3a2010] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#5A3A2A] mb-1">
              Description <span className="font-normal text-[#8B5E3C]">(optional)</span>
            </label>
            <input
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Summer sale discount"
              className="w-full px-4 py-3 bg-white/60 border border-[#E6D5C3] rounded-xl text-[#3a2010] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 border-2 border-[#E6D5C3] text-[#8B5E3C] rounded-full hover:bg-[#E6D5C3] transition">
              Cancel
            </button>
            <button onClick={submit} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white rounded-full transition disabled:opacity-50">
              {saving
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Save className="w-4 h-4" /> Save</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── الصفحة الرئيسية ───────────────────────────────────────────────
export default function AdminPromoCodesPage() {
  const [promos, setPromos]         = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editPromo, setEditPromo]   = useState<PromoCode | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [copiedId, setCopiedId]     = useState<number | null>(null);

  const fetchPromos = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/promocode/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPromos(data.promocodes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPromos(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this promo code?")) return;
    const token = localStorage.getItem("token");
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/promocode/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed");
      toast.success("Deleted!");
      setPromos((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (promo: PromoCode) => {
    navigator.clipboard.writeText(promo.code);
    setCopiedId(promo.id);
    toast.success("Code copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif text-[#5A3A2A]">Promo Codes</h1>
          <p className="text-[#8B5E3C] text-sm mt-1">{promos.length} code{promos.length !== 1 ? "s" : ""} total</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white rounded-full transition"
        >
          <Plus className="w-4 h-4" /> New Code
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : promos.length === 0 ? (
        <div className="bg-white/40 rounded-2xl p-12 text-center shadow-md">
          <Tag className="w-12 h-12 text-[#8B5E3C] mx-auto mb-3 opacity-40" />
          <p className="text-[#8B5E3C]">No promo codes yet</p>
          <button onClick={() => setShowCreate(true)} className="mt-4 px-6 py-2 bg-[#8B5E3C] text-white rounded-full text-sm hover:bg-[#5A3A2A] transition">
            Create your first code
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {promos.map((promo) => (
            <div key={promo.id} className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              {/* الكود والخصم */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-3xl font-bold text-[#5A3A2A]">{promo.discount}%</p>
                  <p className="text-xs text-[#8B5E3C]">discount</p>
                </div>
                <Tag className="w-8 h-8 text-[#E6D5C3]" />
              </div>

              {/* الكود مع زرار copy */}
              <div className="flex items-center gap-2 bg-[#E6D5C3] rounded-xl px-3 py-2 mb-3">
                <span className="flex-1 font-mono font-bold text-[#5A3A2A] tracking-widest text-sm">
                  {promo.code}
                </span>
                <button
                  onClick={() => handleCopy(promo)}
                  className="text-[#8B5E3C] hover:text-[#5A3A2A] transition"
                  title="Copy code"
                >
                  {copiedId === promo.id
                    ? <Check className="w-4 h-4 text-green-600" />
                    : <Copy className="w-4 h-4" />
                  }
                </button>
              </div>

              {promo.description && (
                <p className="text-sm text-[#8B5E3C] mb-3">{promo.description}</p>
              )}

              {/* Edit + Delete */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setEditPromo(promo)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-sm border-2 border-[#E6D5C3] text-[#8B5E3C] hover:border-[#8B5E3C] rounded-full transition"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(promo.id)}
                  disabled={deletingId === promo.id}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-sm border-2 border-[#E6D5C3] text-red-400 hover:border-red-400 rounded-full transition disabled:opacity-50"
                >
                  {deletingId === promo.id
                    ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    : <><Trash2 className="w-3.5 h-3.5" /> Delete</>
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreate && <PromoModal onClose={() => setShowCreate(false)} onSave={fetchPromos} />}
      {editPromo  && <PromoModal initial={editPromo} onClose={() => setEditPromo(null)} onSave={fetchPromos} />}
    </div>
  );
}