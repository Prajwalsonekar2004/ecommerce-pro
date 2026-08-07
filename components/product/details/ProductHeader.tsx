import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductHeader({ product }: Props) {
  return (
    <>
      <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
        {product.brand}
      </p>

      <h1 className="mt-2 text-4xl font-bold">{product.name}</h1>

      <p className="mt-2 text-neutral-500">{product.category}</p>
    </>
  );
}
