import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { execute, query, type SqlParameter } from "@/lib/db";
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
  const { grade, comments, status } = await req.json();
  if (grade == null && !comments && !status) {
    return NextResponse.json({ error: "Aucune donnée à mettre à jour" }, { status: 400 });
  }

  const fields: string[] = [];
  const values: SqlParameter[] = [];
  if (grade != null) { fields.push("grade = ?"); values.push(grade); }
  if (comments !== undefined) { fields.push("comments = ?"); values.push(comments); }
  if (status) { fields.push("status = ?"); values.push(status); }
  values.push(Number(id));

  await execute(`UPDATE projects SET ${fields.join(", ")} WHERE id = ?`, values);

  const updated = await query("SELECT * FROM projects WHERE id = ?", [Number(id)]);
  return NextResponse.json({ ok: true, project: updated[0] || null });
}
