import Link from "next/link";
import { navigation } from "@/constants/data/navigation";

export default function NavLinks() {
  return (
    <nav>
      <ul className="flex gap-8">
        {navigation.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="
relative
text-sm
font-semibold
tracking-wide
text-gray-700
transition-all
duration-300
hover:text-black
after:absolute
after:left-0
after:-bottom-2
after:h-[2px]
after:w-0
after:bg-black
after:transition-all
after:duration-300
hover:after:w-full
"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
