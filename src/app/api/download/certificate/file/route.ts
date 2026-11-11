import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  await connection();
  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get("courseSlug");
  const userId = searchParams.get("userId");
  if (!courseSlug || !userId) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const token = (await cookies()).get("sap_academy_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { getUserForSession } = await import("@/lib/auth/sessions");
  const user = await getUserForSession(token);
  if (!user || user.id !== Number(userId)) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  const rows = await query(
    "SELECT c.id FROM certificates c WHERE c.user_id = ? AND c.course_slug = ?",
    [userId, courseSlug]
  );
  if (!rows.length) {
    return NextResponse.json({ error: "Aucune attestation délivrée pour ce cours" }, { status: 403 });
  }

  const cert = `
ATTESTATION DE RÉUSSITE
=======================
Utilisateur : ${user.name} (${user.email})
Rôle : ${user.role}
Formation : ${courseSlug}
Statut : Attestation délivrée
Date : ${new Date().toISOString()}
Plateforme : ELEVATE By IBN
`;
  return new NextResponse(cert, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="attestation-${courseSlug}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
