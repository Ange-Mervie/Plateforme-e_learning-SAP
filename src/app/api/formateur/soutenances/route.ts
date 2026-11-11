import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { execute, query } from "@/lib/db";
import { getUserForSession } from "@/lib/auth/sessions";

export async function GET() {
  await connection();
  const token = (await cookies()).get("sap_academy_session")?.value;
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const user = await getUserForSession(token);
  if (!user || !["formateur", "admin", "consultant", "expert"].includes(user.role)) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }

  const rows = await query(
    `SELECT d.id, d.project_id, d.user_id, d.course_slug, d.scheduled_at, d.decision,
            d.evaluator_comment, d.decided_by, d.decided_at, d.created_at,
            u.name AS user_name, u.email AS user_email,
            p.grade AS project_grade, p.comments AS project_comments
     FROM defenses d
     JOIN users u ON u.id = d.user_id
     JOIN projects p ON p.id = d.project_id
     ORDER BY d.created_at DESC`
  );
  return NextResponse.json({ rows });
}

export async function POST(req: Request) {
  await connection();
  const token = (await cookies()).get("sap_academy_session")?.value;
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const user = await getUserForSession(token);
  if (!user) return NextResponse.json({ error: "Interdit" }, { status: 403 });

  const { projectId, courseSlug, scheduledAt } = await req.json();
  if (!projectId || !courseSlug) {
    return NextResponse.json({ error: "Projet et cours requis" }, { status: 400 });
  }

  const result = await execute(
    "INSERT INTO defenses (project_id, user_id, course_slug, scheduled_at, decision) VALUES (?, ?, ?, ?, 'pending')",
    [Number(projectId), user.id, courseSlug, scheduledAt || null]
  );
  return NextResponse.json({ ok: true, defenseId: result.insertId });
}
