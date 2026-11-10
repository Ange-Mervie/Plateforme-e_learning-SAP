import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { query } from "@/lib/db";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { authErrorResponse } from "@/lib/auth/http";
import { requireUser } from "@/lib/auth/authorization";

interface CertificateRow extends RowDataPacket {
  id: number;
  user_id: number;
  course_slug: string;
  issued_at: Date;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await requireUser();
    return NextResponse.json({ error: "certificate_issuance_not_configured" }, { status: 501 });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await query<CertificateRow>(
      "SELECT * FROM certificates WHERE user_id = ? ORDER BY issued_at DESC",
      [user.id],
    );
    return NextResponse.json({ rows });
  } catch (error) {
    return authErrorResponse(error);
  }
}
