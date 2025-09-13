interface NavLink {
  label: string;
  href: string;
  subLinks?: NavLink[];
}

interface FooterLink {
  label: string;
  href: string;
}

// Nav Links
export const navLinks: NavLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "/about-us",
  },
  {
    label: "Services",
    href: "/services",
    subLinks: [
      {
        label: "Personal Activities",
        href: "/services/personal-activities",
      },
      {
        label: "Travel & Transport",
        href: "/services/travel-transport",
      },
      {
        label: "Nursing Care",
        href: "/services/nursing-care",
      },
      {
        label: "Daily Tasks",
        href: "/services/daily-tasks",
      },
      {
        label: "Life Skills",
        href: "/services/life-skills",
      },
      {
        label: "Household Tasks",
        href: "/services/household-tasks",
      },
      {
        label: "Community Participation",
        href: "/services/community-participation",
      },
      {
        label: "Therapeutic Supports",
        href: "/services/therapeutic-supports",
      },
      {
        label: "Group Activities",
        href: "/services/group-activities",
      },
    ],
  },
  {
    label: "Careers",
    href: "/careers",
  },
  {
    label: "Contact Us",
    href: "/contact-us",
  },
];

// Footer Links
export const footerDescription =
  "EverKind Community Support provides compassionate care and support services to help individuals live independently and thrive in their communities.";

export const footerLinks: FooterLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "/about-us",
  },
  {
    label: "Careers",
    href: "/careers",
  },
  {
    label: "Contact Us",
    href: "/contact-us",
  },
  {
    label: "Feedback",
    href: "/feedback",
  },
  {
    label: "Complaints",
    href: "/complaints",
  },
];

export const footerServicesSection: FooterLink[] = [
  {
    label: "Personal Activities",
    href: "/services/personal-activities",
  },
  {
    label: "Travel & Transport",
    href: "/services/travel-transport",
  },
  {
    label: "Nursing Care",
    href: "/services/nursing-care",
  },
  {
    label: "Daily Tasks",
    href: "/services/daily-tasks",
  },
  {
    label: "Life Skills",
    href: "/services/life-skills",
  },
  {
    label: "Household Tasks",
    href: "/services/household-tasks",
  },
  {
    label: "Community Participation",
    href: "/services/community-participation",
  },
  {
    label: "Therapeutic Supports",
    href: "/services/therapeutic-supports",
  },
  {
    label: "Group Activities",
    href: "/services/group-activities",
  },
];

export const copyrightText = `© ${new Date().getFullYear()} EverKind Community Support. All rights reserved.`;
