type CategoryCardProps = {
  category: string;
};

export default function CategoryCard({ category }: Readonly<CategoryCardProps>) {
  return (
    <div className="border rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer">
      <h3 className="text-lg font-semibold">{category}</h3>
    </div>
  );
}