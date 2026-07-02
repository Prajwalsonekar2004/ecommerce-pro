import Link from "next/link";
import { navigation } from "@/constants/data/navigation";

export default function NavLinks() {
  return (
    <nav>
      <ul className="flex gap-8">
        {navigation.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="hover:text-gray-600 transition">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
