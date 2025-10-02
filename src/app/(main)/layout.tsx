import { FilterProvider } from "@/providers/filter-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FilterProvider>{children}</FilterProvider>;
}
