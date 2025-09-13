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

// Testimonials
interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  service: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Client",
    location: "Melbourne",
    content:
      "EverKind has been a lifesaver for our family. Their personal activities support has given my mother the independence she needed while ensuring her safety. The staff are incredibly compassionate and professional.",
    rating: 5,
    service: "Personal Activities",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Family Member",
    location: "Sydney",
    content:
      "The travel and transport service has been amazing. They've helped my brother attend all his medical appointments and social activities. The drivers are always punctual and friendly.",
    rating: 5,
    service: "Travel & Transport",
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Client",
    location: "Brisbane",
    content:
      "The nursing care provided by EverKind is exceptional. The nurses are highly skilled and genuinely care about my wellbeing. I feel safe and supported in my own home.",
    rating: 5,
    service: "Nursing Care",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Family Member",
    location: "Perth",
    content:
      "EverKind's daily tasks support has made such a difference in our lives. They help with everything from meal preparation to household management. Highly recommended!",
    rating: 5,
    service: "Daily Tasks",
  },
  {
    id: 5,
    name: "Lisa Rodriguez",
    role: "Client",
    location: "Adelaide",
    content:
      "The life skills development program has been transformative. I've gained so much confidence and independence. The support workers are patient and encouraging.",
    rating: 5,
    service: "Life Skills",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Family Member",
    location: "Hobart",
    content:
      "EverKind's household tasks service has been invaluable. They keep everything clean and organized, allowing us to focus on spending quality time together.",
    rating: 5,
    service: "Household Tasks",
  },
];
