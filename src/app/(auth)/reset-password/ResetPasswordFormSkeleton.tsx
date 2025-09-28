import { Skeleton } from "@/components/ui/skeleton";

export default function ResetPasswordFormSkeleton() {
  return (
    <div className="space-y-4">
      {/* New Password Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 sm:h-11 w-full" />
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 sm:h-11 w-full" />
      </div>

      {/* Submit Button */}
      <Skeleton className="h-10 sm:h-11 w-full" />
    </div>
  );
}
