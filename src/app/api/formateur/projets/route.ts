import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { query } from "@/lib/db";
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
    `SELECT p.id, p.user_id, p.course_slug, p.status, p.grade, p.comments, p.created_at,
            u.name AS user_name, u.email AS user_email
     FROM projects p
     JOIN users u ON u.id = p.user_id
     ORDER BY p.created_at DESC`
  );
  return NextResponse.json({ rows });
}
