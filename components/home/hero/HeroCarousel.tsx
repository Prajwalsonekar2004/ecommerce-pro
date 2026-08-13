"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

import { heroSlides } from "@/constants/data/hero2";

export default function HeroCarousel() {
  return (
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[EffectCoverflow]}
        effect="coverflow"
        centeredSlides
        grabCursor
        loop
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 0,
          stretch: -15,
          depth: 120,
          modifier: 1.2,
          scale: 0.88,
          slideShadows: false,
        }}
        className="w-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className="!w-[300px] sm:!w-[380px] lg:!w-[480px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-neutral-100">
              <Image
                src={slide.image}
                alt="BlackHeadFashion collection"
                fill
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 380px, 480px"
                className="object-cover"
                priority={slide.id === 1}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
