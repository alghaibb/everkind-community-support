import Link from "next/link";
import Image from "next/image";
import {
  footerDescription,
  footerLinks,
  footerServicesSection,
  copyrightText,
} from "../constants";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/ekcs-logo.png"
                alt="EverKind Community Support"
                width={150}
                height={150}
                className="dark:invert"
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
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerServicesSection.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
