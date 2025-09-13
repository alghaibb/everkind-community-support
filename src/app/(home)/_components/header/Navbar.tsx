"use client";

import Link from "next/link";
import { navLinks } from "../../constants";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navLinks.map((link) => {
          if (link.subLinks) {
            return (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {link.subLinks.map((subLink) => (
                      <ListItem
                        key={subLink.href}
                        title={subLink.label}
                        href={subLink.href}
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
                  className={navigationMenuTriggerStyle()}
                >
                  <Button variant="ghost" asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
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
}

function ListItem({ title, children, href }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Button variant="ghost" className="h-auto p-3 justify-start" asChild>
          <Link href={href}>
            <div className="space-y-1">
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </div>
          </Link>
        </Button>
      </NavigationMenuLink>
    </li>
  );
}
