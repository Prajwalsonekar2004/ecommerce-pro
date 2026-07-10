import { heroContent } from "@/constants/data/hero";
import HeroButtons from "./HeroButtons";

export default function HeroContent() {
  return (
    <span className="text-sm font-semibold text-gray-500">
      NEW COLLECTION 2026
      <h1 className="mt-6 text-5xl font-black leading-none tracking-tight text-black md:text-6xl xl:text-8xl">
        Move Beyond
        <br />
        Ordinary
      </h1>
      <p className="mt-8 max-w-lg text-lg leading-8 text-gray-600">
        Discover premium fashion designed for confidence, comfort and everyday
        style.
      </p>
    </span>
  );
}
