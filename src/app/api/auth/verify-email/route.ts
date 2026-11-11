import { NextResponse } from "next/server";
import { verifyEmailWithFallback } from "@/lib/auth/persistent-store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  const verified = await verifyEmailWithFallback(code);

  if (!verified) {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Email confirmé avec succès. Vous pouvez maintenant vous connecter." });
}
