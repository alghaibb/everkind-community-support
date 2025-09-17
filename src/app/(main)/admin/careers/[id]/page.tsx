import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, Download, Mail, Phone, Calendar, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Career Application Details | Admin",
};

export default async function CareerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Check authentication
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect("/");
  }

  const userWithRole = session.user as typeof session.user & { role?: string };
  
  if (userWithRole.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch the career submission
  const submission = await prisma.careerSubmission.findUnique({
    where: { id: params.id },
  });

  if (!submission) {
    notFound();
  }

  // Parse availability JSON
  const availability = submission.availability as Record<
    string,
    { am: boolean; pm: boolean }
  >;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/careers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {submission.firstName} {submission.lastName}
            </h1>
            <p className="text-muted-foreground">
              Applied for {submission.role}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`mailto:${submission.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Email Applicant
            </a>
          </Button>
          {submission.resume && (
            <Button variant="outline" asChild>
              <a
                href={submission.resume}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-sm">
                    {submission.firstName} {submission.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm">{submission.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-sm">{submission.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Role Applied For
                  </p>
                  <Badge className="mt-1">{submission.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications & Checks */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Checks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {submission.role === "Support Worker" && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Cert III Individual Support
                    </p>
                    <p className="text-sm">{submission.cert3IndividualSupport}</p>
                  </div>
                )}
                {(submission.role === "Registered Nurse" || submission.role === "Enrolled Nurse") && submission.ahpraRegistration && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      AHPRA Registration
                    </p>
                    <p className="text-sm">{submission.ahpraRegistration}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    COVID Vaccinations
                  </p>
                  <p className="text-sm">{submission.covidVaccinations}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Influenza Vaccination
                  </p>
                  <p className="text-sm">{submission.influenzaVaccination}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Working with Children Check
                  </p>
                  <p className="text-sm">{submission.workingWithChildrenCheck}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    NDIS Worker Screening Check
                  </p>
                  <p className="text-sm">{submission.ndisScreeningCheck}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Police Check
                  </p>
                  <p className="text-sm">{submission.policeCheck}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Working Rights
                  </p>
                  <p className="text-sm">{submission.workingRights}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training & Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Training & Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  NDIS Modules
                </p>
                <p className="text-sm">{submission.ndisModules}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  First Aid & CPR
                </p>
                <p className="text-sm">{submission.firstAidCPR}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Experience
                </p>
                <p className="text-sm whitespace-pre-wrap">{submission.experience}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(availability).map(([day, times]) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {day}
                    </span>
                    <div className="flex gap-2">
                      {times.am && (
                        <Badge variant="outline" className="text-xs">
                          AM
                        </Badge>
                      )}
                      {times.pm && (
                        <Badge variant="outline" className="text-xs">
                          PM
                        </Badge>
                      )}
                      {!times.am && !times.pm && (
                        <span className="text-xs text-muted-foreground">
                          Not available
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {submission.resume && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a
                    href={submission.resume}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Resume
                  </a>
                </Button>
              )}
              {submission.certificates.length > 0 && (
                <>
                  <Separator />
                  <p className="text-sm font-medium">Certificates</p>
                  {submission.certificates.map((cert, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={cert}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Certificate {index + 1}
                      </a>
                    </Button>
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          {/* Application Info */}
          <Card>
            <CardHeader>
              <CardTitle>Application Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Submitted {new Date(submission.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
