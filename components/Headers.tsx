import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { PopoverClose } from "@radix-ui/react-popover";
import { Menu, Trash2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ModeToggle from "./mode-toggle";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

const Header = () => {
  return (
    <header className="w-screen sticky top-0 h-16 p-1 z-50 bg-white dark:bg-[#030712]">
      <div className="flex max-w-7xl mx-auto justify-between items-center px-2">
        <div className="flex items-center lg:space-x-2 lg:px-1 lg:pr-3 rounded-full group transition-all duration-300">
          <Link href="/" className="flex items-center">
            <Image
              src="/favicon.ico"
              alt="User Management"
              width={35}
              height={35}
              className="dark:invert"
            />
            <span className="overflow-hidden w-100 max-w-0 group-hover:max-w-xs transition-all duration-300 font-bold text-lg text-gray-800 dark:text-gray-200 whitespace-nowrap ml-0 group-hover:ml-2">
              User Management
            </span>
          </Link>
        </div>
        {/* <Navigation /> */}
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4">
            <NavigationMenuItem className="flex gap-1 items-center">
              <NavigationMenuLink asChild className="hidden md:block">
                <Link href="/users">Users</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild className="hidden md:block">
                <Link href="/deleted">Deleted</Link>
              </NavigationMenuLink>
              <NavigationMenuLink>
                <ModeToggle toggle />
              </NavigationMenuLink>
              <NavigationMenuLink className="md:hidden block">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Open menu"
                    >
                      <Menu className="h-5 w-5 md:hidden block" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-2" align="end">
                    <nav className="flex flex-col gap-1">
                      <PopoverClose asChild>
                        <Link
                          href="/users"
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <Users className="h-4 w-4" />
                          Users
                        </Link>
                      </PopoverClose>
                      <PopoverClose asChild>
                        <Link
                          href="/deleted"
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Deleted
                        </Link>
                      </PopoverClose>
                    </nav>
                  </PopoverContent>
                </Popover>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center justify-center">
        <Separator className="" />
      </div>
    </header>
  );
};
export default Header;
