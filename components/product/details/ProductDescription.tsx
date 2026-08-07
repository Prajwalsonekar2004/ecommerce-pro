import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductDescription({ product }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Description</h2>

      <p className="mt-4 leading-8 text-neutral-600">{product.description}</p>
    </div>
  );
}
