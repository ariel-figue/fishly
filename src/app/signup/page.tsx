"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import FishlyLogo from "../components/FishlyLogo";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signupUser } from "@/services/auth";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  });

  useEffect(() => {
    if (firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
  }, [firstName]);

  useEffect(() => {
    if (lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
  }, [lastName]);

  useEffect(() => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(email)) setErrors((prev) => ({ ...prev, email: "" }));
  }, [email]);

  useEffect(() => {
    if (username) setErrors((prev) => ({ ...prev, username: "" }));
  }, [username]);

  useEffect(() => {
    if (password) setErrors((prev) => ({ ...prev, password: "" }));
  }, [password]);

  useEffect(() => {
    if (password === repeatPassword)
      setErrors((prev) => ({ ...prev, repeatPassword: "" }));
  }, [password, repeatPassword]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation checks
    if (!firstName) newErrors.firstName = "Field is required";
    if (!lastName) newErrors.lastName = "Field is required";
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) newErrors.email = "Invalid email address";
    if (!username) newErrors.username = "Field is required";
    if (!password) newErrors.password = "Field is required";
    if (password !== repeatPassword)
      newErrors.repeatPassword = "Passwords do not match";

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (Object.keys(newErrors).length > 0) return;

    try {
      const data = await signupUser({
        firstName,
        lastName,
        email,
        username,
        password,
      });
      
      if (data?.user?.username) {
        window.location.href = "/";
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors((prev) => ({
        ...prev,
        apiError:
          error instanceof Error
            ? error.message
            : "Failed to create an account. Please try again.",
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
            Sign up
          </h2>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className={`border p-2 rounded-md w-full placeholder:text-[#4c4c4c] border-gray-300 font-semibold ${
                  errors.firstName ? "border-red-500" : ""
                }`}
              />
              {errors.firstName && (
                <div className="text-red-500 text-xs">{errors.firstName}</div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className={`border p-2 rounded-md w-full placeholder:text-[#4c4c4c] border-gray-300 font-semibold ${
                  errors.lastName ? "border-red-500" : ""
                }`}
              />
              {errors.lastName && (
                <div className="text-red-500 text-xs">{errors.lastName}</div>
              )}
            </div>
          </div>
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
          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={`border p-2 rounded-md placeholder:text-[#4c4c4c] border-gray-300 font-semibold ${
                errors.username ? "border-red-500" : ""
              }`}
            />
            {errors.username && (
              <div className="text-red-500 text-xs">{errors.username}</div>
            )}
          </div>
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
          <div className="flex flex-col gap-1 relative">
            <div className="relative">
              <input
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Repeat password"
                value={repeatPassword}
                onChange={(event) => setRepeatPassword(event.target.value)}
                className={`border p-2 rounded-md placeholder:text-[#4c4c4c] border-gray-300 w-full min-h-[40px] font-semibold ${
                  errors.repeatPassword ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-[#2c3e50] hover:opacity-75 flex"
                style={{ fontSize: "1.5rem" }}
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              >
                {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.repeatPassword && (
              <div className="text-red-500 text-xs">
                {errors.repeatPassword}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#2c3e50] text-white p-2 rounded-md font-bold hover:bg-[#2A4A68]"
          >
            Sign up
          </button>
        </form>
        <p className="text-center text-[#34495e] font-semibold">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:opacity-80">
            Login
          </Link>
        </p>
      </section>
    </Layout>
  );
}
