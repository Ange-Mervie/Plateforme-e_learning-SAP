import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { execute } from "@/lib/db";
import { getUserForSession } from "@/lib/auth/sessions";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connection();
  const token = (await cookies()).get("sap_academy_session")?.value;
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const user = await getUserForSession(token);
  if (!user || !["formateur", "admin", "consultant", "expert"].includes(user.role)) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }

  const { id } = await params;
  const { decision, comment } = await req.json();
  if (!decision) {
    return NextResponse.json({ error: "Décision requise" }, { status: 400 });
  }

  await execute(
    "UPDATE defenses SET decision = ?, evaluator_comment = ?, decided_by = ?, decided_at = CURRENT_TIMESTAMP WHERE id = ?",
    [decision, comment || null, user.id, Number(id)]
  );

  return NextResponse.json({ ok: true });
}
