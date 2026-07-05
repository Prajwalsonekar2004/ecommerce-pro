import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col-reverse items-center gap-14 px-6 py-12 lg:f1">
        <HeroContent />
        <HeroImage />
      </div>
    </section>
  );
}
