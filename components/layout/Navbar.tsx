import Logo from "./Logo";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        <NavLinks />

        <NavActions />
      </div>
    </header>
  );
}
