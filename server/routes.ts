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

// For alpha users: connect to unified Maestra backend (JH-Brain integration)
// For production: would use TGIF-specific brain or org-level brain
const BRAIN_URL = process.env.BRAIN_URL || "http://127.0.0.1:8000";

async function fetchJsonWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 1500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });
    const text = await res.text();
    const body = text ? JSON.parse(text) : null;
    return { ok: res.ok, status: res.status, body };
  } finally {
    clearTimeout(timeout);
  }
}

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
  
  app.get("/api/brain/health", async (_req, res) => {
    try {
      const result = await fetchJsonWithTimeout(`${BRAIN_URL}/health`, { method: "GET" }, 1000);
      if (!result.ok) {
        return res.status(503).json({ ok: false, upstream: BRAIN_URL, status: result.status, body: result.body });
      }
      return res.json({ ok: true, upstream: BRAIN_URL, body: result.body });
    } catch (error: any) {
      return res.status(503).json({ ok: false, upstream: BRAIN_URL, error: error?.message || String(error) });
    }
  });

  app.post("/api/brain/query", async (req, res) => {
    const need = typeof req.body?.need === "string" ? req.body.need : "";
    const sessionId = typeof req.body?.session_id === "string" ? req.body.session_id : "tgif-default";
    const image = typeof req.body?.image === "string" ? req.body.image : undefined;
    
    if (!need && !image) {
      return res.status(400).json({ error: "need or image is required" });
    }

    try {
      // Gather TGIF context to send with the request
      const stats = await storage.getStats();
      const initiatives = await storage.getInitiatives();
      const franchiseGroups = await storage.getFranchiseGroups();
      const deliverables = await storage.getDeliverables();
      
      // Build rich client context in Maestra backend format
      // The backend expects: summary, page_snapshot, selection, relevant
      const tgifSummary = `TGIF Phase 2 Franchisee Playbook Dashboard

Current Status:
- Total Initiatives: ${stats.totalInitiatives} (${stats.runningAgents} running)
- Franchise Groups: ${stats.franchiseGroupsTotal} total, ${stats.franchiseGroupsCompleted} completed
- Deliverables: ${stats.deliverables}
- Open Issues: ${stats.openIssues}

Recent Initiatives:
${initiatives.slice(0, 3).map(i => `- ${i.name} (${i.type}, ${i.status}): ${i.description || 'No description'}`).join('\n')}

Franchise Groups:
${franchiseGroups.slice(0, 3).map(g => `- ${g.name}: ${g.status}, ${g.progress || 0}% progress`).join('\n')}

Key Deliverables:
${deliverables.slice(0, 3).map(d => `- ${d.title} (${d.type}): ${d.status}`).join('\n')}

This is a project management hub for tracking TGIF restaurant system rollout to franchisee groups.`;

      const clientContext: any = {
        summary: tgifSummary,
        page_snapshot: {
          url: `https://tgif-8825-systems.fly.dev`,
          title: "TGIF Control - 8825 Dashboard",
          domain: "tgif-8825-systems.fly.dev",
          timestamp: new Date().toISOString(),
        },
        relevant: [
          ...initiatives.slice(0, 2).map(i => ({ type: "initiative", name: i.name, status: i.status })),
          ...franchiseGroups.slice(0, 2).map(g => ({ type: "franchise_group", name: g.name, status: g.status })),
          ...deliverables.slice(0, 2).map(d => ({ type: "deliverable", title: d.title, status: d.status })),
        ],
      };

      // Add image if provided
      if (image) {
        clientContext.page_snapshot.image = image;
      }

      // Call Maestra backend's advisor endpoint for unified brain access
      const result = await fetchJsonWithTimeout(
        `${BRAIN_URL}/api/maestra/advisor/ask`,
        {
          method: "POST",
          body: JSON.stringify({
            session_id: sessionId,
            user_id: "alpha_jh",
            message: need,
            mode: "quick",
            context_hints: ["tgif", "franchise_rollout", "phase_2_playbook", "gm_ops"],
            client_context: clientContext,
          }),
        },
        15000, // Longer timeout for LLM calls
      );
      
      if (result.ok && result.body) {
        // Transform Maestra response to simple format for chat sidebar
        return res.json({
          response: result.body.answer || result.body.response || "No response",
          session_id: result.body.session_id || sessionId,
          sources: result.body.sources || [],
        });
      }
      
      return res.status(result.status).json(result.body);
    } catch (error: any) {
      return res.status(503).json({ error: "brain_unavailable", upstream: BRAIN_URL, detail: error?.message || String(error) });
    }
  });

  app.post("/api/brain/log_use", async (req, res) => {
    try {
      const result = await fetchJsonWithTimeout(
        `${BRAIN_URL}/log_use`,
        {
          method: "POST",
          body: JSON.stringify(req.body || {}),
        },
        1500,
      );
      return res.status(result.status).json(result.body);
    } catch (error: any) {
      return res.status(503).json({ error: "brain_unavailable", upstream: BRAIN_URL, detail: error?.message || String(error) });
    }
  });

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
      const initiative = await storage.updateInitiative(req.params.id, validated as any);
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
      const group = await storage.updateFranchiseGroup(req.params.id, validated as any);
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
      const deliverable = await storage.updateDeliverable(req.params.id, validated as any);
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
      const issue = await storage.updateIssue(req.params.id, validated as any);
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
