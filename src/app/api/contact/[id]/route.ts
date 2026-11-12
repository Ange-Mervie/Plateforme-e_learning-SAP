import { NextResponse } from "next/server";
import { getContactRequestById } from "@/lib/contact-store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const request = await getContactRequestById(id);
    if (!request) {
      return NextResponse.json({ error: "Demande non trouvée." }, { status: 404 });
    }
    return NextResponse.json({ request });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la récupération." }, { status: 500 });
  }
}
