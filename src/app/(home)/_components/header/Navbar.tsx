"use client";

import Link from "next/link";
import { navLinks } from "../../constants";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {navLinks.map((link) => {
          if (link.subLinks) {
            return (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[500px] grid-cols-2">
                    {link.subLinks.map((subLink) => (
                      <ListItem
                        key={subLink.href}
                        title={subLink.label}
                        href={subLink.href}
                        isActive={pathname === subLink.href}
                      >
                        Professional support services for{" "}
                        {subLink.label.toLowerCase()}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          } else {
            return (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-transparent hover:text-accent-foreground focus:bg-transparent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-transparent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-transparent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 relative",
                    pathname === link.href &&
                      "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-primary after:rounded-full"
                  )}
                >
                  <Link href={link.href}>{link.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface ListItemProps {
  title: string;
  children: React.ReactNode;
  href: string;
  isActive: boolean;
}

function ListItem({ title, children, href, isActive }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-transparent hover:text-accent-foreground focus:bg-transparent focus:text-accent-foreground relative",
            isActive &&
              "text-accent-foreground after:absolute after:bottom-0 after:left-3 after:right-3 after:h-1 after:bg-primary after:rounded-full"
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
