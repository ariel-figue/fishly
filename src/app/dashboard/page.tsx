"use client";

import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <section className="flex flex-col gap-4 items-center">
        <h2 className="text-3xl font-semibold text-center text-[#2c3e50]">
          Dashboard
        </h2>
        <p className="text-center text-[#34495e] text-base">
          This is your dashboard. Customize it by adding widgets or information panels.
        </p>
        {/* Add more dashboard components here */}
      </section>
    </Layout>
  );
}

