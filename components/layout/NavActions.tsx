import { Search, Heart, ShoppingBag, User } from "lucide-react";

export default function NavActions() {
  return (
    <div className="flex items-center gap-5 text-gray-600 hover:text-blacktransition duration-300">
      <Search size={22} />
      <Heart size={22} />
      <ShoppingBag size={22} />
      <User size={22} />
    </div>
  );
}