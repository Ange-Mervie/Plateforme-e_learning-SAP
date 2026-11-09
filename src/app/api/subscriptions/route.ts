import { NextResponse } from "next/server";
import { updateUserSubscription } from "@/lib/local-store";

export async function POST(req: Request) {
  try {
    const { userId, planId } = await req.json();
    if (!userId) return NextResponse.json({ error: "missing" }, { status: 400 });
    updateUserSubscription(Number(userId), "active", planId || "pack-finance");
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "missing" }, { status: 400 });
  return NextResponse.json({ subscription: { id: 1, user_id: Number(userId), status: "active" } });
}
