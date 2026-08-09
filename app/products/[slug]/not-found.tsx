import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-black">
        Product not found
      </h1>

      <p className="mt-4 text-neutral-500">
        The product you are looking for does not exist.
      </p>

      <Link
        href="/products"
        className="mt-8 rounded-full bg-black px-6 py-3 text-white transition-opacity hover:opacity-80"
      >
        Back to Products
      </Link>
    </main>
  );
}
