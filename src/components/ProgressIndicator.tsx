import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileSearch, AlertCircle } from "lucide-react";

interface ProgressIndicatorProps {
  isActive?: boolean;
  status?: "idle" | "crawling" | "processing" | "completed" | "error";
  pagesScanned?: number;
  totalPages?: number;
  estimatedTimeRemaining?: number; // in seconds
  errorMessage?: string;
}

const ProgressIndicator = ({
  isActive = false,
  status = "idle",
  pagesScanned = 0,
  totalPages = 100,
  estimatedTimeRemaining = 0,
  errorMessage = "",
}: ProgressIndicatorProps) => {
  // Calculate progress percentage
  const progressPercentage =
    totalPages > 0
      ? Math.min(Math.round((pagesScanned / totalPages) * 100), 100)
      : 0;

  // Format estimated time remaining
  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return "Less than a minute";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) return `${remainingSeconds} seconds`;
    if (minutes === 1)
      return `1 minute ${remainingSeconds > 0 ? `${remainingSeconds} seconds` : ""}`;
    return `${minutes} minutes ${remainingSeconds > 0 ? `${remainingSeconds} seconds` : ""}`;
  };

  // Status badge color mapping
  const statusColorMap = {
    idle: "bg-slate-500",
    crawling: "bg-blue-500",
    processing: "bg-amber-500",
    completed: "bg-green-500",
    error: "bg-red-500",
  };

  // Status text mapping
  const statusTextMap = {
    idle: "Ready",
    crawling: "Crawling",
    processing: "Processing",
    completed: "Completed",
    error: "Error",
  };

  if (!isActive) return null;

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl border-0 ring-1 ring-slate-200/50">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge
                className={`${statusColorMap[status]} text-white px-3 py-1 text-sm font-medium`}
              >
                {statusTextMap[status]}
              </Badge>
              <span className="text-slate-700 font-medium">
                {status === "crawling" || status === "processing"
                  ? "In progress..."
                  : ""}
              </span>
            </div>
            <span className="text-lg font-semibold text-slate-800">
              {progressPercentage}% complete
            </span>
          </div>

          <Progress value={progressPercentage} className="h-3 bg-slate-200" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <FileSearch className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                {pagesScanned} of {totalPages} pages scanned
              </span>
            </div>

            {(status === "crawling" || status === "processing") && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Est. time remaining:{" "}
                  {formatTimeRemaining(estimatedTimeRemaining)}
                </span>
              </div>
            )}

            {status === "error" && errorMessage && (
              <div className="flex items-center space-x-2 col-span-full">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">{errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressIndicator;
