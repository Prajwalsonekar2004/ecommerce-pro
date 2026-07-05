import HeroButtons from "./HeroButtons";

export default function HeroContent() {
  return (
    <div className="flex-1">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
        New Collection
      </p>

      <h1 className="text-5xl font-bold leading-tight md:text-7xl">
        Move Beyond
        <br />
        Ordinary
      </h1>

      <p className="mt-6 max-w-lg text-lg text-gray-600">
        Premium fashion designed for comfort, confidence and everyday style.
      </p>

      <HeroButtons />
    </div>
  );
}
