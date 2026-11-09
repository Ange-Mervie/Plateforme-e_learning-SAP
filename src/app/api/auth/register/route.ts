import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "@/lib/local-store";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = findUserByEmail(trimmedEmail);

    if (existing) {
      return NextResponse.json({ error: "exists" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    const displayName = name ? name.trim() : trimmedEmail.split("@")[0];

    const newUser = createUser(displayName, trimmedEmail, hash);

    return NextResponse.json({
      ok: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    if (message === "USER_EXISTS") {
      return NextResponse.json({ error: "exists" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
