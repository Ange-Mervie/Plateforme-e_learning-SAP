import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { query } from "@/lib/db";
import { getUserForSession } from "@/lib/auth/sessions";

async function checkDownloadConditions(userId: number, courseSlug: string): Promise<{ ok: boolean; missing: string[] }> {
  const missing: string[] = [];

  const assessments = await query(
    "SELECT passed FROM assessments WHERE user_id = ? AND course_slug = ? ORDER BY created_at DESC LIMIT 1",
    [userId, courseSlug]
  );
  if (!assessments.length || !assessments[0].passed) {
    missing.push("assessment_passed");
  }

  const projects = await query(
    "SELECT status FROM projects WHERE user_id = ? AND course_slug = ? ORDER BY created_at DESC LIMIT 1",
    [userId, courseSlug]
  );
  if (!projects.length || (projects[0].status !== "validated" && projects[0].status !== "approved")) {
    missing.push("project_validated");
  }

  const defenses = await query(
    "SELECT decision FROM defenses WHERE user_id = ? AND course_slug = ? ORDER BY created_at DESC LIMIT 1",
    [userId, courseSlug]
  );
  if (!defenses.length || defenses[0].decision !== "admis") {
    missing.push("defense_admitted");
  }

  const certificates = await query(
    "SELECT id FROM certificates WHERE user_id = ? AND course_slug = ? ORDER BY created_at DESC LIMIT 1",
    [userId, courseSlug]
  );
  if (!certificates.length) {
    missing.push("certificate_issued");
  }

  return { ok: missing.length === 0, missing };
}

export async function GET(req: Request) {
  await connection();
  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get("courseSlug");
  const documentId = searchParams.get("documentId");
  if (!courseSlug || !documentId) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const token = (await cookies()).get("sap_academy_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await getUserForSession(token);
  if (!user) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  const conditions = await checkDownloadConditions(user.id, courseSlug);
  if (!conditions.ok) {
    return NextResponse.json({
      error: "Conditions non remplies",
      missing: conditions.missing,
    }, { status: 403 });
  }

  const docs = await query(
    "SELECT * FROM course_documents WHERE id = ? AND course_slug = ? AND is_private = 1",
    [Number(documentId), courseSlug]
  );
  if (!docs.length) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  const doc = docs[0];

  // Générer un document de support PDF-like (texte) de manière dynamique
  // Aucun fichier n'est stocké publiquement — tout est généré via cette route protégée
  const content = `
============================================================
SUPPORT DOCUMENTAIRE - ${doc.title}
============================================================

Cours : ${courseSlug}
Utilisateur : ${user.name} (${user.email})
Téléchargement autorisé le : ${new Date().toISOString()}

CONDITIONS VALIDÉES :
- Évaluation finale : OUI
- Projet final : OUI
- Soutenance : OUI
- Attestation : OUI

------------------------------------------------------------
CONTENU DU SUPPORT
------------------------------------------------------------

Ce document contient le support pédagogique officiel du cours
${courseSlug} de la plateforme SAP Learning Academy.

Il est réservé exclusivement à l'apprenant ayant validé
l'ensemble du parcours (évaluation, projet, soutenance,
attestation).

Toute reproduction ou diffusion non autorisée est interdite.

© IBN Group - SAP Learning Academy
============================================================
  `.trim();

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": doc.mime_type || "application/pdf",
      "Content-Disposition": `attachment; filename="${doc.filename}"`,
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "Pragma": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
