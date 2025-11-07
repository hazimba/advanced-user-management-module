import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";
import ModeToggle from "./mode-toggle";

const Header = () => {
  return (
    <header className="w-screen sticky top-4 h-14 p-1 z-50">
      <div className="flex max-w-7xl mx-auto justify-between items-center px-2">
        <div className="flex items-center lg:space-x-2 lg:px-1 lg:pr-3 rounded-full group transition-all duration-300">
          <Link href="/" className="flex items-center">
            <Image
              src="/favicon.ico"
              alt="User Management"
              width={40}
              height={40}
            />
            <span className="overflow-hidden w-100 max-w-0 group-hover:max-w-xs transition-all duration-300 font-bold text-lg text-gray-800 dark:text-gray-200 whitespace-nowrap ml-0 group-hover:ml-2">
              User Management
            </span>
          </Link>
        </div>
        {/* <Navigation /> */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="flex gap-4">
              <NavigationMenuLink asChild>
                <Link href="/users">Users</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link href="/permission">Permissions</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <ModeToggle toggle />
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};
export default Header;
