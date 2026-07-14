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
        <h2 className="text-5xl font-black tracking-tight">{title}</h2>

        <p className="mt-3 text-lg text-gray-500">{description}</p>
      </div>

      {href && (
        <Link href={href} className="font-semibold hover:underline transition">
          View All
        </Link>
      )}
    </div>
  );
}
