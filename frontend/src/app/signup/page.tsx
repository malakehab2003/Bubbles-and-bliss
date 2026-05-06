"use client";
import { signUpSchema, type SignUpFormData } from "@/lib/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { useSignup } from "@/hooks/useSignup";
import Image from "next/image";
import logo from "../../../public/ChatGPT Image Apr 21, 2026, 08_28_17 PM.png";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { signupUser, isPending } = useSignup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      dob: undefined,
    },
  });

  const password = watch("password");

  const onSubmit = (data: SignUpFormData) => {
    signupUser(data);
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
          <h1 className="text-3xl font-serif text-[#5A3A2A] tracking-wide">
            Create Account
          </h1>
          <p className="text-[#8B5E3C] mt-2">
            Join BUBBLES & BLISS family
          </p>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[#5A3A2A] mb-2 font-medium">
                Full Name
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="Name"
                className={`w-full px-4 py-3 text-black bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#E6D5C3] focus:border-[#8B5E3C]"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#5A3A2A] mb-2 font-medium">
                Email Address 
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 text-black bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#E6D5C3] focus:border-[#8B5E3C]"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[#5A3A2A] mb-2 font-medium">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="Number"
                className="w-full px-4 py-3 text-black bg-white/50 border border-[#E6D5C3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-[#5A3A2A] mb-2 font-medium">
                Date of Birth 
              </label>
              <input
                type="date"
                {...register("dob")}
                className={`w-full px-4 py-3 text-black bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${
                  errors.dob
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#E6D5C3] focus:border-[#8B5E3C]"
                }`}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#5A3A2A] mb-2 font-medium">
                Password 
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 text-black bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[#E6D5C3] focus:border-[#8B5E3C]"
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
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white py-3 rounded-xl font-medium transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                "Sign Up"
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
            Already have an account?{" "}
            <Link href="/signin" className="text-[#5A3A2A] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}