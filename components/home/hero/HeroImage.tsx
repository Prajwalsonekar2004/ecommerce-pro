import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="flex flex-1 justify-center">
      <Image
        src="/images/hero/hero-1.jpg"
        alt="Fashion Hero"
        width={650}
        height={750}
        priority
        className="rounded-3xl object-cover"
      />
    </div>
  );
}
