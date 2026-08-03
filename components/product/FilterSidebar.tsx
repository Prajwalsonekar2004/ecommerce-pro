import FilterGroup from "./FilterGroup";
import PriceFilter from "./PriceFilter";

interface Props {
  brands: {
    id: string;
    name: string;
    slug: string;
  }[];

  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function FilterSidebar({ brands, categories }: Props) {
  return (
    <aside className="rounded-2xl border border-gray-200 p-6 space-y-8">
      <FilterGroup title="Category" queryKey="category" options={categories} />

      <FilterGroup title="Brand" queryKey="brand" options={brands} />

      <PriceFilter />
    </aside>
  );
}
