"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Loader from "../components/Loader";
import Map from "../components/map/Map";

export default function MapPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const [showLoader, setShowLoader] = useState(true);
  const hasSetFallback = useRef(false); // Track if fallback has been set

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch user's current location
  useEffect(() => {
    if (!user || retryCount > MAX_RETRIES) {
      if (!hasSetFallback.current) {
        setCurrentPosition([25.7617, -80.1918]); // Fallback to Miami
        hasSetFallback.current = true;
      }
      setIsFetching(false);
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchLocation = () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation not supported by this browser.");
        if (isMounted) {
          setCurrentPosition([25.7617, -80.1918]);
          setIsFetching(false);
        }
        return;
      }

      timeoutId = setTimeout(() => {
        console.warn("Geolocation timed out, falling back to Miami");
        if (isMounted) {
          setCurrentPosition([25.7617, -80.1918]);
          setIsFetching(false);
        }
      }, 15000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy}m`);

          if (isMounted) {
            if (accuracy > 100 && retryCount < MAX_RETRIES) {
              console.warn(`Low accuracy (${accuracy}m), retrying... Attempt ${retryCount + 1}`);
              setRetryCount((prev) => prev + 1);
            } else {
              setCurrentPosition([latitude, longitude]);
              setIsFetching(false);
            }
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          console.warn(`Geolocation error: ${error.message}`);
          if (isMounted) {
            if (retryCount < MAX_RETRIES) {
              console.warn(`Retrying due to error... Attempt ${retryCount + 1}`);
              setRetryCount((prev) => prev + 1);
            } else {
              setCurrentPosition([25.7617, -80.1918]);
              setIsFetching(false);
            }
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    };

    fetchLocation();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [user, retryCount]);

  if (showLoader || loading || isFetching || !user) {
    return showLoader ? (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    ) : null;
  }

  return (
    <section className="flex flex-col items-center min-h-screen p-4 w-full">
      <h1 className="text-3xl sm:text-4xl font-semibold text-center text-[#2c3e50] dark:text-gray-200 mb-4 sm:mb-6">
        Welcome, {user.username}!
      </h1>
      <p className="text-lg sm:text-xl text-center text-[#2c3e50] dark:text-gray-300 mb-2 sm:mb-4">
        Explore Your Fishing Spots!
      </p>
      <span className="mb-4 text-sm text-center text-[#2c3e50] dark:text-gray-400">
        🚧 This page is still being worked on and actively updated 🚧
      </span>
      <div className="w-full max-w-4xl mb-6 sm:mb-8">
        <Map
          currentPosition={currentPosition}
          setCurrentPosition={setCurrentPosition}
        />
      </div>
    </section>
  );
}