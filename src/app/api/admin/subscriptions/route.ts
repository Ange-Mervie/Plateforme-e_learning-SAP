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
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Interdit" }, { status: 403 });

  const rows = await query<any>(
    `SELECT s.id, s.user_id, s.status, s.expires_at, s.created_at, u.email, u.name
     FROM subscriptions s
     JOIN users u ON u.id = s.user_id
     ORDER BY s.created_at DESC`
  );
  return NextResponse.json({ rows });
}
