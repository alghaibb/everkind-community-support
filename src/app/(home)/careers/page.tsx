import CareerForm from "./CareerForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join our team at EverKind Community Support. We're looking for compassionate professionals to make a difference in our community.",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Join Our Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're looking for compassionate and dedicated professionals to
              join our mission of providing exceptional community support
              services.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Apply for a Position
            </h2>
            <p className="text-muted-foreground">
              Fill out the form below to submit your application. We'll review
              your qualifications and get back to you soon.
            </p>
          </div>

          <CareerForm />
        </div>
      </section>
    </div>
  );
}
