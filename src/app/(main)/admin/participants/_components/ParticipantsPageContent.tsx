"use client";

import { useSearchParams } from "next/navigation";
import { Users, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useModal } from "@/hooks/use-modal";
import { MODAL_TYPES } from "../../constants";
import { useParticipantsList } from "@/lib/queries/admin-queries";
import ParticipantsTable from "./ParticipantsTable";
import ParticipantsSearch from "./ParticipantsSearch";
import ParticipantsStats from "./ParticipantsStats";
import ParticipantsTableSkeleton from "./ParticipantsTableSkeleton";

export default function ParticipantsPageContent() {
  const { onOpen } = useModal();
  const searchParams = useSearchParams();

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Participants</h1>
          <p className="text-muted-foreground">
            Manage NDIS participants and their support plans
          </p>
        </div>
        <Button
          onClick={() => onOpen(MODAL_TYPES.CREATE_PARTICIPANT)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Participant
        </Button>
      </div>

      {/* Stats Cards */}
      <ParticipantsStats participants={participantsData?.participants || []} />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ParticipantsSearch />
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participants ({participantsData?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ParticipantsTableSkeleton />
          ) : (
            <ParticipantsTable
              participants={participantsData?.participants || []}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
