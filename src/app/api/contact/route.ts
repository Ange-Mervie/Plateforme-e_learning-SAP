import { NextResponse } from "next/server";
import { getAllContactRequests, getContactRequestById, updateContactRequestStatus } from "@/lib/contact-store";

export async function GET() {
  try {
    const requests = await getAllContactRequests();
    return NextResponse.json({ requests });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la récupération des demandes." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, commentaire, formateurAssigne } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID et statut requis." }, { status: 400 });
    }
    const ok = await updateContactRequestStatus(id, status, commentaire, formateurAssigne);
    if (!ok) {
      return NextResponse.json({ error: "Demande non trouvée." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}
