import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  footerDescription,
  footerLinks,
  footerServicesSection,
  copyrightText,
} from "../constants";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/ekcs-logo.png"
                alt="EverKind Community Support"
                width={150}
                height={150}
              />
            </Link>
            <p className="text-muted-foreground mb-4">{footerDescription}</p>
            <p className="text-sm text-muted-foreground">{copyrightText}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0 text-muted-foreground"
                    asChild
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerServicesSection.map((service) => (
                <li key={service.href}>
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0 text-muted-foreground"
                    asChild
                  >
                    <Link href={service.href}>{service.label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
