import { Logo } from "./navbar/Logo";
import { Navigation } from "./navbar/Navigation";
import { MobileMenu } from "./navbar/MobileMenu";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-16 px-4">
      <Logo />
      <div className="hidden md:block">
        <Navigation />
      </div>
      <MobileMenu />
    </nav>
  );
};