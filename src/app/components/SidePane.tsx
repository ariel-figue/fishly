"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { IoMdHome, IoMdMap, IoMdCloud, IoMdLogOut } from "react-icons/io"; // Import icons
import Loader from "./Loader";

interface SidePaneItem {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
}

const SidePaneItemComponent = ({ label, icon, onClick }: SidePaneItem) => (
  <button
    className="flex flex-col items-center justify-center text-[#2c3e50] hover:text-[#34495e] transition"
    onClick={onClick}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const SidePane = () => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const initiateLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      handleLogout();
    }, 1000);
  };

  const handleWeatherClick = () => window.alert("Weather clicked");
  const handleMapClick = () => window.alert("Map clicked");
  const handleCatchesClick = () => window.alert("Catches clicked");

  return (
    <>
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[250px] bg-[#f5f5f5] p-8">
        <ul className="flex flex-col gap-4">
          <SidePaneItemComponent label="Weather" icon={<IoMdCloud size={24} />} onClick={handleWeatherClick} />
          <SidePaneItemComponent label="Map" icon={<IoMdMap size={24} />} onClick={handleMapClick} />
          <SidePaneItemComponent label="Catches" icon={<IoMdHome size={24} />} onClick={handleCatchesClick} />
        </ul>

        {/* Logout Button (Desktop) */}
        <button
          onClick={initiateLogout}
          className="bg-[#2c3e50] text-white px-4 py-2 rounded-md font-medium hover:bg-[#34495e] transition flex items-center justify-center w-full mt-auto"
        >
          {isLoggingOut ? <Loader size={24} color="white" /> : "Logout"}
        </button>
      </aside>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#f5f5f5] shadow-md flex justify-around py-3 border-t border-gray-300">
        <SidePaneItemComponent label="Weather" icon={<IoMdCloud size={24} />} onClick={handleWeatherClick} />
        <SidePaneItemComponent label="Map" icon={<IoMdMap size={24} />} onClick={handleMapClick} />
        <SidePaneItemComponent label="Catches" icon={<IoMdHome size={24} />} onClick={handleCatchesClick} />
        <SidePaneItemComponent label="Logout" icon={<IoMdLogOut size={24} />} onClick={initiateLogout} />
      </nav>
    </>
  );
};

export default SidePane;
