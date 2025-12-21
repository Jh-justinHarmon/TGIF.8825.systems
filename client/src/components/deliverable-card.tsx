import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  FileBarChart,
  File,
  Download,
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import type { Deliverable } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DeliverableCardProps = {
  deliverable: Deliverable;
  onDownload?: () => void;
  onOpenSheet?: () => void;
  onEdit?: () => void;
};

const typeIcons: Record<string, typeof FileText> = {
  document: FileText,
  spreadsheet: FileSpreadsheet,
  presentation: Presentation,
  report: FileBarChart,
  other: File,
};

const categoryColors: Record<string, string> = {
  playbook: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  tracking: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  communication: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  training: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export function DeliverableCard({
  deliverable,
  onDownload,
  onOpenSheet,
  onEdit,
}: DeliverableCardProps) {
  const Icon = typeIcons[deliverable.type] || File;
  const categoryClass = deliverable.category
    ? categoryColors[deliverable.category] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    : "";

  return (
    <Card
      className="group transition-all duration-200"
      data-testid={`deliverable-card-${deliverable.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm truncate">{deliverable.title}</h3>
                <p className="text-xs text-muted-foreground capitalize">{deliverable.type}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    data-testid={`button-menu-${deliverable.id}`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {deliverable.fileUrl && (
                    <DropdownMenuItem onClick={onDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                  )}
                  {deliverable.sheetUrl && (
                    <DropdownMenuItem onClick={onOpenSheet}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Sheet
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={onEdit}>
                    <FileText className="h-4 w-4 mr-2" />
                    Edit Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {deliverable.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                {deliverable.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <StatusBadge status={deliverable.status || "draft"} />
              {deliverable.category && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-md font-medium capitalize ${categoryClass}`}
                >
                  {deliverable.category}
                </span>
              )}
            </div>

            {deliverable.updatedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Updated {deliverable.updatedAt}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
          {deliverable.fileUrl && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={onDownload}
              data-testid={`button-download-${deliverable.id}`}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          )}
          {deliverable.sheetUrl && (
            <Button
              size="sm"
              variant="default"
              className="flex-1"
              onClick={onOpenSheet}
              data-testid={`button-open-sheet-${deliverable.id}`}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open Sheet
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
