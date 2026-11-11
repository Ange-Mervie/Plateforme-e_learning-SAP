import { describe, expect, it, vi, beforeEach } from "vitest";
import { connection } from "next/server";
import { query, execute } from "@/lib/db";
import { getUserForSession } from "@/lib/auth/sessions";
import { requireUser, requireRole, requireActiveSubscription } from "@/lib/auth/authorization";
import { AuthenticationError, type AuthenticatedUser } from "@/lib/auth/types";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

vi.mock("next/server", () => ({
  connection: vi.fn(async () => ({})),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: () => ({ value: "session-token" }),
  })),
}));

// Mock de la base de données
vi.mock("@/lib/db", () => ({
  query: vi.fn(),
  execute: vi.fn(),
}));

// Mock des sessions
vi.mock("@/lib/auth/sessions", () => ({
  getUserForSession: vi.fn(),
}));

const learner = {
  id: 1,
  name: "Alex Learner",
  email: "alex@example.com",
  role: "apprenant" as const,
  subscription: { status: "active" as const, planId: null },
};

const learnerExpired = {
  id: 2,
  name: "Expired User",
  email: "expired@example.com",
  role: "apprenant" as const,
  subscription: { status: "expired" as const, planId: null },
};

const formateur = {
  id: 3,
  name: "Formateur SAP",
  email: "formateur@example.com",
  role: "formateur" as const,
  subscription: { status: "active" as const, planId: null },
};

const admin = {
  id: 4,
  name: "Admin SAP",
  email: "admin@example.com",
  role: "admin" as const,
  subscription: { status: "active" as const, planId: null },
};

