"use client";

import { ReactNode } from "react";
import { Swiper } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

type ProductSliderProps = {
  children: ReactNode;
};

export default function ProductSlider({
     children,
    }: ProductSliderProps) {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={24}
      slidesPerView={1.2}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },

        768: {
          slidesPerView: 2.5,
        },

        1024: {
          slidesPerView: 3,
        },

        1280: {
          slidesPerView: 4,
        },
      }}
    >
      {children}
    </Swiper>
  );
}
