import { heroContent } from "@/constants/data/hero";
import HeroButtons from "./HeroButtons";

export default function HeroContent() {
  return (
    <div className="flex-1">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
        {heroContent.badge}
      </p>

      <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
        {heroContent.title}
      </h1>

      <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
        {heroContent.description}
      </p>

      <HeroButtons />
    </div>
  );
}
