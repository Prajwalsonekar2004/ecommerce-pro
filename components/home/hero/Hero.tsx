import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center gap-10 px-6 py-10 lg:flex-row">
        <HeroContent />
        <HeroImage />
      </div>
    </section>
  );
}
