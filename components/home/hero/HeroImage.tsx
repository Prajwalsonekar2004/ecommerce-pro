import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="relative flex flex-1 justfy-center">
      <div className="relative h-[550px] w-full max-w-[500px] overflow-hidden rounded-3xl">
        <Image
          src="/images/hero/hero-1.jpg"
          alt="Fashion Collection"
          fill
          priority
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
    </div>
  );
}
