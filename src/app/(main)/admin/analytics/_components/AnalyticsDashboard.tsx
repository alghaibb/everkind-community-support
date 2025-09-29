import OverviewStats from "./OverviewStats";
import GrowthMetrics from "./GrowthMetrics";
import StatusDistributions from "./StatusDistributions";
import RecentActivity from "./RecentActivity";
import GeographicDistribution from "./GeographicDistribution";
import SupportAnalysis from "./SupportAnalysis";

interface AnalyticsData {
  overview: {
    totalParticipants: number;
    totalStaff: number;
    totalCareerApplications: number;
    totalContactMessages: number;
    totalBudgetAllocated: number;
    averageBudgetPerParticipant: number;
  };
  growth: {
    participants: { current: number; previous: number; growth: number };
    staff: { current: number; previous: number; growth: number };
    applications: { current: number; previous: number; growth: number };
    messages: { current: number; previous: number; growth: number };
  };
  distributions: {
    participantsByStatus: { status: string; count: number }[];
    staffByRole: { role: string; count: number }[];
    applicationsByStatus: { status: string; count: number }[];
    participantsByLocation: { location: string; count: number }[];
    commonDisabilities: { disability: string; count: number }[];
    supportNeedsDistribution: { support_need: string; count: number }[];
  };
  recentActivity: {
    participants: Array<{
      id: string;
      firstName: string;
      lastName: string;
      createdAt: string;
      status: string;
    }>;
    staff: Array<{
      id: string;
      staffRole: string;
      createdAt: string;
      user: { name: string };
    }>;
    applications: Array<{
      id: string;
      firstName: string;
      lastName: string;
      role: string;
      createdAt: string;
      status: string;
    }>;
  };
}

interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
}

export default function AnalyticsDashboard({
  analytics,
}: AnalyticsDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <OverviewStats overview={analytics.overview} />

      {/* Growth Metrics */}
      <GrowthMetrics growth={analytics.growth} />

      {/* Status Distributions */}
      <StatusDistributions distributions={analytics.distributions} />

      {/* Geographic & Support Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GeographicDistribution
          data={analytics.distributions.participantsByLocation}
        />
        <SupportAnalysis
          disabilities={analytics.distributions.commonDisabilities}
          supportNeeds={analytics.distributions.supportNeedsDistribution}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity activity={analytics.recentActivity} />
    </div>
  );
}
