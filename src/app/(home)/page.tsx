import Hero from "./_components/Hero";
import About from "./_components/About";
import Services from "./_components/Services";
import Testimonials from "./_components/Testimonials";
import CTA from "./_components/CTA";

// Revalidate homepage every 1 hour (marketing content rarely changes)
export const revalidate = 3600;

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <CTA />
    </div>
  );
}
