"use client";

import { useSearchParams } from "next/navigation";
import { Users, Plus, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useModal } from "@/hooks/use-modal";
import { MODAL_TYPES } from "../../constants";
import {
  useParticipantsList,
  adminQueryKeys,
} from "@/lib/queries/admin-queries";
import { exportParticipantsToCSV } from "@/lib/export-utils";
import { bulkDeleteParticipants } from "../actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ParticipantsTable from "./ParticipantsTable";
import ParticipantsSearch from "./ParticipantsSearch";
import ParticipantsStats from "./ParticipantsStats";
import ParticipantsTableSkeleton from "./ParticipantsTableSkeleton";

export default function ParticipantsPageContent() {
  const { onOpen } = useModal();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const disability = searchParams.get("disability") || undefined;
  const supportCoordinator =
    searchParams.get("supportCoordinator") || undefined;

  const {
    data: participantsData,
    isLoading,
    error,
  } = useParticipantsList({
    search,
    status,
    disability,
    supportCoordinator,
  });

  const handleBulkDelete = async (ids: string[]) => {
    const result = await bulkDeleteParticipants(ids);
    if (result.success) {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.participantsList({
          search,
          status,
          disability,
          supportCoordinator,
        }),
      });
      toast.success(result.message);
    } else {
      toast.error(result.error || "Failed to delete participants");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load participants</p>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Participants
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage NDIS participants and their support plans
          </p>
        </div>
        <Button
          onClick={() => onOpen(MODAL_TYPES.CREATE_PARTICIPANT)}
          className="gap-2 shrink-0 w-full sm:w-auto"
          size="lg"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">Add Participant</span>
          <span className="xs:hidden">Add</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <ParticipantsStats participants={participantsData?.participants || []} />

      {/* Search and Filters */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Search className="h-5 w-5 shrink-0" />
            <span className="truncate">Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ParticipantsSearch />
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card
        className="w-full overflow-hidden animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <CardHeader className="min-w-0">
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0">
            <CardTitle className="flex items-center gap-2 min-w-0 text-base sm:text-lg">
              <Users className="h-5 w-5 shrink-0" />
              <span className="truncate">
                Participants ({participantsData?.total || 0})
              </span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (participantsData?.participants) {
                  exportParticipantsToCSV(participantsData.participants);
                }
              }}
              disabled={!participantsData?.participants?.length}
              className="gap-2 shrink-0 w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              <span className="hidden xs:inline">Export CSV</span>
              <span className="xs:hidden">Export</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <div className="overflow-x-auto p-3 xs:p-4 sm:p-6">
            {isLoading ? (
              <ParticipantsTableSkeleton />
            ) : (
              <ParticipantsTable
                participants={participantsData?.participants || []}
                onBulkDelete={handleBulkDelete}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
