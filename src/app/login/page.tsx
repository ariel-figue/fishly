"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import FishlyLogo from "../components/FishlyLogo";
import Loader from "../components/Loader";
import { loginUser } from "@/services/auth";
import { InputField, PasswordInputField } from "../components/InputFields";
import { handleNavigation } from "../utils/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function Login() {
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", apiError: "" });
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggingIn(true);

    const newErrors: Record<string, string> = {};

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Field is required";

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (Object.keys(newErrors).length > 0) {
      setIsLoggingIn(false);
      return;
    }

    try {
      const data = await loginUser({ email, password });

      if (data?.user?.username) {
        setToken(data.token, data.user);
        handleNavigation(router, "/", setIsLoggingIn);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors((prev) => ({
        ...prev,
        apiError: error instanceof Error ? error.message : "Failed to log in. Please try again.",
      }));
      setIsLoggingIn(false);
    }
  };

  if (isLoggingIn) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="flex flex-col gap-4 items-center w-[95vw]">
        <FishlyLogo handleNavigation={() => handleNavigation(router, "/", setIsLoggingIn)} />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white p-4 rounded-md sm:w-[500px]"
        >
          <h2 className="text-5xl font-semibold text-center text-[#2c3e50] pb-4">
            Log in
          </h2>

          <InputField name="Email" value={email} setValue={setEmail} error={errors.email} type="email" />
          <PasswordInputField
            name="Password"
            value={password}
            setValue={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            error={errors.password}
          />

          <button
            type="submit"
            className="bg-[#2c3e50] text-white p-2 rounded-md font-bold hover:bg-[#2A4A68]"
          >
            Login
          </button>

          {errors.apiError && <div className="text-red-500 text-sm text-center">{errors.apiError}</div>}
        </form>
      </section>
    </Layout>
  );
}
