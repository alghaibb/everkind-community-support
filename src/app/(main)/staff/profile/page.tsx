import { Suspense } from "react";
import { Metadata } from "next";
import { ProfileContent } from "./_components/ProfileContent";
import { ProfileSkeleton } from "./_components/ProfileSkeleton";

export const metadata: Metadata = {
  title: "My Profile | EverKind Staff",
  description: "View and manage your profile settings",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
