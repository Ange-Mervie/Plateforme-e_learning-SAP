import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "apprenant" | "formateur" | "consultant" | "expert" | "admin";
  subscription_status: "free" | "active";
  created_at: string;
}

export interface SubscriptionRecord {
  id: number;
  user_id: number;
  status: string;
  plan_id?: string;
  created_at: string;
}

export interface ProgressRecord {
  id: number;
  user_id: number;
  course_slug: string;
  lesson_title: string;
  completed: number;
  updated_at: string;
}

export interface AssessmentRecord {
  id: number;
  user_id: number;
  course_slug: string;
  score: number;
  passed: number;
  created_at: string;
}

export interface ProjectRecord {
  id: number;
  user_id: number;
  course_slug: string;
  status: string;
  created_at: string;
}

export interface CertificateRecord {
  id: number;
  user_id: number;
  course_slug: string;
  issued_at: string;
}

interface LocalDatabase {
  users: UserRecord[];
  subscriptions: SubscriptionRecord[];
  progress: ProgressRecord[];
  assessments: AssessmentRecord[];
  projects: ProjectRecord[];
  certificates: CertificateRecord[];
}

const DB_FILE_PATH = path.join(process.cwd(), "src", "data", "local-database.json");

const DEFAULT_DEMO_HASH = bcrypt.hashSync("demo123", 10);
const DEFAULT_ADMIN_HASH = bcrypt.hashSync("admin123", 10);

const INITIAL_DATABASE: LocalDatabase = {
  users: [
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      password: DEFAULT_DEMO_HASH,
      role: "apprenant",
      subscription_status: "active",
      created_at: "2026-11-01T00:00:00.000Z",
    },
    {
      id: 2,
      name: "Administrateur IBN",
      email: "admin@ibngroup.com",
      password: DEFAULT_ADMIN_HASH,
      role: "admin",
      subscription_status: "active",
      created_at: "2026-11-01T00:00:00.000Z",
    },
  ],
  subscriptions: [
    {
      id: 1,
      user_id: 1,
      status: "active",
      plan_id: "pack-finance",
      created_at: "2026-11-01T00:00:00.000Z",
    },
  ],
  progress: [
    {
      id: 1,
      user_id: 1,
      course_slug: "fi-comptabilite-generale",
      lesson_title: "Principes de base",
      completed: 1,
      updated_at: "2026-11-01T00:00:00.000Z",
    },
  ],
  assessments: [
    {
      id: 1,
      user_id: 1,
      course_slug: "fi-comptabilite-generale",
      score: 85,
      passed: 1,
      created_at: "2026-11-02T00:00:00.000Z",
    },
  ],
  projects: [],
  certificates: [
    {
      id: 1,
      user_id: 1,
      course_slug: "fi-comptabilite-generale",
      issued_at: "2026-11-03T00:00:00.000Z",
    },
  ],
};

function readDb(): LocalDatabase {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      writeDb(INITIAL_DATABASE);
      return INITIAL_DATABASE;
    }
    const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
    return JSON.parse(raw) as LocalDatabase;
  } catch (err) {
    console.warn("[LocalDB] Error reading local-database.json, returning default:", err);
    return INITIAL_DATABASE;
  }
}

function writeDb(data: LocalDatabase): void {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[LocalDB] Error writing local-database.json:", err);
  }
}

// User Helpers
export function findUserByEmail(email: string): UserRecord | undefined {
  const db = readDb();
  return db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function findUserById(id: number): UserRecord | undefined {
  const db = readDb();
  return db.users.find((u) => u.id === id);
}

export function createUser(name: string, email: string, passwordHash: string): UserRecord {
  const db = readDb();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    throw new Error("USER_EXISTS");
  }
  const nextId = db.users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const newUser: UserRecord = {
    id: nextId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: passwordHash,
    role: "apprenant",
    subscription_status: "free",
    created_at: new Date().toISOString(),
  };
  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export function updateUserSubscription(userId: number, status: "free" | "active", planId?: string): void {
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (user) {
    user.subscription_status = status;
  }
  db.subscriptions.push({
    id: db.subscriptions.length + 1,
    user_id: userId,
    status,
    plan_id: planId,
    created_at: new Date().toISOString(),
  });
  writeDb(db);
}

// Progress Helpers
export function getProgressForUser(userId: number, courseSlug?: string): ProgressRecord[] {
  const db = readDb();
  let list = db.progress.filter((p) => p.user_id === userId);
  if (courseSlug) {
    list = list.filter((p) => p.course_slug === courseSlug);
  }
  return list;
}

export function saveProgress(userId: number, courseSlug: string, lessonTitle: string, completed: boolean): void {
  const db = readDb();
  const existing = db.progress.find(
    (p) => p.user_id === userId && p.course_slug === courseSlug && p.lesson_title === lessonTitle
  );
  if (existing) {
    existing.completed = completed ? 1 : 0;
    existing.updated_at = new Date().toISOString();
  } else {
    db.progress.push({
      id: db.progress.length + 1,
      user_id: userId,
      course_slug: courseSlug,
      lesson_title: lessonTitle,
      completed: completed ? 1 : 0,
      updated_at: new Date().toISOString(),
    });
  }
  writeDb(db);
}

// Assessment Helpers
export function getAssessmentsForUser(userId: number): AssessmentRecord[] {
  const db = readDb();
  return db.assessments.filter((a) => a.user_id === userId);
}

export function saveAssessment(userId: number, courseSlug: string, score: number, passed: number): AssessmentRecord {
  const db = readDb();
  const newAssessment: AssessmentRecord = {
    id: db.assessments.length + 1,
    user_id: userId,
    course_slug: courseSlug,
    score,
    passed,
    created_at: new Date().toISOString(),
  };
  db.assessments.push(newAssessment);
  writeDb(db);
  return newAssessment;
}

// Project Helpers
export function getProjectsForUser(userId: number): ProjectRecord[] {
  const db = readDb();
  return db.projects.filter((p) => p.user_id === userId);
}

export function saveProject(userId: number, courseSlug: string): ProjectRecord {
  const db = readDb();
  const newProj: ProjectRecord = {
    id: db.projects.length + 1,
    user_id: userId,
    course_slug: courseSlug,
    status: "submitted",
    created_at: new Date().toISOString(),
  };
  db.projects.push(newProj);
  writeDb(db);
  return newProj;
}

// Certificate Helpers
export function getCertificatesForUser(userId: number): CertificateRecord[] {
  const db = readDb();
  return db.certificates.filter((c) => c.user_id === userId);
}

export function saveCertificate(userId: number, courseSlug: string): CertificateRecord {
  const db = readDb();
  const newCert: CertificateRecord = {
    id: db.certificates.length + 1,
    user_id: userId,
    course_slug: courseSlug,
    issued_at: new Date().toISOString(),
  };
  db.certificates.push(newCert);
  writeDb(db);
  return newCert;
}
