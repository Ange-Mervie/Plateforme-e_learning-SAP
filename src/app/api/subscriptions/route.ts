import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { query } from "@/lib/db";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { authErrorResponse } from "@/lib/auth/http";
import { requireUser } from "@/lib/auth/authorization";

interface SubscriptionRow extends RowDataPacket {
  id: number;
  user_id: number;
  status: string;
  plan_id: string | null;
  created_at: Date;
}

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await query<SubscriptionRow>(
      "SELECT id, user_id, status, plan_id, created_at FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [user.id],
    );
    return NextResponse.json({ subscription: rows[0] ?? null });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await requireUser();
    return NextResponse.json(
      { error: "payment_provider_not_configured" },
      { status: 501 },
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
