"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import FishlyLogo from "../components/FishlyLogo";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "@/services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(email)) setErrors((prev) => ({ ...prev, email: "" }));
  }, [email]);

  useEffect(() => {
    if (password) setErrors((prev) => ({ ...prev, password: "" }));
  }, [password]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation checks
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Field is required";

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (Object.keys(newErrors).length > 0) return;

    try {
      const data = await loginUser({ email, password });

      if (data?.user?.username) {
        window.location.href = "/";
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors((prev) => ({
        ...prev,
        apiError:
          error instanceof Error
            ? error.message
            : "Failed to log in. Please try again.",
      }));
    }
  };

  return (
    <Layout>
      <section className="flex flex-col gap-4 items-center w-[95vw]">
        <FishlyLogo />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white p-4 rounded-md sm:w-[500px]"
        >
          <h2 className="text-5xl font-semibold text-center text-[#2c3e50] pb-4">
            Log in
          </h2>

          {/* Email Input */}
          <div className="flex flex-col gap-1">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`border p-2 rounded-md placeholder:text-[#4c4c4c] border-gray-300 font-semibold ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <div className="text-red-500 text-xs">{errors.email}</div>
            )}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1 relative">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`border p-2 rounded-md placeholder:text-[#4c4c4c] border-gray-300 w-full min-h-[40px] font-semibold ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-[#2c3e50] hover:opacity-75 flex"
                style={{ fontSize: "1.5rem" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <div className="text-red-500 text-xs">{errors.password}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#2c3e50] text-white p-2 rounded-md font-bold hover:bg-[#2A4A68]"
          >
            Login
          </button>
        </form>

        <p className="text-center text-[#34495e] font-semibold">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline hover:opacity-80">
            Sign up
          </Link>
        </p>
      </section>
    </Layout>
  );
}
