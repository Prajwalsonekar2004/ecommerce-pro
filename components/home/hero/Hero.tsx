import HeroContent from "./HeroContent";
import HeroCarousel from "./HeroCarousel";
import HeroBackground from "./HeroBackground";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <HeroBackground />

      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col-reverse items-center gap-12 px-6 py-10 lg:flex-row lg:px-12">
        <HeroContent />

        <HeroCarousel />
      </div>
    </section>
  );
}
