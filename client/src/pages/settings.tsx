import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Bell,
  Link2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="p-6 space-y-6" data-testid="page-settings">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure dashboard preferences and integrations
        </p>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive updates about initiatives and issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="agent-alerts" className="font-medium">
                  Agent Status Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when agents start, stop, or encounter errors
                </p>
              </div>
              <Switch id="agent-alerts" defaultChecked data-testid="switch-agent-alerts" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="issue-alerts" className="font-medium">
                  Issue Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new issues and status changes
                </p>
              </div>
              <Switch id="issue-alerts" defaultChecked data-testid="switch-issue-alerts" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rollout-updates" className="font-medium">
                  Rollout Progress Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Weekly summary of franchise rollout progress
                </p>
              </div>
              <Switch id="rollout-updates" data-testid="switch-rollout-updates" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Shared Sheets Integration
            </CardTitle>
            <CardDescription>
              Connect to Google Sheets for centralized tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="master-tracker">Master Rollout Tracker URL</Label>
              <div className="flex gap-2">
                <Input
                  id="master-tracker"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="flex-1"
                  data-testid="input-master-tracker"
                />
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-sheet">Issue Tracking Sheet URL</Label>
              <div className="flex gap-2">
                <Input
                  id="issue-sheet"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="flex-1"
                  data-testid="input-issue-sheet"
                />
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button className="w-full" data-testid="button-save-sheets">
              Save Sheet Configuration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Data Sync
            </CardTitle>
            <CardDescription>
              Control how often data is refreshed from external sources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Auto-refresh Interval</Label>
                <p className="text-sm text-muted-foreground">
                  How often to poll for updates
                </p>
              </div>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                defaultValue="30"
                data-testid="select-refresh-interval"
              >
                <option value="15">Every 15 seconds</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every minute</option>
                <option value="300">Every 5 minutes</option>
                <option value="0">Manual only</option>
              </select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-sync" className="font-medium">
                  Background Sync
                </Label>
                <p className="text-sm text-muted-foreground">
                  Keep data updated even when tab is inactive
                </p>
              </div>
              <Switch id="auto-sync" defaultChecked data-testid="switch-auto-sync" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              8825 System Connection
            </CardTitle>
            <CardDescription>
              Configure connection to the 8825 brain transport system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brain-path">Brain Transport Path</Label>
              <Input
                id="brain-path"
                placeholder="/path/to/8825_BRAIN_TRANSPORT.json"
                defaultValue="~/Documents/8825_BRAIN_TRANSPORT.json"
                data-testid="input-brain-path"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="system-root">System Root</Label>
              <Input
                id="system-root"
                placeholder="/path/to/8825/8825-Jh"
                data-testid="input-system-root"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" data-testid="button-test-connection">
                Test Connection
              </Button>
              <Button className="flex-1" data-testid="button-sync-now">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
