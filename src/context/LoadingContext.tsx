// context/LoadingContext.tsx
"use client";

import { createContext, useContext, useState, ReactElement } from "react";

interface LoadingContextType {
  isChildLoading: boolean;
  setChildLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: (context: LoadingContextType) => ReactElement; // Accept a function as children
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isChildLoading, setChildLoading] = useState(false);

  const contextValue: LoadingContextType = { isChildLoading, setChildLoading };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children(contextValue)} {/* Call the children function with context */}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}