import BrandFilter from "./BrandFilter";

interface Props {
  brands: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function FilterSidebar({ brands }: Props) {
  return (
    <aside className="rounded-2xl border border-gray-200 p-6">
      <BrandFilter brands={brands} />
    </aside>
  );
}
