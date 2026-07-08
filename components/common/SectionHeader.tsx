import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  description: string;
  href?: string;
};

export default function SectionHeader({
  title,
  description,
  href,
}: SectionHeaderProps) {
  return (
    <div className="mb-10 flex items-end justify-between">
      <div>
        <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>

        <p className="mt-2 text-gray-500">{description}</p>
      </div>

      {href && (
        <Link href={href} className="text-sm font-semibold hover:underline">
          View All
        </Link>
      )}
    </div>
  );
}
