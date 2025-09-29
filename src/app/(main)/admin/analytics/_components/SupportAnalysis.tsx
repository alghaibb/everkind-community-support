import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Shield } from "lucide-react";

interface SupportAnalysisProps {
  disabilities: { disability: string; count: number }[];
  supportNeeds: { support_need: string; count: number }[];
}

export default function SupportAnalysis({
  disabilities,
  supportNeeds,
}: SupportAnalysisProps) {
  const formatLabel = (text: string) => {
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const renderAnalysisSection = (
    title: string,
    data:
      | { disability: string; count: number }[]
      | { support_need: string; count: number }[],
    icon: React.ElementType,
    keyField: "disability" | "support_need"
  ) => {
    const processedData = data
      .map((item) => ({
        label:
          keyField === "disability"
            ? (item as { disability: string }).disability
            : (item as { support_need: string }).support_need,
        count:
          keyField === "disability"
            ? (item as { count: number }).count
            : (item as { count: number }).count,
      }))
      .sort((a, b) => b.count - a.count);

    const total = processedData.reduce((sum, item) => sum + item.count, 0);
    const Icon = icon;

    return (
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </h3>
        <div className="space-y-3">
          {processedData.slice(0, 8).map((item, index) => {
            const percentage =
              total > 0 ? Math.round((item.count / total) * 100) : 0;

            return (
              <div key={`${keyField}-${index}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {formatLabel(item.label)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.count}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={percentage} className="h-1.5" />
              </div>
            );
          })}

          {processedData.length === 0 && (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No data available
            </div>
          )}

          {processedData.length > 8 && (
            <div className="text-center pt-2">
              <Badge variant="secondary" className="text-xs">
                +{processedData.length - 8} more
              </Badge>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {renderAnalysisSection(
          "Common Disabilities",
          disabilities,
          Heart,
          "disability"
        )}

        <div className="border-t pt-6">
          {renderAnalysisSection(
            "Support Needs",
            supportNeeds,
            Shield,
            "support_need"
          )}
        </div>
      </CardContent>
    </Card>
  );
}
