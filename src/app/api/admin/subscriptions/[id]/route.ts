import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { execute, query } from "@/lib/db";
import { getUserForSession } from "@/lib/auth/sessions";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connection();
  const token = (await cookies()).get("sap_academy_session")?.value;
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const user = await getUserForSession(token);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Interdit" }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();
  if (!status) return NextResponse.json({ error: "Statut requis" }, { status: 400 });

  await execute("UPDATE subscriptions SET status = ? WHERE id = ?", [status, Number(id)]);

  // Mettre à jour aussi le statut dans users pour cohérence
  const subRows = await query<any>("SELECT user_id FROM subscriptions WHERE id = ?", [Number(id)]);
  if (subRows.length) {
    await execute("UPDATE users SET subscription_status = ? WHERE id = ?", [status, subRows[0].user_id]);
  }

  return NextResponse.json({ ok: true });
}
