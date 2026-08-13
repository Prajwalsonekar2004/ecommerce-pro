import HeroContent from "./HeroContent";
import HeroCarousel from "./HeroCarousel";
import HeroBackground from "./HeroBackground";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <HeroBackground />

      <div className="mx-auto flex min-h-[560px] max-w-[1440px] items-center gap-8 px-6 py-10 lg:min-h-[600px] lg:px-12">
        <div className="w-full lg:w-[42%]">
          <HeroContent />
        </div>

        <div className="w-full lg:w-[58%]">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
