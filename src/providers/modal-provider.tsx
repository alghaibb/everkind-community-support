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
    </>
  );
}
