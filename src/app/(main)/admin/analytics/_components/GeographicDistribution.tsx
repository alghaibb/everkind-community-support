import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface GeographicDistributionProps {
  data: { location: string; count: number }[];
}

export default function GeographicDistribution({
  data,
}: GeographicDistributionProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const locations = data
    .map((item) => ({
      location: item.location,
      count: item.count,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const getLocationIcon = (location: string) => {
    const stateColors: Record<string, string> = {
      NSW: "bg-blue-100 text-blue-700",
      VIC: "bg-purple-100 text-purple-700",
      QLD: "bg-yellow-100 text-yellow-700",
      WA: "bg-red-100 text-red-700",
      SA: "bg-green-100 text-green-700",
      TAS: "bg-indigo-100 text-indigo-700",
      NT: "bg-orange-100 text-orange-700",
      ACT: "bg-pink-100 text-pink-700",
      Other: "bg-gray-100 text-gray-700",
    };
    return stateColors[location] || "bg-gray-100 text-gray-700";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Geographic Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locations.map((location) => (
            <div
              key={location.location}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`px-2 py-1 rounded-md text-xs font-medium ${getLocationIcon(location.location)}`}
                >
                  {location.location}
                </div>
                <span className="text-sm">
                  {location.count} participant{location.count !== 1 ? "s" : ""}
                </span>
              </div>
              <Badge variant="outline">{location.percentage}%</Badge>
            </div>
          ))}

          {locations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No location data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
