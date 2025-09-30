"use client";

import { lazy, Suspense } from "react";

const RejectApplicationDialog = lazy(
  () => import("@/app/(main)/admin/careers/_components/RejectApplicationDialog")
);
const CreateStaffFromCareer = lazy(
  () => import("@/app/(main)/admin/careers/_components/CreateStaffFromCareer")
);
const ApplicationDetails = lazy(
  () => import("@/app/(main)/admin/careers/_components/ApplicationDetails")
);
const ViewMessageDialog = lazy(
  () => import("@/app/(main)/admin/messages/_components/ViewMessageDialog")
);
const ReplyMessageDialog = lazy(
  () => import("@/app/(main)/admin/messages/_components/ReplyMessageDialog")
);
const DeleteContactMessageDialog = lazy(
  () =>
    import("@/app/(main)/admin/messages/_components/DeleteContactMessageDialog")
);
const DeleteCareerSubmissionDialog = lazy(
  () =>
    import(
      "@/app/(main)/admin/careers/_components/DeleteCareerSubmissionDialog"
    )
);
const EditStaffModal = lazy(
  () => import("@/app/(main)/admin/staff/_components/EditStaffModal")
);
const StaffDetailsModal = lazy(
  () => import("@/app/(main)/admin/staff/_components/StaffDetailsModal")
);
const CreateParticipantModal = lazy(
  () =>
    import("@/app/(main)/admin/participants/_components/CreateParticipantModal")
);
const ViewParticipantModal = lazy(
  () =>
    import("@/app/(main)/admin/participants/_components/ViewParticipantModal")
);
const EditParticipantModal = lazy(
  () =>
    import("@/app/(main)/admin/participants/_components/EditParticipantModal")
);
const ViewUserModal = lazy(
  () => import("@/app/(main)/admin/users/_components/ViewUserModal")
);
const EditUserModal = lazy(
  () => import("@/app/(main)/admin/users/_components/EditUserModal")
);
const DeleteUserDialog = lazy(
  () => import("@/app/(main)/admin/users/_components/DeleteUserDialog")
);
const BanUserDialog = lazy(
  () => import("@/app/(main)/admin/users/_components/BanUserDialog")
);
const RevokeSessionsDialog = lazy(
  () => import("@/app/(main)/admin/users/_components/RevokeSessionsDialog")
);

export function ModalProvider() {
  return (
    <>
      <Suspense fallback={null}>
        <RejectApplicationDialog />
      </Suspense>
      <Suspense fallback={null}>
        <CreateStaffFromCareer />
      </Suspense>
      <Suspense fallback={null}>
        <ApplicationDetails />
      </Suspense>
      <Suspense fallback={null}>
        <ViewMessageDialog />
      </Suspense>
      <Suspense fallback={null}>
        <ReplyMessageDialog />
      </Suspense>
      <Suspense fallback={null}>
        <DeleteContactMessageDialog />
      </Suspense>
      <Suspense fallback={null}>
        <DeleteCareerSubmissionDialog />
      </Suspense>
      <Suspense fallback={null}>
        <EditStaffModal />
      </Suspense>
      <Suspense fallback={null}>
        <StaffDetailsModal />
      </Suspense>
      <Suspense fallback={null}>
        <CreateParticipantModal />
      </Suspense>
      <Suspense fallback={null}>
        <ViewParticipantModal />
      </Suspense>
      <Suspense fallback={null}>
        <EditParticipantModal />
      </Suspense>
      <Suspense fallback={null}>
        <ViewUserModal />
      </Suspense>
      <Suspense fallback={null}>
        <EditUserModal />
      </Suspense>
      <Suspense fallback={null}>
        <DeleteUserDialog />
      </Suspense>
      <Suspense fallback={null}>
        <BanUserDialog />
      </Suspense>
      <Suspense fallback={null}>
        <RevokeSessionsDialog />
      </Suspense>
    </>
  );
}