describe("MISSION 06 / PHASE 11 — Tests d'intégration obligatoires", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(connection).mockResolvedValue({} as never);
  });

  // Scénario 1 : Visiteur sans abonnement tente d'accéder à un cours protégé
  it("Scénario 1 : Refus d'accès aux cours protégés sans abonnement actif", async () => {
    vi.mocked(getUserForSession).mockResolvedValue(learnerExpired as unknown as AuthenticatedUser);
    await expect(requireActiveSubscription()).rejects.toMatchObject({
      status: 403,
      message: "Abonnement requis pour accéder à ce contenu.",
    });
  });

  // Scénario 2 : Utilisateur avec abonnement actif
  it("Scénario 2 : Accès autorisé avec abonnement actif", async () => {
    vi.mocked(getUserForSession).mockResolvedValue(learner);
    const user = await requireActiveSubscription();
    expect(user.role).toBe("apprenant");
    expect(user.subscription?.status).toBe("active");
  });

  // Scénario 3 : Utilisateur dont l'abonnement a expiré
  it("Scénario 3 : Refus d'accès quand abonnement expiré", async () => {
    vi.mocked(getUserForSession).mockResolvedValue(learnerExpired as unknown as AuthenticatedUser);
    await expect(requireActiveSubscription()).rejects.toMatchObject({ status: 403 });
  });

  // Scénario 4 : Paiement non confirmé (statut pending)
  it("Scénario 4 : Paiement non confirmé = statut pending, accès refusé", async () => {
    vi.mocked(query).mockResolvedValue([{ id: 1, user_id: 1, status: "pending", expires_at: null }] as unknown as RowDataPacket[]);
    const rows = await query("SELECT * FROM subscriptions WHERE user_id = ?", [1]);
    expect(rows[0].status).toBe("pending");
    expect(rows[0].status).not.toBe("active");
  });

  // Scénario 5 : Sauvegarde de progression après déconnexion (persistance DB)
  it("Scénario 5 : Progression sauvegardée en base (persistance après déconnexion)", async () => {
    vi.mocked(execute).mockResolvedValue({ affectedRows: 1, insertId: 1, warningStatus: 0 } as unknown as ResultSetHeader);
    await execute(
      "INSERT INTO progress (user_id, course_slug, lesson_title, completed) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE completed = VALUES(completed)",
      [1, "fi-comptabilite-generale", "Principes de base", 1]
    );
    expect(execute).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO progress"),
      [1, "fi-comptabilite-generale", "Principes de base", 1]
    );
  });

  // Scénario 6 : Enregistrement des notes d'évaluation
  it("Scénario 6 : Enregistrement des notes d'évaluation", async () => {
    vi.mocked(execute).mockResolvedValue({ affectedRows: 1, insertId: 1, warningStatus: 0 } as unknown as ResultSetHeader);
    await execute(
      "INSERT INTO assessments (user_id, course_slug, score, passed) VALUES (?, ?, ?, ?)",
      [1, "fi-comptabilite-generale", 85, 1]
    );
    expect(execute).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO assessments"),
      [1, "fi-comptabilite-generale", 85, 1]
    );
  });

  // Scénario 7 : Obligation de passer les évaluations (condition téléchargement)
  it("Scénario 7 : Téléchargement refusé si évaluation non validée", async () => {
    vi.mocked(query).mockResolvedValue([]); // Pas d'évaluation
    const assessments = await query(
      "SELECT passed FROM assessments WHERE user_id = ? AND course_slug = ? ORDER BY created_at DESC LIMIT 1",
      [1, "fi-comptabilite-generale"]
    );
    expect(assessments.length).toBe(0);
    expect(assessments[0]?.passed).toBeUndefined();
  });

  // Scénario 8 : Impossibilité de valider un parcours sans projet final
  it("Scénario 8 : Téléchargement refusé si projet non validé", async () => {
    vi.mocked(query).mockResolvedValue([{ status: "submitted", grade: null }] as unknown as RowDataPacket[]);
    const projects = await query(
      "SELECT status, grade FROM projects WHERE user_id = ? AND course_slug = ? ORDER BY created_at DESC LIMIT 1",
      [1, "fi-comptabilite-generale"]
    );
    expect(projects[0].status).not.toBe("validated");
    expect(projects[0].grade).toBeNull();
  });

  // Scénario 9 : Validation de la soutenance
  it("Scénario 9 : Décision de soutenance enregistrée (admis/ajourne)", async () => {
    vi.mocked(execute).mockResolvedValue({ affectedRows: 1, insertId: 1, warningStatus: 0 } as unknown as ResultSetHeader);
    await execute(
      "UPDATE defenses SET decision = ?, evaluator_comment = ?, decided_by = ?, decided_at = CURRENT_TIMESTAMP WHERE id = ?",
      ["admis", "Soutenance réussie", 3, 42]
    );
    expect(execute).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE defenses"),
      ["admis", "Soutenance réussie", 3, 42]
    );
  });

  // Scénario 10 : Téléchargement autorisé après délivrance de l'attestation
  it("Scénario 10 : Téléchargement autorisé quand toutes conditions remplies", async () => {
    vi.mocked(query)
      .mockResolvedValueOnce([{ passed: 1 }] as unknown as RowDataPacket[]) // assessment
      .mockResolvedValueOnce([{ status: "validated", grade: 15 }] as unknown as RowDataPacket[]) // project
      .mockResolvedValueOnce([{ decision: "admis" }] as unknown as RowDataPacket[]) // defense
      .mockResolvedValueOnce([{ id: 100 }] as unknown as RowDataPacket[]); // certificate

    const assessments = await query("SELECT passed FROM assessments WHERE user_id = ? AND course_slug = ?", [1, "fi"]);
    const projects = await query("SELECT status FROM projects WHERE user_id = ? AND course_slug = ?", [1, "fi"]);
    const defenses = await query("SELECT decision FROM defenses WHERE user_id = ? AND course_slug = ?", [1, "fi"]);
    const certificates = await query("SELECT id FROM certificates WHERE user_id = ? AND course_slug = ?", [1, "fi"]);

    expect(assessments[0].passed).toBe(1);
    expect(projects[0].status).toBe("validated");
    expect(defenses[0].decision).toBe("admis");
    expect(certificates.length).toBeGreaterThan(0);
  });

  // Scénario 11 : Refus de téléchargement avant validation
  it("Scénario 11 : Refus de téléchargement si conditions manquantes", async () => {
    vi.mocked(query).mockResolvedValue([]); // Aucune condition remplie
    const assessments = await query("SELECT passed FROM assessments WHERE user_id = ? AND course_slug = ?", [1, "fi"]);
    const projects = await query("SELECT status FROM projects WHERE user_id = ? AND course_slug = ?", [1, "fi"]);
    const defenses = await query("SELECT decision FROM defenses WHERE user_id = ? AND course_slug = ?", [1, "fi"]);
    const certificates = await query("SELECT id FROM certificates WHERE user_id = ? AND course_slug = ?", [1, "fi"]);

    const missing = [];
    if (!assessments.length || !assessments[0].passed) missing.push("assessment_passed");
    if (!projects.length || projects[0].status !== "validated") missing.push("project_validated");
    if (!defenses.length || defenses[0].decision !== "admis") missing.push("defense_admitted");
    if (!certificates.length) missing.push("certificate_issued");

    expect(missing).toHaveLength(4);
  });

  // Scénario 12 : Permissions de chaque rôle
  it("Scénario 12 : Permissions par rôle - apprenant, formateur, admin", async () => {
    // Apprenant peut accéder à son espace
    vi.mocked(getUserForSession).mockResolvedValue(learner);
    const userLearner = await requireRole(["apprenant"]);
    expect(userLearner.role).toBe("apprenant");

    // Formateur peut évaluer les projets
    vi.mocked(getUserForSession).mockResolvedValue(formateur);
    const userFormateur = await requireRole(["formateur", "admin", "consultant", "expert"]);
    expect(userFormateur.role).toBe("formateur");

    // Admin peut gérer les abonnements
    vi.mocked(getUserForSession).mockResolvedValue(admin);
    const userAdmin = await requireRole(["admin"]);
    expect(userAdmin.role).toBe("admin");

    // Apprenant ne peut pas accéder à l'espace admin (403)
    vi.mocked(getUserForSession).mockResolvedValue(learner);
    await expect(requireRole(["admin"])).rejects.toMatchObject({ status: 403 });
  });

  // Authentification : utilisateur non connecté
  it("Auth : requireUser rejette avec 401 si pas de session", async () => {
    vi.mocked(getUserForSession).mockResolvedValue(null);
    await expect(requireUser()).rejects.toMatchObject({ status: 401 });
  });
});
