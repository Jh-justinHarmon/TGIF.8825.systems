import {
  type User,
  type InsertUser,
  type Initiative,
  type InsertInitiative,
  type FranchiseGroup,
  type InsertFranchiseGroup,
  type Deliverable,
  type InsertDeliverable,
  type Issue,
  type InsertIssue,
  type DashboardStats,
  type AgentStatus,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getInitiatives(): Promise<Initiative[]>;
  getInitiative(id: string): Promise<Initiative | undefined>;
  createInitiative(initiative: InsertInitiative): Promise<Initiative>;
  updateInitiative(id: string, updates: Partial<Initiative>): Promise<Initiative | undefined>;
  deleteInitiative(id: string): Promise<boolean>;

  getFranchiseGroups(): Promise<FranchiseGroup[]>;
  getFranchiseGroup(id: string): Promise<FranchiseGroup | undefined>;
  createFranchiseGroup(group: InsertFranchiseGroup): Promise<FranchiseGroup>;
  updateFranchiseGroup(id: string, updates: Partial<FranchiseGroup>): Promise<FranchiseGroup | undefined>;
  deleteFranchiseGroup(id: string): Promise<boolean>;

  getDeliverables(): Promise<Deliverable[]>;
  getDeliverable(id: string): Promise<Deliverable | undefined>;
  createDeliverable(deliverable: InsertDeliverable): Promise<Deliverable>;
  updateDeliverable(id: string, updates: Partial<Deliverable>): Promise<Deliverable | undefined>;
  deleteDeliverable(id: string): Promise<boolean>;

  getIssues(): Promise<Issue[]>;
  getIssue(id: string): Promise<Issue | undefined>;
  createIssue(issue: InsertIssue): Promise<Issue>;
  updateIssue(id: string, updates: Partial<Issue>): Promise<Issue | undefined>;
  deleteIssue(id: string): Promise<boolean>;

  getStats(): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private initiatives: Map<string, Initiative>;
  private franchiseGroups: Map<string, FranchiseGroup>;
  private deliverables: Map<string, Deliverable>;
  private issues: Map<string, Issue>;

  constructor() {
    this.users = new Map();
    this.initiatives = new Map();
    this.franchiseGroups = new Map();
    this.deliverables = new Map();
    this.issues = new Map();

    this.seedData();
  }

  private seedData() {
    // Initiatives: Empty - no stub data
    const initiatives: InsertInitiative[] = [];

    initiatives.forEach((i) => {
      const id = randomUUID();
      const initiative: Initiative = {
        id,
        name: i.name,
        type: i.type,
        status: (i.status ?? "pending") as AgentStatus,
        description: i.description ?? null,
        category: i.category ?? null,
        purpose: i.purpose ?? null,
        pid: i.pid ?? null,
        lastUpdated: i.lastUpdated ?? null,
        scripts: i.scripts ?? null,
      };
      this.initiatives.set(id, initiative);
    });

    const franchiseGroups: InsertFranchiseGroup[] = [
      {
        name: "Sugarloaf",
        contactName: "Completed Pilot",
        contactEmail: "pilot@sugarloaf.com",
        contactPhone: "(555) 100-0001",
        locationCount: 1,
        status: "completed",
        progress: 100,
        accountingSystem: "QuickBooks",
        laborPayrollSystem: "ADP",
        notes: "First pilot location - completed 11/19/25",
      },
      {
        name: "American Pub",
        contactName: "Kishan Patel",
        contactEmail: "kishan@americanpub.us",
        contactPhone: "(909) 264-1550",
        locationCount: 2,
        status: "pending",
        progress: 0,
        accountingSystem: "InfoSync",
        laborPayrollSystem: "InfoSync",
        notes: null,
      },
      {
        name: "Jackmont Hospitality",
        contactName: "Daniel Halpern",
        contactEmail: "dhalpern@jackmont.com",
        contactPhone: "(404) 523-5744",
        locationCount: 21,
        status: "pending",
        progress: 5,
        accountingSystem: "Great Plains",
        laborPayrollSystem: null,
        notes: "Largest franchise group",
      },
      {
        name: "Maui One",
        contactName: "Anil Yadav",
        contactEmail: "anil@yadavgroup.net",
        contactPhone: "(510) 792-2628",
        locationCount: 28,
        status: "in_progress",
        progress: 15,
        accountingSystem: "Sage Intacct",
        laborPayrollSystem: null,
        notes: null,
      },
      {
        name: "Mera",
        contactName: "Rafael Aguirre",
        contactEmail: "rafaelat@meracorporation.com",
        contactPhone: "+52 (998) 845-6064",
        locationCount: 5,
        status: "pending",
        progress: 0,
        accountingSystem: "Sage Intacct",
        laborPayrollSystem: "UKG",
        notes: null,
      },
      {
        name: "Metz Culinary",
        contactName: "Jeff Metz",
        contactEmail: "jeffm@metzcorp.com",
        contactPhone: "(570) 674-8731",
        locationCount: 7,
        status: "pending",
        progress: 0,
        accountingSystem: "Business Central",
        laborPayrollSystem: null,
        notes: null,
      },
      {
        name: "United Restaurant Group",
        contactName: "Tony Grillo",
        contactEmail: "tgrillo@atlanticcoastdining.com",
        contactPhone: "(804) 747-5050",
        locationCount: 9,
        status: "pending",
        progress: 0,
        accountingSystem: "Sage 100 ERP",
        laborPayrollSystem: "Paycom",
        notes: null,
      },
      {
        name: "CFC Stripes",
        contactName: "Jill Cygan",
        contactEmail: "jcygan@cfcmgmt.com",
        contactPhone: "(216) 328-1121",
        locationCount: 2,
        status: "pending",
        progress: 0,
        accountingSystem: "Restaurant 365",
        laborPayrollSystem: "MinuteMen HR",
        notes: null,
      },
      {
        name: "Bridgeport Restaurant Group",
        contactName: "John Mosesso",
        contactEmail: "jmoerentals@frontier.com",
        contactPhone: "(304) 203-4172",
        locationCount: 1,
        status: "pending",
        progress: 0,
        accountingSystem: "InProcess Company",
        laborPayrollSystem: "InProcess Company",
        notes: null,
      },
      {
        name: "Cedar Fair",
        contactName: "TBD",
        contactEmail: null,
        contactPhone: null,
        locationCount: 1,
        status: "on_hold",
        progress: 0,
        accountingSystem: "J.D. Edwards",
        laborPayrollSystem: "Kronos / UKG",
        notes: "Contact to be verified",
      },
      {
        name: "Village XIII",
        contactName: "Dale Holt",
        contactEmail: "dholt44@sbcglobal.net",
        contactPhone: "(217) 356-5789",
        locationCount: 1,
        status: "pending",
        progress: 0,
        accountingSystem: "QuickBooks",
        laborPayrollSystem: "Custom Computing Inc",
        notes: null,
      },
      {
        name: "VNE",
        contactName: "Jeremy Gardner",
        contactEmail: "jgardnermail@gmail.com",
        contactPhone: "(501) 472-1000",
        locationCount: 2,
        status: "pending",
        progress: 0,
        accountingSystem: "QuickBooks",
        laborPayrollSystem: "Paychex PEO",
        notes: null,
      },
      {
        name: "RLJ Development",
        contactName: "Eric Rogers",
        contactEmail: "erogers@rljlodgingtrust.com",
        contactPhone: "(301) 280-7754",
        locationCount: 1,
        status: "pending",
        progress: 0,
        accountingSystem: null,
        laborPayrollSystem: "Kronos / UKG",
        notes: null,
      },
    ];

    franchiseGroups.forEach((fg) => {
      const id = randomUUID();
      const group: FranchiseGroup = {
        id,
        name: fg.name,
        status: fg.status ?? "pending",
        progress: fg.progress ?? 0,
        contactName: fg.contactName ?? null,
        contactEmail: fg.contactEmail ?? null,
        contactPhone: fg.contactPhone ?? null,
        locationCount: fg.locationCount ?? 0,
        accountingSystem: fg.accountingSystem ?? null,
        laborPayrollSystem: fg.laborPayrollSystem ?? null,
        notes: fg.notes ?? null,
      };
      this.franchiseGroups.set(id, group);
    });

    const deliverables: InsertDeliverable[] = [
      {
        title: "Franchise Rollout Playbook",
        description: "Complete guide for remaining franchisees including process, communication, and training kit",
        type: "document",
        category: "playbook",
        fileUrl: null,
        sheetUrl: "https://www.dropbox.com/scl/fi/i6oaz9wdpzpuqirmpkz19/LESSONS_LEARNED_SURVEY_DISTRIBUTION_LIST_GM_OPS.md?rlkey=jmdkkjwcztatn9hklcz1nn86c&dl=0",
        createdAt: "2025-12-04",
        updatedAt: "2025-12-31",
        status: "review",
      },
      {
        title: "Master Rollout Tracker",
        description: "Centralized tracking for all franchise groups with schedule, surveys, and milestones",
        type: "spreadsheet",
        category: "tracking",
        fileUrl: null,
        sheetUrl: "https://www.dropbox.com/scl/fi/6x1ss3wqg8hbynojjyaor/ONBOARDING_FORMAL_KICKOFF_MEETING_AGENDA.md?rlkey=iiofuhklmlngdkwe0gan678fp&dl=0",
        createdAt: "2025-11-01",
        updatedAt: "2025-12-31",
        status: "final",
      },
      {
        title: "Site Survey Hardware Tracking",
        description: "Track site surveys and hardware orders/installation for each location",
        type: "spreadsheet",
        category: "tracking",
        fileUrl: null,
        sheetUrl: "https://www.dropbox.com/scl/fi/f465a7ve7jtnwnaufg9kf/ROLLOUT_TRACKING_ENHANCED_RECOMMENDATIONS.md?rlkey=l42w77xjgiq1er75a9fw44t95&dl=0",
        createdAt: "2025-11-15",
        updatedAt: "2025-12-31",
        status: "final",
      },
      {
        title: "Issue Management Log",
        description: "Centralized issue tracking for all rollout-related problems",
        type: "spreadsheet",
        category: "tracking",
        fileUrl: null,
        sheetUrl: "https://docs.google.com/spreadsheets/d/example-issues",
        createdAt: "2025-11-20",
        updatedAt: "2025-12-18",
        status: "final",
      },
      {
        title: "Franchisee Communication Templates",
        description: "Email and meeting templates for franchisee onboarding and updates",
        type: "document",
        category: "communication",
        fileUrl: null,
        sheetUrl: null,
        createdAt: "2025-12-01",
        updatedAt: "2025-12-15",
        status: "draft",
      },
      {
        title: "CT/Toast Training Materials",
        description: "Training guides and resources for Crunchtime and Toast systems",
        type: "presentation",
        category: "training",
        fileUrl: null,
        sheetUrl: null,
        createdAt: "2025-11-25",
        updatedAt: "2025-12-10",
        status: "final",
      },
      {
        title: "Integration Assessment Matrix",
        description: "System integration needs and nuances for each franchise group",
        type: "spreadsheet",
        category: "tracking",
        fileUrl: null,
        sheetUrl: "https://docs.google.com/spreadsheets/d/example-integration",
        createdAt: "2025-12-05",
        updatedAt: "2025-12-16",
        status: "review",
      },
      {
        title: "Sugarloaf Lessons Learned",
        description: "Key learnings from the Sugarloaf pilot rollout",
        type: "report",
        category: "playbook",
        fileUrl: null,
        sheetUrl: null,
        createdAt: "2025-11-20",
        updatedAt: "2025-12-04",
        status: "final",
      },
    ];

    deliverables.forEach((d) => {
      const id = randomUUID();
      const deliverable: Deliverable = {
        id,
        title: d.title,
        type: d.type,
        status: d.status ?? "draft",
        description: d.description ?? null,
        category: d.category ?? null,
        fileUrl: d.fileUrl ?? null,
        sheetUrl: d.sheetUrl ?? null,
        createdAt: d.createdAt ?? null,
        updatedAt: d.updatedAt ?? null,
      };
      this.deliverables.set(id, deliverable);
    });

    // Issues: Empty - no stub data
    const issues: InsertIssue[] = [];

    issues.forEach((i) => {
      const id = randomUUID();
      const issue: Issue = {
        id,
        title: i.title,
        status: i.status ?? "open",
        priority: i.priority ?? "medium",
        description: i.description ?? null,
        createdAt: i.createdAt ?? null,
        resolvedAt: i.resolvedAt ?? null,
        assignee: i.assignee ?? null,
        franchiseGroupId: i.franchiseGroupId ?? null,
      };
      this.issues.set(id, issue);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getInitiatives(): Promise<Initiative[]> {
    return Array.from(this.initiatives.values());
  }

  async getInitiative(id: string): Promise<Initiative | undefined> {
    return this.initiatives.get(id);
  }

  async createInitiative(initiative: InsertInitiative): Promise<Initiative> {
    const id = randomUUID();
    const newInitiative: Initiative = {
      id,
      name: initiative.name,
      type: initiative.type,
      status: (initiative.status ?? "pending") as AgentStatus,
      description: initiative.description ?? null,
      category: initiative.category ?? null,
      purpose: initiative.purpose ?? null,
      pid: initiative.pid ?? null,
      lastUpdated: initiative.lastUpdated ?? null,
      scripts: initiative.scripts ?? null,
    };
    this.initiatives.set(id, newInitiative);
    return newInitiative;
  }

  async updateInitiative(id: string, updates: Partial<Initiative>): Promise<Initiative | undefined> {
    const existing = this.initiatives.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, id };
    this.initiatives.set(id, updated);
    return updated;
  }

  async deleteInitiative(id: string): Promise<boolean> {
    return this.initiatives.delete(id);
  }

  async getFranchiseGroups(): Promise<FranchiseGroup[]> {
    return Array.from(this.franchiseGroups.values());
  }

  async getFranchiseGroup(id: string): Promise<FranchiseGroup | undefined> {
    return this.franchiseGroups.get(id);
  }

  async createFranchiseGroup(group: InsertFranchiseGroup): Promise<FranchiseGroup> {
    const id = randomUUID();
    const newGroup: FranchiseGroup = {
      id,
      name: group.name,
      status: group.status ?? "pending",
      progress: group.progress ?? 0,
      contactName: group.contactName ?? null,
      contactEmail: group.contactEmail ?? null,
      contactPhone: group.contactPhone ?? null,
      locationCount: group.locationCount ?? 0,
      accountingSystem: group.accountingSystem ?? null,
      laborPayrollSystem: group.laborPayrollSystem ?? null,
      notes: group.notes ?? null,
    };
    this.franchiseGroups.set(id, newGroup);
    return newGroup;
  }

  async updateFranchiseGroup(id: string, updates: Partial<FranchiseGroup>): Promise<FranchiseGroup | undefined> {
    const existing = this.franchiseGroups.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, id };
    this.franchiseGroups.set(id, updated);
    return updated;
  }

  async deleteFranchiseGroup(id: string): Promise<boolean> {
    return this.franchiseGroups.delete(id);
  }

  async getDeliverables(): Promise<Deliverable[]> {
    return Array.from(this.deliverables.values());
  }

  async getDeliverable(id: string): Promise<Deliverable | undefined> {
    return this.deliverables.get(id);
  }

  async createDeliverable(deliverable: InsertDeliverable): Promise<Deliverable> {
    const id = randomUUID();
    const newDeliverable: Deliverable = {
      id,
      title: deliverable.title,
      type: deliverable.type,
      status: deliverable.status ?? "draft",
      description: deliverable.description ?? null,
      category: deliverable.category ?? null,
      fileUrl: deliverable.fileUrl ?? null,
      sheetUrl: deliverable.sheetUrl ?? null,
      createdAt: deliverable.createdAt ?? null,
      updatedAt: deliverable.updatedAt ?? null,
    };
    this.deliverables.set(id, newDeliverable);
    return newDeliverable;
  }

  async updateDeliverable(id: string, updates: Partial<Deliverable>): Promise<Deliverable | undefined> {
    const existing = this.deliverables.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, id };
    this.deliverables.set(id, updated);
    return updated;
  }

  async deleteDeliverable(id: string): Promise<boolean> {
    return this.deliverables.delete(id);
  }

  async getIssues(): Promise<Issue[]> {
    return Array.from(this.issues.values());
  }

  async getIssue(id: string): Promise<Issue | undefined> {
    return this.issues.get(id);
  }

  async createIssue(issue: InsertIssue): Promise<Issue> {
    const id = randomUUID();
    const newIssue: Issue = {
      id,
      title: issue.title,
      status: issue.status ?? "open",
      priority: issue.priority ?? "medium",
      description: issue.description ?? null,
      createdAt: issue.createdAt ?? null,
      resolvedAt: issue.resolvedAt ?? null,
      assignee: issue.assignee ?? null,
      franchiseGroupId: issue.franchiseGroupId ?? null,
    };
    this.issues.set(id, newIssue);
    return newIssue;
  }

  async updateIssue(id: string, updates: Partial<Issue>): Promise<Issue | undefined> {
    const existing = this.issues.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, id };
    this.issues.set(id, updated);
    return updated;
  }

  async deleteIssue(id: string): Promise<boolean> {
    return this.issues.delete(id);
  }

  async getStats(): Promise<DashboardStats> {
    const initiatives = await this.getInitiatives();
    const franchises = await this.getFranchiseGroups();
    const issues = await this.getIssues();
    const deliverables = await this.getDeliverables();

    return {
      totalInitiatives: initiatives.length,
      runningAgents: initiatives.filter((i) => i.status === "running").length,
      franchiseGroupsTotal: franchises.length,
      franchiseGroupsCompleted: franchises.filter((f) => f.status === "completed").length,
      openIssues: issues.filter((i) => i.status === "open" || i.status === "in_progress").length,
      deliverables: deliverables.length,
    };
  }
}

export const storage = new MemStorage();
