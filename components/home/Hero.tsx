export default function Hero() {
  return (
    <section className="bg-stone-50">
      <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-6">
        <div className="max-w-xl">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
            New Collection
          </p>

          <h1 className="text-6xl font-bold leading-tight">
            Elevate Your Style.
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Discover premium fashion crafted for everyday confidence.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-md bg-black px-6 py-3 text-white">
              Shop Now
            </button>

            <button className="rounded-md border px-6 py-3">
              New Arrivals
            </button>
          </div>
        </div>
        <div className="flex-1"></div>
      </div>
    </section>
  );
}
