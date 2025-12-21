import { useQuery, useMutation } from "@tanstack/react-query";
import { InitiativeCard } from "@/components/initiative-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Search, Filter, RefreshCw } from "lucide-react";
import { useState } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Initiative } from "@shared/schema";

export default function Initiatives() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: initiatives, isLoading, refetch } = useQuery<Initiative[]>({
    queryKey: ["/api/initiatives"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/initiatives/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/initiatives"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Status updated",
        description: "Initiative status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update initiative status.",
        variant: "destructive",
      });
    },
  });

  const filteredInitiatives = initiatives?.filter((initiative) => {
    const matchesSearch =
      searchQuery === "" ||
      initiative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      initiative.purpose?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || initiative.type === typeFilter;
    const matchesStatus = statusFilter === "all" || initiative.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const agents = filteredInitiatives?.filter((i) => i.type === "agent") || [];
  const workflows = filteredInitiatives?.filter((i) => i.type === "workflow") || [];
  const integrations = filteredInitiatives?.filter((i) => i.type === "integration") || [];

  const handleStart = (id: string) => {
    updateStatusMutation.mutate({ id, status: "running" });
  };

  const handleStop = (id: string) => {
    updateStatusMutation.mutate({ id, status: "stopped" });
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-initiatives">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Initiatives</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage agents, workflows, and integrations
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          data-testid="button-refresh-initiatives"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search initiatives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-initiatives"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-type-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="agent">Agents</SelectItem>
            <SelectItem value="workflow">Workflows</SelectItem>
            <SelectItem value="integration">Integrations</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="loaded">Loaded</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="stopped">Stopped</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">
            All ({filteredInitiatives?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="agents" data-testid="tab-agents">
            Agents ({agents.length})
          </TabsTrigger>
          <TabsTrigger value="workflows" data-testid="tab-workflows">
            Workflows ({workflows.length})
          </TabsTrigger>
          <TabsTrigger value="integrations" data-testid="tab-integrations">
            Integrations ({integrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-20 mb-4" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredInitiatives && filteredInitiatives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInitiatives.map((initiative) => (
                <InitiativeCard
                  key={initiative.id}
                  initiative={initiative}
                  onStart={() => handleStart(initiative.id)}
                  onStop={() => handleStop(initiative.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No initiatives found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Initiatives will appear here once configured"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="agents" className="mt-6">
          {agents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((initiative) => (
                <InitiativeCard
                  key={initiative.id}
                  initiative={initiative}
                  onStart={() => handleStart(initiative.id)}
                  onStop={() => handleStop(initiative.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted-foreground">No agents found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="workflows" className="mt-6">
          {workflows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflows.map((initiative) => (
                <InitiativeCard
                  key={initiative.id}
                  initiative={initiative}
                  onStart={() => handleStart(initiative.id)}
                  onStop={() => handleStop(initiative.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted-foreground">No workflows found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          {integrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((initiative) => (
                <InitiativeCard
                  key={initiative.id}
                  initiative={initiative}
                  onStart={() => handleStart(initiative.id)}
                  onStop={() => handleStop(initiative.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted-foreground">No integrations found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
