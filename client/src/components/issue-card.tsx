import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { AlertCircle, User, Clock, ChevronRight } from "lucide-react";
import type { Issue } from "@shared/schema";

type IssueCardProps = {
  issue: Issue;
  onViewDetails?: () => void;
  onUpdateStatus?: (status: string) => void;
};

export function IssueCard({ issue, onViewDetails, onUpdateStatus }: IssueCardProps) {
  return (
    <Card
      className="group transition-all duration-200"
      data-testid={`issue-card-${issue.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3 className="font-medium text-sm">{issue.title}</h3>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={issue.priority} />
                <StatusBadge status={issue.status} />
              </div>
            </div>

            {issue.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                {issue.description}
              </p>
            )}

            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
              {issue.assignee && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{issue.assignee}</span>
                </div>
              )}
              {issue.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{issue.createdAt}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
              {issue.status === "open" && (
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1"
                  onClick={() => onUpdateStatus?.("in_progress")}
                  data-testid={`button-start-issue-${issue.id}`}
                >
                  Start Working
                </Button>
              )}
              {issue.status === "in_progress" && (
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1"
                  onClick={() => onUpdateStatus?.("resolved")}
                  data-testid={`button-resolve-issue-${issue.id}`}
                >
                  Mark Resolved
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="flex-1"
                onClick={onViewDetails}
                data-testid={`button-view-issue-${issue.id}`}
              >
                Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
