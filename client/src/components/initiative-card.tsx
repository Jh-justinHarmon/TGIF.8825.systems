import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Play, Square, Settings, FileText, Clock } from "lucide-react";
import type { Initiative } from "@shared/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type InitiativeCardProps = {
  initiative: Initiative;
  onStart?: () => void;
  onStop?: () => void;
  onConfigure?: () => void;
};

const typeIcons: Record<string, string> = {
  agent: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  workflow: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  integration: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function InitiativeCard({
  initiative,
  onStart,
  onStop,
  onConfigure,
}: InitiativeCardProps) {
  const isRunning = initiative.status === "running";
  const typeClass = typeIcons[initiative.type] || typeIcons.integration;

  return (
    <Card
      className="group transition-all duration-200"
      data-testid={`initiative-card-${initiative.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-4 pb-2">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold ${typeClass}`}
          >
            {initiative.type.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm truncate">{initiative.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{initiative.type}</p>
          </div>
        </div>
        <StatusBadge status={initiative.status} />
      </CardHeader>

      <CardContent className="p-4 pt-2">
        {initiative.purpose && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {initiative.purpose}
          </p>
        )}

        {initiative.category && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-muted-foreground">Category:</span>
            <span className="text-xs font-medium capitalize">{initiative.category}</span>
          </div>
        )}

        {initiative.scripts && initiative.scripts.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {initiative.scripts.length} script{initiative.scripts.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {initiative.lastUpdated && (
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {initiative.lastUpdated}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          {isRunning ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onStop}
                  className="flex-1"
                  data-testid={`button-stop-${initiative.id}`}
                >
                  <Square className="h-3 w-3 mr-1" />
                  Stop
                </Button>
              </TooltipTrigger>
              <TooltipContent>Stop this initiative</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="default"
                  onClick={onStart}
                  className="flex-1"
                  data-testid={`button-start-${initiative.id}`}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start this initiative</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={onConfigure}
                data-testid={`button-configure-${initiative.id}`}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Configure</TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
