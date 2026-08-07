import { Product } from "@/types/product";
import ProductHeader from "./ProductHeader";
import ProductPrice from "../ProductPrice";
import ProductDescription from "./ProductDescription";

interface Props {
  product: Product;
}

export default function ProductInfo({ product }: Props) {
  return (
    <div className="flex flex-col">
      <ProductHeader product={product} />

      <div className="mt-8">
        <ProductPrice
          price={product.price}
          comparePrice={product.comparePrice}
        />
      </div>

      <div className="mt-10">
        <ProductDescription product={product} />
      </div>
    </div>
  );
}
