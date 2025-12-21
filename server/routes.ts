import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertInitiativeSchema,
  insertFranchiseGroupSchema,
  insertDeliverableSchema,
  insertIssueSchema,
} from "@shared/schema";
import { ZodError, z } from "zod";

function handleValidationError(error: unknown, res: any) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  throw error;
}

function createPatchSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required for update" }
  );
}

const updateInitiativeSchema = createPatchSchema(insertInitiativeSchema);
const updateFranchiseGroupSchema = createPatchSchema(insertFranchiseGroupSchema);
const updateDeliverableSchema = createPatchSchema(insertDeliverableSchema);
const updateIssueSchema = createPatchSchema(insertIssueSchema);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/stats", async (_req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  app.get("/api/initiatives", async (_req, res) => {
    const initiatives = await storage.getInitiatives();
    res.json(initiatives);
  });

  app.get("/api/initiatives/:id", async (req, res) => {
    const initiative = await storage.getInitiative(req.params.id);
    if (!initiative) {
      return res.status(404).json({ error: "Initiative not found" });
    }
    res.json(initiative);
  });

  app.post("/api/initiatives", async (req, res) => {
    try {
      const validated = insertInitiativeSchema.parse(req.body);
      const initiative = await storage.createInitiative(validated);
      res.status(201).json(initiative);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.patch("/api/initiatives/:id", async (req, res) => {
    try {
      const validated = updateInitiativeSchema.parse(req.body);
      const initiative = await storage.updateInitiative(req.params.id, validated);
      if (!initiative) {
        return res.status(404).json({ error: "Initiative not found" });
      }
      res.json(initiative);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.delete("/api/initiatives/:id", async (req, res) => {
    const deleted = await storage.deleteInitiative(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Initiative not found" });
    }
    res.status(204).send();
  });

  app.get("/api/franchise-groups", async (_req, res) => {
    const groups = await storage.getFranchiseGroups();
    res.json(groups);
  });

  app.get("/api/franchise-groups/:id", async (req, res) => {
    const group = await storage.getFranchiseGroup(req.params.id);
    if (!group) {
      return res.status(404).json({ error: "Franchise group not found" });
    }
    res.json(group);
  });

  app.post("/api/franchise-groups", async (req, res) => {
    try {
      const validated = insertFranchiseGroupSchema.parse(req.body);
      const group = await storage.createFranchiseGroup(validated);
      res.status(201).json(group);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.patch("/api/franchise-groups/:id", async (req, res) => {
    try {
      const validated = updateFranchiseGroupSchema.parse(req.body);
      const group = await storage.updateFranchiseGroup(req.params.id, validated);
      if (!group) {
        return res.status(404).json({ error: "Franchise group not found" });
      }
      res.json(group);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.delete("/api/franchise-groups/:id", async (req, res) => {
    const deleted = await storage.deleteFranchiseGroup(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Franchise group not found" });
    }
    res.status(204).send();
  });

  app.get("/api/deliverables", async (_req, res) => {
    const deliverables = await storage.getDeliverables();
    res.json(deliverables);
  });

  app.get("/api/deliverables/:id", async (req, res) => {
    const deliverable = await storage.getDeliverable(req.params.id);
    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found" });
    }
    res.json(deliverable);
  });

  app.post("/api/deliverables", async (req, res) => {
    try {
      const validated = insertDeliverableSchema.parse(req.body);
      const deliverable = await storage.createDeliverable(validated);
      res.status(201).json(deliverable);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.patch("/api/deliverables/:id", async (req, res) => {
    try {
      const validated = updateDeliverableSchema.parse(req.body);
      const deliverable = await storage.updateDeliverable(req.params.id, validated);
      if (!deliverable) {
        return res.status(404).json({ error: "Deliverable not found" });
      }
      res.json(deliverable);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.delete("/api/deliverables/:id", async (req, res) => {
    const deleted = await storage.deleteDeliverable(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Deliverable not found" });
    }
    res.status(204).send();
  });

  app.get("/api/issues", async (_req, res) => {
    const issues = await storage.getIssues();
    res.json(issues);
  });

  app.get("/api/issues/:id", async (req, res) => {
    const issue = await storage.getIssue(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json(issue);
  });

  app.post("/api/issues", async (req, res) => {
    try {
      const validated = insertIssueSchema.parse(req.body);
      const issue = await storage.createIssue(validated);
      res.status(201).json(issue);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.patch("/api/issues/:id", async (req, res) => {
    try {
      const validated = updateIssueSchema.parse(req.body);
      const issue = await storage.updateIssue(req.params.id, validated);
      if (!issue) {
        return res.status(404).json({ error: "Issue not found" });
      }
      res.json(issue);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.delete("/api/issues/:id", async (req, res) => {
    const deleted = await storage.deleteIssue(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.status(204).send();
  });

  return httpServer;
}
