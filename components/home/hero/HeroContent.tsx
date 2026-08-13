import HeroButtons from "./HeroButtons";

export default function HeroContent() {
  return (
    <div className="max-w-[520px]">
      <p className="text-sm font-medium tracking-wide text-neutral-500">
        NEW COLLECTION 2026
      </p>

      <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-tight text-black lg:text-6xl">
        Move Beyond
        <br />
        Ordinary
      </h1>

      <p className="mt-6 max-w-md text-base leading-7 text-neutral-600">
        Discover premium fashion designed for confidence, comfort and everyday
        style.
      </p>

      <HeroButtons />
    </div>
  );
}
