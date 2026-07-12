"use-client";

import { Swiper } from "swiper/types";
import "swiper/css";

type ProductSliderProps = {
  children: React.ReactNode;
};

export default function ProductSlider({ children }: ProductSliderProps) {
  return <div className="overflow-hidden">{children}</div>;
}
