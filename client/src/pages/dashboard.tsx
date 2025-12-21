import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/stats-card";
import { InitiativeCard } from "@/components/initiative-card";
import { FranchiseCard } from "@/components/franchise-card";
import { IssueCard } from "@/components/issue-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Zap,
  Play,
  Building2,
  AlertCircle,
  FileText,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Link } from "wouter";
import type { Initiative, FranchiseGroup, Issue, DashboardStats } from "@shared/schema";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
  });

  const { data: initiatives, isLoading: initiativesLoading } = useQuery<Initiative[]>({
    queryKey: ["/api/initiatives"],
  });

  const { data: franchises, isLoading: franchisesLoading } = useQuery<FranchiseGroup[]>({
    queryKey: ["/api/franchise-groups"],
  });

  const { data: issues, isLoading: issuesLoading } = useQuery<Issue[]>({
    queryKey: ["/api/issues"],
  });

  const runningAgents = initiatives?.filter((i) => i.status === "running") || [];
  const recentFranchises = franchises?.slice(0, 4) || [];
  const openIssues = issues?.filter((i) => i.status === "open" || i.status === "in_progress") || [];

  return (
    <div className="p-6 space-y-6" data-testid="page-dashboard">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            TGIF Project Control Center
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/initiatives" data-testid="link-view-all-initiatives">
              View All Initiatives
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Total Initiatives"
              value={stats?.totalInitiatives || 0}
              subtitle="Agents, workflows & integrations"
              icon={Zap}
            />
            <StatsCard
              title="Running Agents"
              value={stats?.runningAgents || 0}
              subtitle="Currently active"
              icon={Play}
            />
            <StatsCard
              title="Franchise Groups"
              value={`${stats?.franchiseGroupsCompleted || 0}/${stats?.franchiseGroupsTotal || 0}`}
              subtitle="Rollout progress"
              icon={Building2}
            />
            <StatsCard
              title="Open Issues"
              value={stats?.openIssues || 0}
              subtitle="Requiring attention"
              icon={AlertCircle}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Active Initiatives
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/initiatives" data-testid="link-all-initiatives">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {initiativesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : runningAgents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {runningAgents.slice(0, 4).map((initiative) => (
                  <InitiativeCard
                    key={initiative.id}
                    initiative={initiative}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <Zap className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No running initiatives
                </p>
                <Button variant="link" size="sm" asChild className="mt-2">
                  <Link href="/initiatives">Start an initiative</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Open Issues
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/issues" data-testid="link-all-issues">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[280px]">
              {issuesLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-3">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-20" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : openIssues.length > 0 ? (
                <div className="space-y-3 pr-4">
                  {openIssues.slice(0, 5).map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No open issues
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Franchise Rollout Progress
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/rollout" data-testid="link-rollout-tracker">
              View Tracker
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          {franchisesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentFranchises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentFranchises.map((franchise) => (
                <FranchiseCard key={franchise.id} franchise={franchise} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No franchise groups yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
