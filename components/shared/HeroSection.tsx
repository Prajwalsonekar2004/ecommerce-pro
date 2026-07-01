export default function HeroSection() {
  return (
    <section className="min-h-[80vh] flex item-center justify-center bg-gray-50 px-6">
      <div className="max-w-5xl text-center">
        <span className="text-sm font-semibold text-blue-600">
          New Collection 2026
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold mt-4 leading-tight">
          Premium Shopping
          <br />
          Start Here
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Discover premium products with fast delivery, Secure payments and
          trusted quality.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
            Shop Now
          </button>

          <button className="border px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            Explore Products
          </button>
        </div>
      
      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

        <div>
            <p className="text-3xl">🚚</p>
            <p className="font-semibold mt-2">Free Delivery</p>
        </div>

        <div>
            <p className="text-3xl">🔒</p>
            <p className="font-semibold mt-2">Secure Payment</p>
        </div>

        <div>
            <p className="text-3xl">↩️</p>
            <p className="font-semibold mt-2">Easy Returns</p>
        </div>

        <div>
            <p className="text-3xl">⭐</p>
            <p className="font-semibold mt-2">Trusted Quality</p>
        </div>
      </div>
      </div>
    </section>
  );
}