"use client";

import Image from "next/image";
import { useState } from "react";

type PropertyGalleryProps = {
  images: string[];
  alt: string;
  isLive?: boolean;
};

export function PropertyGallery({ images, alt, isLive }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={images[activeIndex]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
          priority
        />

        {isLive && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white">
            <span className="size-1.5 rounded-full bg-white" />
            Live
          </span>
        )}

        <button
          type="button"
          aria-label="Zoom image"
          className="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-lg bg-white/90 text-zinc-700 shadow-sm backdrop-blur-sm dark:bg-zinc-900/90 dark:text-zinc-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-4"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
          </svg>
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 ${
              activeIndex === index
                ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-black"
                : "opacity-80 hover:opacity-100"
            }`}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              sizes="150px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
