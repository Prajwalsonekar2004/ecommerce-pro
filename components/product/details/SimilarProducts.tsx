import { getAllProducts } from "@/services/product.service";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";

interface Props {
  currentProduct: Product;
}

export default async function SimilarProducts({ currentProduct }: Props) {
  const allProducts = await getAllProducts();

  const similarProducts = allProducts
    .filter((product) => product.id !== currentProduct.id)
    .filter(
      (product) =>
        product.category === currentProduct.category ||
        product.brand === currentProduct.brand,
    )
    .slice(0, 4);

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          You May Also Like
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {similarProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
