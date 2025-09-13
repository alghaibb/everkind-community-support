import Header from "./_components/header/Header";
import Footer from "./_components/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
