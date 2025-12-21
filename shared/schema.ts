import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Agent status types
export type AgentStatus = "running" | "loaded" | "error" | "pending" | "stopped";

// Initiative/Agent schema
export const initiatives = pgTable("initiatives", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").$type<AgentStatus>().notNull().default("pending"),
  type: text("type").notNull(), // "agent" | "workflow" | "integration"
  category: text("category"), // e.g., "google", "goose", "dropbox"
  purpose: text("purpose"),
  pid: text("pid"),
  lastUpdated: text("last_updated"),
  scripts: text("scripts").array(),
});

export const insertInitiativeSchema = createInsertSchema(initiatives).omit({ id: true });
export type InsertInitiative = z.infer<typeof insertInitiativeSchema>;
export type Initiative = typeof initiatives.$inferSelect;

// Franchise Group schema
export const franchiseGroups = pgTable("franchise_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  locationCount: integer("location_count").default(0),
  status: text("status").notNull().default("pending"), // "pending" | "in_progress" | "completed" | "on_hold"
  progress: integer("progress").default(0), // 0-100
  accountingSystem: text("accounting_system"),
  laborPayrollSystem: text("labor_payroll_system"),
  notes: text("notes"),
});

export const insertFranchiseGroupSchema = createInsertSchema(franchiseGroups).omit({ id: true });
export type InsertFranchiseGroup = z.infer<typeof insertFranchiseGroupSchema>;
export type FranchiseGroup = typeof franchiseGroups.$inferSelect;

// Deliverable schema
export const deliverables = pgTable("deliverables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "document" | "spreadsheet" | "presentation" | "report" | "other"
  category: text("category"), // "playbook" | "tracking" | "communication" | "training"
  fileUrl: text("file_url"),
  sheetUrl: text("sheet_url"), // for shared sheets
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
  status: text("status").default("draft"), // "draft" | "review" | "final"
});

export const insertDeliverableSchema = createInsertSchema(deliverables).omit({ id: true });
export type InsertDeliverable = z.infer<typeof insertDeliverableSchema>;
export type Deliverable = typeof deliverables.$inferSelect;

// Issue/Task schema
export const issues = pgTable("issues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"), // "low" | "medium" | "high" | "critical"
  status: text("status").notNull().default("open"), // "open" | "in_progress" | "resolved" | "closed"
  assignee: text("assignee"),
  franchiseGroupId: varchar("franchise_group_id"),
  createdAt: text("created_at"),
  resolvedAt: text("resolved_at"),
});

export const insertIssueSchema = createInsertSchema(issues).omit({ id: true });
export type InsertIssue = z.infer<typeof insertIssueSchema>;
export type Issue = typeof issues.$inferSelect;

// Dashboard Stats type (not a table, computed)
export type DashboardStats = {
  totalInitiatives: number;
  runningAgents: number;
  franchiseGroupsTotal: number;
  franchiseGroupsCompleted: number;
  openIssues: number;
  deliverables: number;
};
