"use client";

import { useAuth } from "@/context/AuthProvider";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { LoadingProvider } from "@/context/LoadingContext";

// Define routes where SidePane should be hidden (moved outside component)
const routesWithoutSidePane = ["/", "/dashboard", "/login", "/register"];

const SidePane = dynamic(() => import("./SidePane"), {
  ssr: false,
  loading: () => <div className="hidden md:block w-[250px] h-full" />,
});

const Footer = dynamic(() => import("./Footer"), {
  ssr: false,
  loading: () => <div style={{ height: "150px" }} />,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const pathname = usePathname();

  // Memoize the hideSidePane logic
  const hideSidePane = useMemo(() => routesWithoutSidePane.includes(pathname), [pathname]);

  return (
    <LoadingProvider>
      {({ isChildLoading }) => (
        <div className="font-[family-name:var(--font-geist-sans)] min-h-screen flex flex-col bg-gradient-to-r from-[#a0c4ff] to-[#8dd6f9] dark:from-gray-800 dark:to-gray-900">
          {/* Row container for SidePane and main */}
          <div className={`flex flex-col ${user && !hideSidePane ? "md:flex-row" : "flex-col"}`}>
            {/* Render SidePane only if the user is logged in, not loading, and not on a route where it should be hidden */}
            {!authLoading && user && !hideSidePane && <SidePane />}

            {/* Main content area adjusts when SidePane is visible */}
            <main
              className={`flex flex-col flex-grow w-full ${
                user && !hideSidePane ? "md:ml-[250px]" : ""
              }`}
              aria-label="Main content"
            >
              {/* Container for children with padding */}
              <div
                className={`flex flex-col items-center justify-start gap-8 px-4 sm:px-8 py-4 sm:py-8 ${
                  user && !hideSidePane ? "pb-[72px] sm:pb-8" : "pb-4 sm:pb-8"
                }`}
              >
                {children}
              </div>
              {/* Lazy-loaded Footer - hidden during auth or child loading */}
              {!authLoading && !isChildLoading && <Footer />}
            </main>
          </div>
        </div>
      )}
    </LoadingProvider>
  );
}