import FilterGroup from "./FilterGroup";
import PriceFilter from "./PriceFilter";

interface FilterOption {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  brands: FilterOption[];
  categories: FilterOption[];
}

export default function FilterSidebar({ brands, categories }: Props) {
  return (
    <aside className="sticky top-24 h-fit">
      <h2 className="mb-10 text-2xl font-bold tracking-tight">Filters</h2>

      <div className="space-y-10">
        <FilterGroup
          title="Category"
          queryKey="category"
          options={categories}
        />

        <FilterGroup title="Brand" queryKey="brand" options={brands} />

        <PriceFilter />
      </div>
    </aside>
  );
}
