"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "./Loader";

interface SidePaneItem {
  label: string;
  onClick: () => void;
}

const SidePaneItemComponent = ({ label, onClick }: SidePaneItem) => {
  return (
    <li
      className="text-2xl text-[#2c3e50] font-medium cursor-pointer hover:text-[#34495e] transition"
      onClick={onClick}
    >
      {label}
    </li>
  );
};

const SidePane = () => {
  const { logout } = useAuth(); // Access loading state from useAuth
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Clears token and user session
    router.push("/"); // Redirects to homepage
  };

  const initiateLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      handleLogout();
    }, 1000); // Show loader for 1 second before logging out
  };

  const handleWeatherClick = () => {
    window.alert("Weather clicked");
  };

  const handleMapClick = () => {
    window.alert("Map clicked");
  };

  const handleCatchesClick = () => {
    window.alert("Catches clicked");
  };

  return (
    <aside className="relative left-0 top-0 h-screen min-w-[250px] w-[250px] min-w-[200px] bg-[#f5f5f5] p-8">
      <ul className="flex flex-col gap-4">
        <SidePaneItemComponent label="Weather" onClick={handleWeatherClick} />
        <SidePaneItemComponent label="Map" onClick={handleMapClick} />
        <SidePaneItemComponent label="Catches" onClick={handleCatchesClick} />
      </ul>

      {/* Logout Button */}
      <button
        onClick={initiateLogout}
        className="bg-[#2c3e50] text-white px-4 py-2 rounded-md font-medium hover:bg-[#34495e] transition flex items-center justify-center w-1/2 min-w-[200px] min-h-[40px] bottom-8 absolute left-1/2 transform -translate-x-1/2"
      >
        {isLoggingOut ? <Loader size={24} color="white" /> : "Logout"}
      </button>
    </aside>
  );
};

export default SidePane;
