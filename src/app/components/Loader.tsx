"use client";

interface LoaderProps {
  size?: number; // Size in pixels
  color?: string; // Tailwind border color class
}

export default function Loader({ size = 48, color = "border-blue-500" }: LoaderProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`border-4 border-t-transparent animate-spin rounded-full ${color}`}
        style={{ width: `${size}px`, height: `${size}px`, borderWidth: "4px" }}
      ></div>
    </div>
  );
}
