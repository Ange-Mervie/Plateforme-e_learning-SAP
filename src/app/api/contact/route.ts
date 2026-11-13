import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createContactRequest, getAllContactRequests, getContactRequestById, updateContactRequest } from "@/lib/contact-store";
import { getUserForSession } from "@/lib/auth/sessions";

interface ContactRequestBody {
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  pays: string;
  situation: string;
  formation: string;
  module: string;
  formateur: string;
  niveau: string;
  objectif: string;
  mode: string;
  disponibilite: string;
  dateDebut: string;
  dejaUtiliseSAP: string;
  dejaFormationSAP: string;
  attentes: string;
  message: string;
  consentement: boolean;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactRequestBody;

    const requiredFields: (keyof ContactRequestBody)[] = [
      "nom", "email", "telephone", "ville", "pays", "situation",
      "formation", "module", "niveau", "objectif", "mode", "disponibilite",
      "dateDebut", "dejaUtiliseSAP", "dejaFormationSAP", "attentes", "message", "consentement",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Le champ ${field} est requis.` }, { status: 400 });
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Format d'email invalide." }, { status: 400 });
    }

    const phoneDigits = body.telephone.replace(/\D/g, "");
    if (phoneDigits.length < 8) {
      return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
    }

    if (body.consentement !== true) {
      return NextResponse.json({ error: "Le consentement est requis." }, { status: 400 });
    }

    const request = await createContactRequest({
      nom: body.nom,
      email: body.email,
      telephone: body.telephone,
      ville: body.ville,
      pays: body.pays,
      situation: body.situation,
      formation: body.formation,
      module: body.module,
      formateur: body.formateur || "",
      niveau: body.niveau,
      objectif: body.objectif,
      mode: body.mode,
      disponibilite: body.disponibilite,
      dateDebut: body.dateDebut,
      dejaUtiliseSAP: body.dejaUtiliseSAP,
      dejaFormationSAP: body.dejaFormationSAP,
      attentes: body.attentes,
      message: body.message,
      consentement: body.consentement,
    });

    return NextResponse.json({
      success: true,
      requestNumber: request.requestNumber,
      message: "Merci pour votre intérêt envers ELEVATE By IBN ! Votre demande a bien été enregistrée. Notre équipe vous contactera prochainement afin de discuter de votre projet de formation.",
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'enregistrement de la demande." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const token = (await cookies()).get("sap_academy_session")?.value;
    const user = await getUserForSession(token);
    const requests = await getAllContactRequests();

    const filtered = user?.role === "formateur"
      ? requests.filter((r) => r.formateurAssigne === user.name)
      : requests;

    return NextResponse.json({ requests: filtered });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la récupération des demandes." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "ID requis." }, { status: 400 });
    }
    const ok = await updateContactRequest({ id, ...updates } as any);
    if (!ok) {
      return NextResponse.json({ error: "Demande non trouvée." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}
