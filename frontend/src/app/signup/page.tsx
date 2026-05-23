"use client";
import { signUpSchema, type SignUpFormData } from "@/lib/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { useSignup } from "@/hooks/useSignup";
import Image from "next/image";
import logo from "../../../public/ChatGPT Image Apr 21, 2026, 08_28_17 PM.png";
import { Eye, EyeOff, User, Mail, Phone, Calendar, Lock, ArrowRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const { isPending } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", phone: "", dob: undefined },
  });

  // بنعمل الـ signup manually عشان نعرف الإيميل ونبين شاشة الـ verification
  const onSubmit = async (data: SignUpFormData) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || "",
        dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
      };

      const res = await fetch("http://localhost:5000/api/user/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || result.message || "Something went wrong");

      if (result.token) localStorage.setItem("token", result.token);

      setUserEmail(data.email);
      setDone(true);
    } catch (err: any) {
      // useSignup's onError handles toast — بس هنا نعمل alert بسيط
      toast.error(err.message || "Failed to create account");
    }
  };

  // ── شاشة الـ Verification ──────────────────────────────────────
  if (done) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center px-4">
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse-ring {
            0%   { transform: scale(1);   opacity: 1; }
            100% { transform: scale(1.6); opacity: 0; }
          }
          .verify-card { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
          .icon-pulse { position: relative; display: inline-flex; }
          .icon-pulse::before {
            content: '';
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            background: #8B5E3C22;
            animation: pulse-ring 1.8s ease-out infinite;
          }
        `}</style>

        <div className="verify-card max-w-md w-full text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-[#E6D5C3]">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="icon-pulse">
                <div className="w-20 h-20 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center">
                  <Mail className="w-9 h-9 text-[#8B5E3C]" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-serif text-[#5A3A2A] mb-3">Check your inbox</h2>
            <p className="text-[#8B5E3C] leading-relaxed mb-2">
              We sent a verification link to
            </p>
            <p className="font-semibold text-[#5A3A2A] text-sm bg-[#E6D5C3] rounded-xl px-4 py-2 inline-block mb-6 break-all">
              {userEmail}
            </p>
            <p className="text-sm text-[#8B5E3C] leading-relaxed mb-8">
              Click the link in the email to activate your account. Check your spam folder if you don't see it.
            </p>

            {/* Steps */}
            <div className="text-left space-y-3 mb-8">
              {[
                "Open the email from Bubbles & Bliss",
                "Click the verification link",
                "Start shopping!",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#8B5E3C] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm text-[#5A3A2A]">{step}</p>
                </div>
              ))}
            </div>

            <Link href="/signin">
              <button className="w-full py-3 bg-[#5A3A2A] hover:bg-[#3d2518] text-[#F3E8DE] rounded-full font-medium transition duration-300 flex items-center justify-center gap-2">
                Go to Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── شاشة الـ Sign Up ───────────────────────────────────────────
  return (
    <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center py-12 px-4">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .form-card { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .input-group { position: relative; }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #B09070;
          width: 16px;
          height: 16px;
          pointer-events: none;
        }
        .styled-input {
          width: 100%;
          padding: 12px 14px 12px 40px;
          background: rgba(255,255,255,0.6);
          border: 1.5px solid #E6D5C3;
          border-radius: 12px;
          color: #3a2010;
          font-size: 0.9rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .styled-input:focus {
          border-color: #8B5E3C;
          box-shadow: 0 0 0 3px rgba(139,94,60,0.1);
        }
        .styled-input.error { border-color: #ef4444; }
        .styled-input.error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #5A3A2A;
          color: #F3E8DE;
          border: none;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { background: #3d2518; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="form-card max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-[#E6D5C3] rounded-full flex items-center justify-center mb-4 overflow-hidden">
            <Image src={logo} alt="BUBBLES & BLISS Logo" width={64} height={64} className="object-cover w-full h-full" />
          </div>
          <h1 className="text-3xl font-serif text-[#5A3A2A] tracking-wide">Create Account</h1>
          <p className="text-[#8B5E3C] mt-1 text-sm">Join the BUBBLES & BLISS family</p>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#E6D5C3]/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-[#5A3A2A] text-sm font-semibold mb-1.5">Full Name</label>
              <div className="input-group">
                <User className="input-icon" />
                <input {...register("name")} placeholder="Your name" className={`styled-input ${errors.name ? "error" : ""}`} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#5A3A2A] text-sm font-semibold mb-1.5">Email Address</label>
              <div className="input-group">
                <Mail className="input-icon" />
                <input type="email" {...register("email")} placeholder="your@email.com" className={`styled-input ${errors.email ? "error" : ""}`} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone + DOB side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#5A3A2A] text-sm font-semibold mb-1.5">
                  Phone Number
                </label>
                <div className="input-group">
                  <Phone className="input-icon" />
                  <input type="tel" {...register("phone")} placeholder="01x..." className="styled-input" />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-[#5A3A2A] text-sm font-semibold mb-1.5">Date of Birth</label>
                <div className="input-group">
                  <Calendar className="input-icon" />
                  <input type="date" {...register("dob")} className={`styled-input ${errors.dob ? "error" : ""}`} />
                </div>
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#5A3A2A] text-sm font-semibold mb-1.5">Password</label>
              <div className="input-group">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`styled-input pr-10 ${errors.password ? "error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#8B5E3C", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isPending} className="submit-btn mt-2">
              {isPending ? (
                <><div className="w-5 h-5 border-2 border-[#F3E8DE] border-t-transparent rounded-full animate-spin" /> Creating account...</>
              ) : (
                <> Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E6D5C3]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-transparent text-[#B09070]">Or</span>
            </div>
          </div>

          <p className="text-center text-[#8B5E3C] text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-[#5A3A2A] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}