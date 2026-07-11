"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { heroSlides } from "@/constants/data/hero2";

export default function HeroCarousel() {
  return (
    <Swiper
      modules={[EffectCoverflow]}
      effect="coverflow"
      grabCursor
      centeredSlides
      loop
      slidesPerView="auto"
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 120,
        modifier: 2,
        scale: 0.9,
        slideShadows: false,
      }}
    >
      {heroSlides.map((slide) => (
        <SwiperSlide key={slide.id} className="!w-[320px] md:!w-[420px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
            <Image
              src={slide.image}
              alt="Fashion Collection"
              fill
              sizes="(max-width:768px) 320px, 420px"
              className="object-cover"
              priority={slide.id === 1}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
