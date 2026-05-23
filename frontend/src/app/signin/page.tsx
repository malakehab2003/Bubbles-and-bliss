"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../../public/ChatGPT Image Apr 21, 2026, 08_28_17 PM.png";
import { signInSchema, type SignInFormData } from "@/lib/validation/schemas";
import { useLogin } from "@/hooks/useLogin";
import toast from "react-hot-toast";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, isPending } = useLogin();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      await loginUser(data);
      toast.success("Welcome back! 🎉");
      router.push("/");
      setTimeout(() => {
        window.dispatchEvent(new Event("userChanged"));
      }, 300);
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-[#E6D5C3] rounded-full flex items-center justify-center mb-4 overflow-hidden">
            <Image
              src={logo}
              alt="BUBBLES & BLISS Logo"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-3xl font-serif text-[#5A3A2A] tracking-wide">Welcome Back</h1>
          <p className="text-[#8B5E3C] mt-2">Sign in to continue your fragrance journey</p>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-[#5A3A2A] mb-2 font-medium">Email Address</label>
              <input
                type="email"
                {...register("email")}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 text-black bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-[#E6D5C3] focus:border-[#8B5E3C]"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[#5A3A2A] mb-2 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 text-black bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-[#E6D5C3] focus:border-[#8B5E3C]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B5E3C] hover:text-[#5A3A2A]"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-[#8B5E3C] hover:text-[#5A3A2A] transition">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white py-3 rounded-xl font-medium transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E6D5C3]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-[#8B5E3C]">Or</span>
            </div>
          </div>

          <p className="text-center text-[#8B5E3C]">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#5A3A2A] font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}