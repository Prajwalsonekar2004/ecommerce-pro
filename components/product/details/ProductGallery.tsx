"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Product } from "@/types/product";

interface Props {
  product?: Product;
}

export default function ProductGallery({ product }: Props) {
  const images = product?.images ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (!product) {
    return null;
  }

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center bg-neutral-100">
        <span className="text-sm text-neutral-500">
          No product images available
        </span>
      </div>
    );
  }

  const activeImage = images[activeIndex] ?? images[0];

  function previousImage() {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function nextImage() {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <div className="flex w-full items-start gap-2">
      {/* Thumbnails */}
      <div className="hidden w-[54px] shrink-0 flex-col gap-2 lg:flex">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1}`}
            className={`relative h-[54px] w-[54px] shrink-0 overflow-hidden rounded-[3px] bg-neutral-100 ${
              activeIndex === index
                ? "ring-1 ring-black"
                : "ring-1 ring-transparent"
            }`}
          >
            <Image
              src={image}
              alt={`${product.name} ${index + 1}`}
              fill
              sizes="54px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main product image */}
      <div className="relative min-w-0 flex-1 overflow-hidden bg-white">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 1024px) 100vw, 460px"
            className="object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={previousImage}
                aria-label="Previous image"
                className="absolute bottom-5 right-[60px] flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-neutral-100"
              >
                <ChevronLeft size={20} strokeWidth={1.7} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="Next image"
                className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-neutral-100"
              >
                <ChevronRight size={20} strokeWidth={1.7} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
