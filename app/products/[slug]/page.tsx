type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailsPage({ params, }: Props) {
  const { slug } = await params;

  return (
    <main className="mx-auto max-w-[1440px] px-8 py-20">
      <h1 className="text-5xl font-bold">{slug}</h1>
    </main>
  );
}
