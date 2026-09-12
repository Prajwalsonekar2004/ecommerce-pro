import Link from "next/link";

interface AdminTopbarProps {
  name: string | null;
  title: string;
  description?: string;
}

export default function AdminTopbar({
  name,
  title,
  description,
}: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <div className="flex min-h-[76px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm text-neutral-500">{description}</p>
          )}
        </div>

        <Link
          href="/account"
          className="hidden text-right transition hover:opacity-70 sm:block"
        >
          <p className="text-sm font-medium">{name || "Admin"}</p>
          <p className="text-xs text-neutral-500">Administrator</p>
        </Link>
      </div>
    </header>
  );
}
