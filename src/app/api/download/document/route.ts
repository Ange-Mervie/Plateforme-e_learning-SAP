import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { query } from "@/lib/db";
import { getUserForSession } from "@/lib/auth/sessions";

async function checkDownloadConditions(userId: number, courseSlug: string): Promise<{ ok: boolean; missing: string[] }> {
  const missing: string[] = [];

  // 1. Évaluation finale validée (score >= 70)
  const assessments = await query(
    "SELECT passed FROM assessments WHERE user_id = ? AND course_slug = ? ORDER BY created_at DESC LIMIT 1",
    [userId, courseSlug]
  );
  if (!assessments.length || !assessments[0].passed) {
    missing.push("assessment_passed");
  }

  // 2. Projet final validé
  const projects = await query(
    "SELECT status, grade FROM projects WHERE user_id = ? AND course_slug = ? ORDER BY created_at DESC LIMIT 1",
    [userId, courseSlug]
  );
  if (!projects.length || (projects[0].status !== "validated" && projects[0].status !== "approved")) {
    missing.push("project_validated");
  }

  // 3. Soutenance validée (décision = 'admis')
  const defenses = await query(
    "SELECT decision FROM defenses WHERE user_id = ? AND course_slug = ? ORDER BY created_at DESC LIMIT 1",
    [userId, courseSlug]
  );
  if (!defenses.length || defenses[0].decision !== "admis") {
    missing.push("defense_admitted");
  }

  // 4. Attestation délivrée
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
  if (!courseSlug) {
    return NextResponse.json({ error: "courseSlug requis" }, { status: 400 });
  }

  const token = (await cookies()).get("sap_academy_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await getUserForSession(token);
  if (!user) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  // Vérifier que toutes les conditions sont remplies
  const conditions = await checkDownloadConditions(user.id, courseSlug);
  if (!conditions.ok) {
    return NextResponse.json({
      error: "Conditions non remplies",
      missing: conditions.missing,
      message: "Vous devez valider l'évaluation, le projet, la soutenance et obtenir l'attestation avant de télécharger le support.",
    }, { status: 403 });
  }

  // Récupérer le document du cours
  const docs = await query(
    "SELECT * FROM course_documents WHERE course_slug = ? AND is_private = 1 ORDER BY created_at DESC LIMIT 1",
    [courseSlug]
  );

  if (!docs.length) {
    return NextResponse.json({ error: "Aucun support disponible pour ce cours" }, { status: 404 });
  }

  const doc = docs[0];

  // Retourner une URL de téléchargement sécurisée (via route protégée, pas de fichier public)
  return NextResponse.json({
    ok: true,
    document: {
      id: doc.id,
      title: doc.title,
      filename: doc.filename,
      mimeType: doc.mime_type,
      size: doc.file_size,
    },
    downloadUrl: `/api/download/document/file?courseSlug=${encodeURIComponent(courseSlug)}&documentId=${doc.id}`,
  });
}
