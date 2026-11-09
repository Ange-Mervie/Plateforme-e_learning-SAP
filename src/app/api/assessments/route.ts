import { NextResponse } from "next/server";
import { saveAssessment, getAssessmentsForUser } from "@/lib/local-store";

export async function POST(req: Request) {
  try {
    const { userId, courseSlug, score } = await req.json();
    if (!userId || !courseSlug || score == null) return NextResponse.json({ error: "missing" }, { status: 400 });
    const passed = Number(score) >= 70 ? 1 : 0;
    const record = saveAssessment(Number(userId), String(courseSlug), Number(score), passed);
    return NextResponse.json({ ok: true, passed: !!passed, assessment: record });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "missing" }, { status: 400 });
  const rows = getAssessmentsForUser(Number(userId));
  return NextResponse.json({ rows });
}
