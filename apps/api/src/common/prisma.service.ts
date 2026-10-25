import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { InMemoryStore } from './in-memory-store';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public isConnected = false;
  public memoryStore = InMemoryStore.getInstance();
  private client: any = null;

  constructor() {
    try {
      const { PrismaClient } = require('@prisma/client');
      this.client = new PrismaClient({ log: ['error', 'warn'] });
    } catch (e: any) {
      this.logger.warn(`PrismaClient kutubxonasi generatsiya qilinmagan (${e.message}). Ichki xotira rejimi faollashdi.`);
    }
  }

  async onModuleInit() {
    if (this.client) {
      try {
        await this.client.$connect();
        this.isConnected = true;
        this.logger.log('✓ PostgreSQL ma’lumotlar bazasiga muvaffaqiyatli ulandi');
      } catch (err: any) {
        this.isConnected = false;
        this.logger.warn(`PostgreSQL ulanish ogohlantirishi: ${err.message}. Tizim InMemory rejimida ishlaydi.`);
      }
    }
  }

  async onModuleDestroy() {
    if (this.client && this.isConnected) {
      await this.client.$disconnect().catch(() => {});
    }
  }

  // Model accessors (PostgreSQL ga ulanish bor bo'lsa Prisma orqali, bo'lmasa xavfsiz InMemory orqali)
  get user(): any {
    if (this.isConnected && this.client) return this.client.user;
    return {
      findUnique: async ({ where }: any) => {
        if (where.username) {
          return this.memoryStore.users.find((u) => u.username.toLowerCase() === where.username.toLowerCase()) || null;
        }
        if (where.id) {
          return this.memoryStore.users.find((u) => u.id === where.id) || null;
        }
        return null;
      },
      findMany: async ({ where }: any = {}) => {
        if (where?.role) {
          return this.memoryStore.users.filter((u) => u.role === where.role);
        }
        return this.memoryStore.users;
      },
      count: async () => this.memoryStore.users.length,
      create: async ({ data }: any) => {
        const u = { id: `user-${Date.now()}`, ...data, createdAt: new Date(), updatedAt: new Date() };
        this.memoryStore.users.push(u);
        return u;
      },
      update: async ({ where, data }: any) => {
        const u = this.memoryStore.users.find((item) => item.id === where.id);
        if (u) Object.assign(u, data);
        return u;
      },
      updateMany: async () => ({ count: 1 }),
    };
  }

  get group(): any {
    if (this.isConnected && this.client) return this.client.group;
    return {
      findMany: async () => this.memoryStore.groups,
      findUnique: async ({ where }: any) => this.memoryStore.groups.find((g) => g.id === where.id) || null,
      count: async () => this.memoryStore.groups.length,
      create: async ({ data }: any) => {
        const g = { id: `grp-${Date.now()}`, ...data, createdAt: new Date(), updatedAt: new Date() };
        this.memoryStore.groups.push(g);
        return g;
      },
      update: async ({ where, data }: any) => {
        const g = this.memoryStore.groups.find((item) => item.id === where.id);
        if (g) Object.assign(g, data);
        return g;
      },
    };
  }

  get groupMember(): any {
    if (this.isConnected && this.client) return this.client.groupMember;
    return {
      findMany: async ({ where }: any = {}) => {
        if (where?.studentId) return this.memoryStore.groupMembers.filter((gm) => gm.studentId === where.studentId);
        return this.memoryStore.groupMembers;
      },
      findUnique: async () => ({ id: 'gm-ok' }),
      upsert: async () => ({ id: 'gm-upsert' }),
      deleteMany: async () => ({ count: 1 }),
    };
  }

  get problem(): any {
    if (this.isConnected && this.client) return this.client.problem;
    return {
      findMany: async () => this.memoryStore.problems,
      findUnique: async ({ where }: any) => this.memoryStore.problems.find((p) => p.id === where.id) || null,
      create: async ({ data }: any) => {
        const p = { id: `prob-${Date.now()}`, ...data, version: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() };
        this.memoryStore.problems.push(p);
        return p;
      },
      update: async ({ where, data }: any) => {
        const p = this.memoryStore.problems.find((item) => item.id === where.id);
        if (p) Object.assign(p, data);
        return p;
      },
    };
  }

  get testCase(): any {
    if (this.isConnected && this.client) return this.client.testCase;
    return {
      findMany: async ({ where }: any = {}) => {
        if (where?.problemId) return this.memoryStore.testCases.filter((tc) => tc.problemId === where.problemId);
        return this.memoryStore.testCases;
      },
      count: async () => this.memoryStore.testCases.length,
      create: async ({ data }: any) => {
        const tc = { id: `tc-${Date.now()}`, ...data };
        this.memoryStore.testCases.push(tc);
        return tc;
      },
      delete: async () => ({ id: 'deleted' }),
    };
  }

  get assignment(): any {
    if (this.isConnected && this.client) return this.client.assignment;
    return {
      findMany: async () => this.memoryStore.assignments,
      findUnique: async ({ where }: any) => this.memoryStore.assignments.find((a) => a.id === where.id) || null,
      count: async () => this.memoryStore.assignments.length,
      create: async ({ data }: any) => {
        const a = { id: `assign-${Date.now()}`, ...data, createdAt: new Date(), updatedAt: new Date() };
        this.memoryStore.assignments.push(a);
        return a;
      },
      update: async ({ where, data }: any) => {
        const a = this.memoryStore.assignments.find((item) => item.id === where.id);
        if (a) Object.assign(a, data);
        return a;
      },
    };
  }

  get studentProgress(): any {
    if (this.isConnected && this.client) return this.client.studentProgress;
    return {
      findUnique: async ({ where }: any) => {
        const target = where.assignmentId_problemId_studentId;
        if (!target) return null;
        return this.memoryStore.studentProgress.find(
          (sp) => sp.assignmentId === target.assignmentId && sp.problemId === target.problemId && sp.studentId === target.studentId,
        ) || null;
      },
      upsert: async ({ where, create, update }: any) => {
        const target = where.assignmentId_problemId_studentId;
        let existing = this.memoryStore.studentProgress.find(
          (sp) => sp.assignmentId === target.assignmentId && sp.problemId === target.problemId && sp.studentId === target.studentId,
        );
        if (existing) {
          Object.assign(existing, update);
          return existing;
        }
        const item = { id: `sp-${Date.now()}`, ...create, updatedAt: new Date() };
        this.memoryStore.studentProgress.push(item);
        return item;
      },
      findMany: async () => this.memoryStore.studentProgress,
    };
  }

  get submission(): any {
    if (this.isConnected && this.client) return this.client.submission;
    return {
      create: async ({ data }: any) => {
        const s = { id: `sub-${Date.now()}`, ...data, createdAt: new Date() };
        this.memoryStore.submissions.push(s);
        return s;
      },
      findMany: async () => this.memoryStore.submissions,
      findUnique: async ({ where }: any) => this.memoryStore.submissions.find((s) => s.id === where.id) || null,
    };
  }

  get aIInteraction(): any {
    if (this.isConnected && this.client) return this.client.aIInteraction;
    return {
      count: async () => this.memoryStore.aiInteractions.length,
      create: async ({ data }: any) => {
        const ai = { id: `ai-${Date.now()}`, ...data, createdAt: new Date() };
        this.memoryStore.aiInteractions.push(ai);
        return ai;
      },
    };
  }

  get session(): any {
    if (this.isConnected && this.client) return this.client.session;
    return {
      create: async ({ data }: any) => {
        const s = { id: `sess-${Date.now()}`, ...data, createdAt: new Date() };
        this.memoryStore.sessions.push(s);
        return s;
      },
      findFirst: async ({ where }: any) => this.memoryStore.sessions.find((s) => s.userId === where.userId && !s.revokedAt) || null,
      updateMany: async () => ({ count: 1 }),
    };
  }

  get auditLog(): any {
    if (this.isConnected && this.client) return this.client.auditLog;
    return {
      create: async () => ({ id: 'audit-ok' }),
    };
  }
}
