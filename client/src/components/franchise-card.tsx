import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/status-badge";
import { Building2, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import type { FranchiseGroup } from "@shared/schema";

type FranchiseCardProps = {
  franchise: FranchiseGroup;
  onViewDetails?: () => void;
};

export function FranchiseCard({ franchise, onViewDetails }: FranchiseCardProps) {
  const progressColor =
    franchise.progress && franchise.progress >= 100
      ? "bg-green-500"
      : franchise.progress && franchise.progress >= 50
      ? "bg-blue-500"
      : "bg-yellow-500";

  return (
    <Card
      className="group transition-all duration-200"
      data-testid={`franchise-card-${franchise.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-4 pb-2">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm truncate">{franchise.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {franchise.locationCount || 0} location{(franchise.locationCount || 0) !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
        <StatusBadge status={franchise.status} />
      </CardHeader>

      <CardContent className="p-4 pt-2">
        {franchise.contactName && (
          <div className="space-y-1.5 mb-3">
            <p className="text-sm font-medium">{franchise.contactName}</p>
            {franchise.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <a
                  href={`mailto:${franchise.contactEmail}`}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors truncate"
                  data-testid={`link-email-${franchise.id}`}
                >
                  {franchise.contactEmail}
                </a>
              </div>
            )}
            {franchise.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <a
                  href={`tel:${franchise.contactPhone}`}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  data-testid={`link-phone-${franchise.id}`}
                >
                  {franchise.contactPhone}
                </a>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Rollout Progress</span>
            <span className="font-medium">{franchise.progress || 0}%</span>
          </div>
          <Progress
            value={franchise.progress || 0}
            className="h-2"
            data-testid={`progress-${franchise.id}`}
          />
        </div>

        {(franchise.accountingSystem || franchise.laborPayrollSystem) && (
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            {franchise.accountingSystem && (
              <div>
                <span className="text-muted-foreground">Accounting</span>
                <p className="font-medium truncate">{franchise.accountingSystem}</p>
              </div>
            )}
            {franchise.laborPayrollSystem && (
              <div>
                <span className="text-muted-foreground">Labor/Payroll</span>
                <p className="font-medium truncate">{franchise.laborPayrollSystem}</p>
              </div>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between"
          onClick={onViewDetails}
          data-testid={`button-view-${franchise.id}`}
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
