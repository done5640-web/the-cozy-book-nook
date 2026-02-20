import { useState } from "react";

interface BookImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

/**
 * Optimized book cover image with:
 * - Blur placeholder while loading
 * - Smooth fade-in transition
 * - Error fallback
 */
export function BookImage({ src, alt, className = "", loading = "lazy" }: BookImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Tiny blur placeholder (base64 encoded 1x1 pixel)
  const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%23e5e7eb' width='1' height='1'/%3E%3C/svg%3E";

  if (error) {
    // Fallback for broken images
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <svg className="w-1/3 h-1/3 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <>
      {/* Blur placeholder */}
      {!loaded && (
        <img
          src={placeholder}
          alt=""
          className={`absolute inset-0 ${className}`}
          aria-hidden="true"
        />
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        decoding="async"
      />
    </>
  );
}
