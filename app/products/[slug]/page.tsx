import {
  ProductGallery,
  ProductInfo,
  ProductActions,
  ProductDescription,
  RelatedProducts,
} from "@/components/product/details";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailsPage({ params, }: Props) {
  const { slug } = await params;

  return (
    <main className="mx-auto max-w-[1440px] px-8 py-20 lg:px-12">
      <section className="grid gap-12 lg:grid-cols-2">
        <ProductGallery />

        <div className="space-y-8">
          <ProductInfo slug={slug}/>
          <ProductActions />
        </div>
      </section>

      <ProductDescription />

      <RelatedProducts />
    </main>
  );
}
