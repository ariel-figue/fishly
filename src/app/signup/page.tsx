"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FishlyLogo from "../components/FishlyLogo";
import { signupUser } from "@/services/auth";
import Loader from "../components/Loader";
import { InputField, PasswordInputField } from "../components/InputFields";
import { handleNavigation } from "../utils/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function Signup() {
  const { setToken } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
    apiError: "",
  });

  const router = useRouter();

  // Input validation handlers
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
    setIsSigningUp(true);

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

    if (Object.keys(newErrors).length > 0) {
      setIsSigningUp(false);
      return;
    }

    try {
      const data = await signupUser({
        firstName,
        lastName,
        email,
        username,
        password,
      });

      if (data?.user?.username) {
        // ✅ Store authentication token & user info
        setToken(data.token, data.user);

        // ✅ Redirect to home page with a loading state
        handleNavigation(router, "/", setIsSigningUp);
      } else {
        throw new Error(data?.error || "Unexpected response structure");
      }
    } catch (error) {
      console.error("Signup error:", error);

      setErrors((prev) => ({
        ...prev,
        apiError:
          error instanceof Error ? error.message : "An unknown error occurred.",
      }));

      setIsSigningUp(false);
    }
  };

  if (isSigningUp) {
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
          handleNavigation={() => handleNavigation(router, "/", setIsSigningUp)}
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
              name="First name"
              value={firstName}
              setValue={setFirstName}
              error={errors.firstName}
            />
            <InputField
              name="Last name"
              value={lastName}
              setValue={setLastName}
              error={errors.lastName}
            />
          </div>

          {/* Email & Username */}
          <InputField
            name="Email"
            value={email}
            setValue={setEmail}
            error={errors.email}
            type="email"
          />
          <InputField
            name="Username"
            value={username}
            setValue={setUsername}
            error={errors.username}
          />

          {/* Password & Repeat Password */}
          <PasswordInputField
            name="Password"
            value={password}
            setValue={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            error={errors.password}
          />
          <PasswordInputField
            name="Repeat password"
            value={repeatPassword}
            setValue={setRepeatPassword}
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

        {/* Navigation to Login with 0.5s loader */}
        <p className="text-center text-[#34495e] font-semibold">
          Already have an account?{" "}
          <button
            onClick={() => handleNavigation(router, "/login", setIsSigningUp)}
            className="underline hover:opacity-80 text-[#2c3e50]"
          >
            Log in
          </button>
        </p>
      </section>
    </div>
  );
}
