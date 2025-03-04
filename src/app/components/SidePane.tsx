"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { JSX, useState, memo } from "react";
import { IoMdMap, IoMdSunny, IoMdLogOut } from "react-icons/io";
import { GiFishingPole } from "react-icons/gi";
import Loader from "./Loader";

interface SidePaneItem {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  isActive: boolean;
}

const SidePaneItemComponent = memo(({ label, icon, onClick, isActive }: SidePaneItem) => (
  <button
    className={`flex flex-col items-center justify-center text-[#2c3e50] hover:bg-[#e0e7ff] hover:text-[#1e3a8a] hover:font-semibold transition py-2 px-4 rounded-lg ${
      isActive ? "bg-[#e0e7ff] text-[#1e3a8a] font-semibold" : ""
    }`}
    onClick={onClick}
    aria-label={label}
  >
    {icon}
    <span className="text-xs font-medium mt-1">{label}</span>
  </button>
));
SidePaneItemComponent.displayName = "SidePaneItemComponent";

const SidePane = () => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      router.push("/");
    }, 1000);
  };

  const handleWeatherClick = () => router.push("/weather");
  const handleMapClick = () => router.push("/map");
  const handleCatchesClick = () => router.push("/catches");

  const navItems = [
    { label: "Weather", icon: <IoMdSunny size={24} />, onClick: handleWeatherClick, path: "/weather" },
    { label: "Map", icon: <IoMdMap size={24} />, onClick: handleMapClick, path: "/map" },
    { label: "Catches", icon: <GiFishingPole size={24} />, onClick: handleCatchesClick, path: "/catches" },
  ];

  return (
    <>
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 w-[250px] h-screen bg-[#f8fafc] dark:bg-[#1e293b] shadow-lg p-6 z-10">
        <div className="flex flex-col h-full">
          <nav className="flex flex-col gap-2 overflow-y-auto">
            {navItems.map((item) => (
              <SidePaneItemComponent
                key={item.label}
                label={item.label}
                icon={item.icon}
                onClick={item.onClick}
                isActive={pathname === item.path}
              />
            ))}
          </nav>

          {/* Logout Button (Desktop) - Positioned at the bottom using flexbox */}
          <button
            onClick={handleLogout}
            className="bg-[#2c3e50] dark:bg-[#334155] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1e3a8a] dark:hover:bg-[#475569] transition flex items-center justify-center gap-2 w-full mt-auto mb-4 shadow-sm"
            aria-label="Logout"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? <Loader size={24} color="white" /> : <IoMdLogOut size={20} />}
            {isLoggingOut ? "Logging Out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#f8fafc] dark:bg-[#1e293b] shadow-md flex justify-around py-2 border-t border-gray-300 h-16 supports-[padding-bottom:env(safe-area-inset-bottom)]:pb-[calc(env(safe-area-inset-bottom)+0.2rem)] z-10 overflow-x-auto">
        {navItems.map((item) => (
          <SidePaneItemComponent
            key={item.label}
            label={item.label}
            icon={item.icon}
            onClick={item.onClick}
            isActive={pathname === item.path}
          />
        ))}
        <SidePaneItemComponent
          label="Logout"
          icon={isLoggingOut ? <Loader size={24} /> : <IoMdLogOut size={24} />}
          onClick={handleLogout}
          isActive={false}
        />
      </nav>
    </>
  );
};

export default SidePane;