import { Metadata } from "next";
import { AvailableShiftsContent } from "./_components/AvailableShiftsContent";

export const metadata: Metadata = {
  title: "Available Shifts",
  description: "Create and manage shifts for staff to pick up",
};

export default function AvailableShiftsPage() {
  return <AvailableShiftsContent />;
}
