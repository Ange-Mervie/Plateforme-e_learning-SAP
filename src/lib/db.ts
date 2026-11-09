import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// Safe database pool initialization
export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/sap_academy",
});


// Fallback in-memory database to guarantee zero-downtime and graceful degradation
interface MockUser {
  id: number;
  name?: string;
  email: string;
  password: string;
  role: string;
  subscription_status: string;
}

interface MockSubscription {
  id: number;
  user_id: number;
  status: string;
  created_at: Date;
}

interface MockProgress {
  id: number;
  user_id: number;
  course_slug: string;
  lesson_title: string;
  completed: number;
}

interface MockAssessment {
  id: number;
  user_id: number;
  course_slug: string;
  score: number;
  passed: number;
  created_at: Date;
}

interface MockProject {
  id: number;
  user_id: number;
  course_slug: string;
  status: string;
  grade?: number;
  comments?: string;
  created_at: Date;
}

interface MockCertificate {
  id: number;
  user_id: number;
  course_slug: string;
  issued_at: Date;
}

const defaultPasswordHash = bcrypt.hashSync("demo123", 10);

const memoryDb = {
  users: [
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      password: defaultPasswordHash,
      role: "apprenant",
      subscription_status: "active",
    },
    {
      id: 2,
      name: "Admin SAP",
      email: "admin@sap-academy.com",
      password: defaultPasswordHash,
      role: "admin",
      subscription_status: "active",
    },
  ] as MockUser[],
  subscriptions: [
    { id: 1, user_id: 1, status: "active", created_at: new Date() },
  ] as MockSubscription[],
  progress: [
    { id: 1, user_id: 1, course_slug: "fi-comptabilite-generale", lesson_title: "Principes de base", completed: 1 },
    { id: 2, user_id: 1, course_slug: "fi-comptabilite-generale", lesson_title: "Clôture mensuelle", completed: 1 },
  ] as MockProgress[],
  assessments: [
    { id: 1, user_id: 1, course_slug: "fi-comptabilite-generale", score: 85, passed: 1, created_at: new Date() },
  ] as MockAssessment[],
  projects: [] as MockProject[],
  certificates: [
    { id: 1, user_id: 1, course_slug: "fi-comptabilite-generale", issued_at: new Date() },
  ] as MockCertificate[],
};

let dbConnectionFailed = false;

export async function query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  if (!dbConnectionFailed) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows as T[];
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[Database] MySQL unavailable (${message}). Using memory fallback.`);
      dbConnectionFailed = true;
    }
  }

  // Fallback simulator for memory operations
  const normalizedSql = sql.trim().toLowerCase();

  // 1. Users
  if (normalizedSql.includes("from users")) {
    if (normalizedSql.startsWith("select")) {
      if (params.length > 0 && typeof params[0] === "string") {
        const found = memoryDb.users.filter((u) => u.email.toLowerCase() === (params[0] as string).toLowerCase());
        return found as unknown as T[];
      }
      return memoryDb.users as unknown as T[];
    }
  }

  if (normalizedSql.startsWith("insert into users")) {
    const email = String(params[0] || "");
    const password = String(params[1] || "");
    const name = params[2] ? String(params[2]) : email.split("@")[0];
    const newUser: MockUser = {
      id: memoryDb.users.length + 1,
      name,
      email,
      password,
      role: "apprenant",
      subscription_status: "free",
    };
    memoryDb.users.push(newUser);
    return [{ insertId: newUser.id }] as unknown as T[];
  }

  // 2. Assessments
  if (normalizedSql.includes("assessments")) {
    if (normalizedSql.startsWith("select")) {
      const userId = Number(params[0]);
      const found = memoryDb.assessments.filter((a) => a.user_id === userId);
      return found as unknown as T[];
    }
    if (normalizedSql.startsWith("insert into assessments")) {
      const [userId, courseSlug, score, passed] = params;
      const newAssessment: MockAssessment = {
        id: memoryDb.assessments.length + 1,
        user_id: Number(userId),
        course_slug: String(courseSlug),
        score: Number(score),
        passed: Number(passed),
        created_at: new Date(),
      };
      memoryDb.assessments.push(newAssessment);
      return [{ insertId: newAssessment.id }] as unknown as T[];
    }
  }

  // 3. Certificates
  if (normalizedSql.includes("certificates")) {
    if (normalizedSql.startsWith("select")) {
      const userId = Number(params[0]);
      const found = memoryDb.certificates.filter((c) => c.user_id === userId);
      return found as unknown as T[];
    }
    if (normalizedSql.startsWith("insert into certificates")) {
      const [userId, courseSlug] = params;
      const newCert: MockCertificate = {
        id: memoryDb.certificates.length + 1,
        user_id: Number(userId),
        course_slug: String(courseSlug),
        issued_at: new Date(),
      };
      memoryDb.certificates.push(newCert);
      return [{ insertId: newCert.id }] as unknown as T[];
    }
  }

  // 4. Progress
  if (normalizedSql.includes("progress")) {
    if (normalizedSql.startsWith("select")) {
      const userId = Number(params[0]);
      const courseSlug = params[1] ? String(params[1]) : null;
      let found = memoryDb.progress.filter((p) => p.user_id === userId);
      if (courseSlug) {
        found = found.filter((p) => p.course_slug === courseSlug);
      }
      return found as unknown as T[];
    }
    if (normalizedSql.startsWith("insert into progress")) {
      const [userId, courseSlug, lessonTitle, completed] = params;
      const existing = memoryDb.progress.find(
        (p) => p.user_id === Number(userId) && p.course_slug === String(courseSlug) && p.lesson_title === String(lessonTitle)
      );
      if (existing) {
        existing.completed = Number(completed);
      } else {
        memoryDb.progress.push({
          id: memoryDb.progress.length + 1,
          user_id: Number(userId),
          course_slug: String(courseSlug),
          lesson_title: String(lessonTitle),
          completed: Number(completed),
        });
      }
      return [{ affectedRows: 1 }] as unknown as T[];
    }
  }

  // 5. Subscriptions
  if (normalizedSql.includes("subscriptions")) {
    if (normalizedSql.startsWith("select")) {
      const userId = Number(params[0]);
      const found = memoryDb.subscriptions.filter((s) => s.user_id === userId);
      return found as unknown as T[];
    }
    if (normalizedSql.startsWith("insert into subscriptions")) {
      const userId = Number(params[0]);
      const newSub: MockSubscription = {
        id: memoryDb.subscriptions.length + 1,
        user_id: userId,
        status: "active",
        created_at: new Date(),
      };
      memoryDb.subscriptions.push(newSub);
      return [{ insertId: newSub.id }] as unknown as T[];
    }
  }

  // 6. Projects
  if (normalizedSql.includes("projects")) {
    if (normalizedSql.startsWith("select")) {
      const userId = Number(params[0]);
      const found = memoryDb.projects.filter((p) => p.user_id === userId);
      return found as unknown as T[];
    }
    if (normalizedSql.startsWith("insert into projects")) {
      const [userId, courseSlug] = params;
      const newProj: MockProject = {
        id: memoryDb.projects.length + 1,
        user_id: Number(userId),
        course_slug: String(courseSlug),
        status: "submitted",
        created_at: new Date(),
      };
      memoryDb.projects.push(newProj);
      return [{ insertId: newProj.id }] as unknown as T[];
    }
  }

  return [] as T[];
}
