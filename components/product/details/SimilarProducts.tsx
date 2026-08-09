import Image from "next/image";
import Link from "next/link";

import { getAllProducts } from "@/services/product.service";
import { Product } from "@/types/product";

interface SimilarProductsProps {
  currentProduct: Product;
}

export default async function SimilarProducts({
  currentProduct,
}: SimilarProductsProps) {
  const allProducts = await getAllProducts();

  const similarProducts = allProducts
    .filter((product) => {
      if (product.id === currentProduct.id) {
        return false;
      }

      if (product.category !== currentProduct.category) {
        return false;
      }

      return product.stock > 0;
    })
    .slice(0, 4);

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="similar-products-heading">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Complete the look
          </p>

          <h2
            id="similar-products-heading"
            className="text-2xl font-semibold tracking-tight text-black sm:text-3xl"
          >
            You May Also Like
          </h2>
        </div>

        <Link
          href="/products"
          className="hidden text-sm font-medium text-black underline underline-offset-4 transition-opacity hover:opacity-60 sm:block"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {similarProducts.map((product) => {
          const image = product.images?.[0];

          if (!image) {
            return null;
          }

          const hasDiscount =
            typeof product.comparePrice === "number" &&
            product.comparePrice > product.price;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                {hasDiscount && (
                  <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-xs font-medium text-black">
                    Sale
                  </span>
                )}
              </div>

              <div className="pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  {product.brand}
                </p>

                <h3 className="mt-1 line-clamp-2 text-sm font-medium text-black sm:text-base">
                  {product.name}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="font-medium text-black">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>

                  {hasDiscount && product.comparePrice !== undefined && (
                    <span className="text-neutral-400 line-through">
                      ₹{product.comparePrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        href="/products"
        className="mt-8 block text-center text-sm font-medium text-black underline underline-offset-4 sm:hidden"
      >
        View All Products
      </Link>
    </section>
  );
}
