import { NextResponse } from "next/server";
import { getUserForSession } from "@/lib/auth/sessions";
import { authErrorResponse, readSessionToken } from "@/lib/auth/http";

export async function GET(request: Request) {
  try {
    const user = await getUserForSession(readSessionToken(request));
    return NextResponse.json({
      user,
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
