import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold">Product not found</h1>

      <p className="mt-4 text-neutral-500">
        The product you are looking for doesn't exist.
      </p>

      <Link
        href="/products"
        className="mt-8 rounded-full bg-black px-6 py-3 text-white"
      >
        Back to Products
      </Link>
    </main>
  );
}
