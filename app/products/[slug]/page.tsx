import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/product.service";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-10">
      <h1 className="text-4xl font-bold">{product.name}</h1>

      <p className="mt-2 text-neutral-500">{product.brand}</p>

      <p className="mt-6">{product.description}</p>
    </main>
  );
}
