"use client";

import Link from "next/link";
import { useState } from "react";
// import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import FishlyLogo from "../components/FishlyLogo";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // router.push("/dashboard");
    window.alert("Still working on this!");
  };

  return (
    <Layout>
      <section className="flex flex-col gap-4 items-center w-[95vw]">
        <FishlyLogo animated={false} />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white p-6 rounded-md w-full sm:w-[500px]"
        >
          <h2 className="text-5xl font-semibold text-center text-[#2c3e50] pb-2">
            Log in
          </h2>
          <label htmlFor="username" className="text-[#34495e] font-semibold">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="border-2 border-[#dfe6e9] p-2 rounded-md w-full font-semibold"
          />
          <label htmlFor="password" className="text-[#34495e] font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="border-2 border-[#dfe6e9] p-2 rounded-md w-full font-semibold"
          />
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
