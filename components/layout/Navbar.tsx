import Logo from "./Logo";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-[77px] border-b border-black bg-white">
      <div className="mx-auto flex h-full items-center px-[96px]">
        <Logo />

        <div className="ml-auto flex items-center">
          <NavLinks />
          <div className="ml-[305px]">
            <NavActions />
          </div>
        </div>
      </div>
    </header>
  );
}
