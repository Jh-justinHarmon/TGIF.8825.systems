import { useQuery } from "@tanstack/react-query";
import { DeliverableCard } from "@/components/deliverable-card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Upload,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Deliverable } from "@shared/schema";

export default function Deliverables() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: deliverables, isLoading, refetch } = useQuery<Deliverable[]>({
    queryKey: ["/api/deliverables"],
  });

  const filteredDeliverables = deliverables?.filter((deliverable) => {
    const matchesSearch =
      searchQuery === "" ||
      deliverable.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deliverable.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || deliverable.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || deliverable.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const documents = filteredDeliverables?.filter((d) => d.type === "document") || [];
  const spreadsheets = filteredDeliverables?.filter((d) => d.type === "spreadsheet") || [];
  const presentations = filteredDeliverables?.filter((d) => d.type === "presentation") || [];
  const reports = filteredDeliverables?.filter((d) => d.type === "report") || [];

  const handleOpenSheet = (url?: string | null) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleDownload = (url?: string | null) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      toast({
        title: "Download unavailable",
        description: "This file is not available for download.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-deliverables">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Deliverables</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Project documents, spreadsheets, and resources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            data-testid="button-refresh-deliverables"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-deliverable">
                <Plus className="h-4 w-4 mr-2" />
                Add Deliverable
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Deliverable</DialogTitle>
                <DialogDescription>
                  Add a document, spreadsheet, or other resource to the repository.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter deliverable title" data-testid="input-deliverable-title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the deliverable"
                    data-testid="input-deliverable-description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger data-testid="select-deliverable-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                        <SelectItem value="presentation">Presentation</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger data-testid="select-deliverable-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="playbook">Playbook</SelectItem>
                        <SelectItem value="tracking">Tracking</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sheetUrl">Sheet URL (optional)</Label>
                  <Input
                    id="sheetUrl"
                    placeholder="https://docs.google.com/spreadsheets/..."
                    data-testid="input-deliverable-sheet-url"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button data-testid="button-save-deliverable">
                  <Upload className="h-4 w-4 mr-2" />
                  Save Deliverable
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deliverables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-deliverables"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-type-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
            <SelectItem value="presentation">Presentations</SelectItem>
            <SelectItem value="report">Reports</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-category-filter">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="playbook">Playbook</SelectItem>
            <SelectItem value="tracking">Tracking</SelectItem>
            <SelectItem value="communication">Communication</SelectItem>
            <SelectItem value="training">Training</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">
            All ({filteredDeliverables?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="documents" data-testid="tab-documents">
            Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="spreadsheets" data-testid="tab-spreadsheets">
            Spreadsheets ({spreadsheets.length})
          </TabsTrigger>
          <TabsTrigger value="presentations" data-testid="tab-presentations">
            Presentations ({presentations.length})
          </TabsTrigger>
          <TabsTrigger value="reports" data-testid="tab-reports">
            Reports ({reports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-12 w-12 rounded-lg mb-3" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredDeliverables && filteredDeliverables.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDeliverables.map((deliverable) => (
                <DeliverableCard
                  key={deliverable.id}
                  deliverable={deliverable}
                  onDownload={() => handleDownload(deliverable.fileUrl)}
                  onOpenSheet={() => handleOpenSheet(deliverable.sheetUrl)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No deliverables found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || typeFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start by adding your first deliverable"}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Deliverable
              </Button>
            </div>
          )}
        </TabsContent>

        {["documents", "spreadsheets", "presentations", "reports"].map((tab) => {
          const items =
            tab === "documents"
              ? documents
              : tab === "spreadsheets"
              ? spreadsheets
              : tab === "presentations"
              ? presentations
              : reports;

          return (
            <TabsContent key={tab} value={tab} className="mt-6">
              {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((deliverable) => (
                    <DeliverableCard
                      key={deliverable.id}
                      deliverable={deliverable}
                      onDownload={() => handleDownload(deliverable.fileUrl)}
                      onOpenSheet={() => handleOpenSheet(deliverable.sheetUrl)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-sm text-muted-foreground">
                    No {tab} found
                  </p>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
