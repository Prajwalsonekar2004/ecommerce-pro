import { products } from "@/constants/data/products";
import { getUniqueCategories } from "@/lib/product";
import CategoryCard from "../ui/CategoryCard";

export default function CategorySection() {
  const categories = getUniqueCategories(products);

  return (
    <section className="py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category} category={category}/>
        ))}
      </div>
    </section>
  );
}