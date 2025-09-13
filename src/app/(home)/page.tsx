import Hero from "./_components/Hero";
import About from "./_components/About";
import Services from "./_components/Services";
import Testimonials from "./_components/Testimonials";
import CTA from "./_components/CTA";

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
