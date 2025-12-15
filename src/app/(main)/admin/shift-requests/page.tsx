import { Metadata } from "next";
import { ShiftRequestsContent } from "./_components/ShiftRequestsContent";

export const metadata: Metadata = {
  title: "Shift Requests",
  description: "Review and manage staff shift pickup requests",
};

export default function ShiftRequestsPage() {
  return <ShiftRequestsContent />;
}
