"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FishlyLogo from "../components/FishlyLogo";
import { signupUser } from "@/services/auth";
import Loader from "../components/Loader";
import { InputField, PasswordInputField } from "../components/InputFields";
import { handleNavigation } from "../utils/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useAuthRedirect } from "../utils/useAuthRedirect";

export default function Signup() {
  useAuthRedirect(); // Redirect logged-in users to dashboard early

  const { setToken } = useAuth();
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  });

  // Error State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  });

  // Input Handler
  const handleChange =
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [name]: event.target.value }));
      setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors on change
    };

  // Reusable Validation Function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.firstName) newErrors.firstName = "Field is required";
    if (!formData.lastName) newErrors.lastName = "Field is required";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.username) newErrors.username = "Field is required";
    if (!formData.password) newErrors.password = "Field is required";
    if (formData.password !== formData.repeatPassword)
      newErrors.repeatPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Run validation
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const data = await signupUser(formData);

      if (data?.user?.username) {
        setToken(data.token, data.user);
        handleNavigation(router, "/", setIsLoading);
      } else {
        throw new Error(data?.error || "Unexpected response structure");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({
        apiError:
          error instanceof Error ? error.message : "An unknown error occurred.",
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
    <div>
      <section className="flex flex-col gap-4 items-center w-[95vw]">
        <FishlyLogo
          handleNavigation={() => handleNavigation(router, "/", setIsLoading)}
        />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white p-4 rounded-md sm:w-[500px]"
        >
          <h2 className="text-5xl font-semibold text-center text-[#2c3e50] pb-4">
            Sign up
          </h2>

          {/* First Name & Last Name */}
          <div className="flex gap-4">
            <InputField
              name="firstName"
              value={formData.firstName}
              setValue={handleChange}
              error={errors.firstName}
            />
            <InputField
              name="lastName"
              value={formData.lastName}
              setValue={handleChange}
              error={errors.lastName}
            />
          </div>

          {/* Email & Username */}
          <InputField
            name="email"
            type="email"
            value={formData.email}
            setValue={handleChange}
            error={errors.email}
          />
          <InputField
            name="username"
            value={formData.username}
            setValue={handleChange}
            error={errors.username}
          />

          {/* Password & Repeat Password */}
          <PasswordInputField
            name="password"
            value={formData.password}
            setValue={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            error={errors.password}
          />
          <PasswordInputField
            name="repeatPassword"
            value={formData.repeatPassword}
            setValue={handleChange}
            showPassword={showRepeatPassword}
            setShowPassword={setShowRepeatPassword}
            error={errors.repeatPassword}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#2c3e50] text-white p-2 rounded-md font-bold hover:bg-[#2A4A68]"
          >
            Sign up
          </button>

          {/* API Error Message */}
          {errors.apiError && (
            <div className="text-red-500 text-sm text-center">
              {errors.apiError}
            </div>
          )}
        </form>

        {/* Navigation to Login */}
        <p className="text-center text-[#34495e] font-semibold">
          Already have an account?{" "}
          <button
            onClick={() => handleNavigation(router, "/login", setIsLoading)}
            className="underline hover:opacity-80 text-[#2c3e50]"
          >
            Log in
          </button>
        </p>
      </section>
    </div>
  );
}
