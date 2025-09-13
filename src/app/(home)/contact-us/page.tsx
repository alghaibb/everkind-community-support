import ContactForm from "./ContactForm";
import ContactHero from "./_components/ContactHero";
import ContactInfo from "./_components/ContactInfo";
import ContactFAQ from "./_components/ContactFAQ";
import EmergencyContact from "./_components/EmergencyContact";
import ServiceAreas from "./_components/ServiceAreas";
import AdditionalContact from "./_components/AdditionalContact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with EverKind Community Support. We're here to help with all your community care needs.",
};

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <ContactHero />

      {/* Contact Form and Info Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <ContactInfo />
            </div>
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <ContactFAQ />
      <EmergencyContact />
      <ServiceAreas />
      <AdditionalContact />
    </div>
  );
}
