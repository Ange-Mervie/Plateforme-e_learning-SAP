import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  await connection();
  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get("courseSlug");
  if (!courseSlug) {
    return NextResponse.json({ error: "courseSlug requis" }, { status: 400 });
  }

  const token = (await cookies()).get("sap_academy_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Résoudre l'utilisateur depuis la session
  const { getUserForSession } = await import("@/lib/auth/sessions");
  const user = await getUserForSession(token);
  if (!user) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  // Vérifier que l'utilisateur a une attestation pour ce cours
  const rows = await query(
    "SELECT c.id FROM certificates c WHERE c.user_id = ? AND c.course_slug = ?",
    [user.id, courseSlug]
  );

  if (!rows.length) {
    return NextResponse.json({ error: "Aucune attestation délivrée pour ce cours" }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    downloadUrl: `/api/download/certificate/file?courseSlug=${encodeURIComponent(courseSlug)}&userId=${user.id}`,
    certificateId: rows[0].id,
  });
}
