export default function ProductActions() {
  return (
    <div className="space-y-4">
      <button className="w-full rounded-full bg-black py-4 text-white transition hover:bg-neutral-800">
        Add to Cart
      </button>

      <button className="w-full rounded-full border py-4 transition hover:bg-neutral-100">
        Add to Wishlist
      </button>
    </div>
  );
}
