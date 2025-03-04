"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FishlyLogo from "../components/FishlyLogo";
import Loader from "../components/Loader";
import { loginUser } from "@/services/auth";
import { InputField, PasswordInputField } from "../components/InputFields";
import { handleNavigation } from "../utils/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useAuthRedirect } from "../utils/useAuthRedirect";

export default function Login() {
  useAuthRedirect(); // Redirect logged-in users before rendering anything

  const { setToken } = useAuth();
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes dynamically
  const handleChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors on change
  };

  // Form validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.password) newErrors.password = "Field is required";

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Validate input fields
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const data = await loginUser(formData);

      if (data?.user) {
        setToken(data.token, data.user);
        handleNavigation(router, "/", setIsLoading);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        apiError:
          error instanceof Error
            ? error.message
            : "Failed to log in. Please try again.",
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-start min-h-screen pt-6 sm:pt-8">
      <FishlyLogo
        handleNavigation={() => handleNavigation(router, "/", setIsLoading)}
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-md w-[90vw] sm:w-[500px] mt-4 sm:mt-6 shadow-md"
        aria-label="Login form"
      >
        <h2 className="text-4xl sm:text-5xl font-semibold text-center text-[#2c3e50] dark:text-gray-200 pb-4">
          Log in
        </h2>

        <InputField
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          setValue={handleChange("email")}
          error={errors.email}
        />
        <PasswordInputField
          name="password"
          placeholder="Password"
          value={formData.password}
          setValue={handleChange("password")}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          error={errors.password}
        />

        <button
          type="submit"
          className="bg-[#2c3e50] dark:bg-gray-700 text-white p-2 rounded-md font-bold hover:bg-[#2A4A68] dark:hover:bg-gray-600 transition-colors"
          aria-label="Log in"
        >
          Log in
        </button>

        {errors.apiError && (
          <div className="text-red-500 text-sm text-center mt-2">
            {errors.apiError}
          </div>
        )}
      </form>

      <p className="text-center text-[#34495e] dark:text-gray-400 font-semibold mt-4">
        Don&apos;t have an account?{" "}
        <button
          onClick={() => handleNavigation(router, "/signup", setIsLoading)}
          className="underline hover:opacity-80 text-[#2c3e50] dark:text-gray-200"
          aria-label="Sign up"
        >
          Sign up
        </button>
      </p>
    </section>
  );
}