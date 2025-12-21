import { useQuery } from "@tanstack/react-query";
import { FranchiseCard } from "@/components/franchise-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import {
  Building2,
  Search,
  Filter,
  LayoutGrid,
  List,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import type { FranchiseGroup } from "@shared/schema";

export default function Rollout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { data: franchises, isLoading, refetch } = useQuery<FranchiseGroup[]>({
    queryKey: ["/api/franchise-groups"],
  });

  const filteredFranchises = franchises?.filter((franchise) => {
    const matchesSearch =
      searchQuery === "" ||
      franchise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      franchise.contactName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || franchise.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalLocations = franchises?.reduce((acc, f) => acc + (f.locationCount || 0), 0) || 0;
  const completedGroups = franchises?.filter((f) => f.status === "completed").length || 0;
  const inProgressGroups = franchises?.filter((f) => f.status === "in_progress").length || 0;
  const overallProgress = franchises?.length
    ? Math.round(franchises.reduce((acc, f) => acc + (f.progress || 0), 0) / franchises.length)
    : 0;

  return (
    <div className="p-6 space-y-6" data-testid="page-rollout">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Rollout Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            CT and Toast franchise rollout progress
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          data-testid="button-refresh-rollout"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Groups</p>
                <p className="text-2xl font-semibold">{franchises?.length || 0}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Locations</p>
                <p className="text-2xl font-semibold">{totalLocations}</p>
              </div>
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  {completedGroups}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                {inProgressGroups} in progress
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Overall Progress</p>
                <p className="text-sm font-semibold">{overallProgress}%</p>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search franchise groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-franchises"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            data-testid="button-grid-view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            data-testid="button-table-view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-20 mb-4" />
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4">
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        )
      ) : filteredFranchises && filteredFranchises.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFranchises.map((franchise) => (
              <FranchiseCard key={franchise.id} franchise={franchise} />
            ))}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Franchise Group</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-center">Locations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Accounting</TableHead>
                  <TableHead>Labor/Payroll</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFranchises.map((franchise) => (
                  <TableRow
                    key={franchise.id}
                    data-testid={`table-row-${franchise.id}`}
                  >
                    <TableCell className="font-medium">{franchise.name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{franchise.contactName || "-"}</p>
                        <p className="text-xs text-muted-foreground">
                          {franchise.contactEmail || ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {franchise.locationCount || 0}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={franchise.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress value={franchise.progress || 0} className="h-2 flex-1" />
                        <span className="text-xs font-medium w-8">
                          {franchise.progress || 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {franchise.accountingSystem || "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {franchise.laborPayrollSystem || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No franchise groups found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Franchise groups will appear here once added"}
          </p>
        </div>
      )}
    </div>
  );
}
