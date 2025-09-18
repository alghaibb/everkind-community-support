export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-svh items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 sm:py-12 lg:py-16">
      {children}
    </div>
  );
}
