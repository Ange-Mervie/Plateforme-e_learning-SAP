import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface ContactRequest {
  id: string;
  requestNumber: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
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
  formateurAssigne: string | null;
  commentaireInterne: string | null;
  formationCommencee: boolean;
  progression: number;
  evaluationPassee: boolean;
  evaluationScore: number;
  attestationValidee: boolean;
  motifRefusAttestation: string | null;
  historique: unknown[];
}

export interface UpdateContactRequestData {
  status?: string;
  commentaire?: string;
  formateurAssigne?: string;
  formationCommencee?: boolean;
  progression?: number;
  evaluationPassee?: boolean;
  evaluationScore?: number;
  attestationValidee?: boolean;
  motifRefusAttestation?: string;
  historiqueAuteur?: string;
}

export async function createContactRequest(data: Omit<ContactRequest, "id" | "requestNumber" | "createdAt" | "updatedAt" | "status" | "formateurAssigne" | "commentaireInterne" | "formationCommencee" | "progression" | "evaluationPassee" | "evaluationScore" | "attestationValidee" | "motifRefusAttestation" | "historique">): Promise<ContactRequest> {
  const requestNumber = generateRequestNumber();
  const request = await prisma.contactRequest.create({
    data: {
      ...data,
      requestNumber,
      status: "nouvelle",
      formateurAssigne: null,
      commentaireInterne: null,
      formationCommencee: false,
      progression: 0,
      evaluationPassee: false,
      evaluationScore: 0,
      attestationValidee: false,
      motifRefusAttestation: null,
      historique: [],
    },
  });
  return request as unknown as ContactRequest;
}

export async function getAllContactRequests(): Promise<ContactRequest[]> {
  const requests = await prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return requests as unknown as ContactRequest[];
}

export async function getContactRequestById(id: string): Promise<ContactRequest | null> {
  const request = await prisma.contactRequest.findUnique({
    where: { id },
  });
  return request as unknown as ContactRequest | null;
}

export async function updateContactRequest(data: UpdateContactRequestData & { id: string }): Promise<boolean> {
  const existing = await prisma.contactRequest.findUnique({
    where: { id: data.id },
  });
  if (!existing) return false;

  const updateData: Record<string, unknown> = {};
  const auteur = data.historiqueAuteur || "admin";

  if (data.status !== undefined && data.status !== existing.status) {
    updateData.status = data.status;
    await addHistorique(data.id, `Statut changé: ${existing.status} → ${data.status}`, auteur, null);
  }
  if (data.commentaire !== undefined) {
    updateData.commentaireInterne = data.commentaire;
    await addHistorique(data.id, "Commentaire ajouté", auteur, data.commentaire);
  }
  if (data.formateurAssigne !== undefined && data.formateurAssigne !== existing.formateurAssigne) {
    updateData.formateurAssigne = data.formateurAssigne;
    await addHistorique(data.id, `Formateur affecté: ${data.formateurAssigne}`, auteur, null);
  }
  if (data.formationCommencee !== undefined && data.formationCommencee !== existing.formationCommencee) {
    updateData.formationCommencee = data.formationCommencee;
    await addHistorique(data.id, `Formation commencée: ${data.formationCommencee}`, auteur, null);
  }
  if (data.progression !== undefined && data.progression !== existing.progression) {
    updateData.progression = data.progression;
    await addHistorique(data.id, `Progression: ${existing.progression}% → ${data.progression}%`, auteur, null);
  }
  if (data.evaluationPassee !== undefined && data.evaluationPassee !== existing.evaluationPassee) {
    updateData.evaluationPassee = data.evaluationPassee;
    await addHistorique(data.id, `Évaluation passée: ${data.evaluationPassee}`, auteur, data.evaluationScore !== undefined ? `Score: ${data.evaluationScore}` : null);
  }
  if (data.evaluationScore !== undefined) {
    updateData.evaluationScore = data.evaluationScore;
  }
  if (data.attestationValidee !== undefined && data.attestationValidee !== existing.attestationValidee) {
    const motif = data.attestationValidee ? null : data.motifRefusAttestation;
    updateData.attestationValidee = data.attestationValidee;
    updateData.motifRefusAttestation = motif ?? null;
    await addHistorique(data.id, `Attestation ${data.attestationValidee ? "validée" : "refusée"}`, auteur, motif || null);
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.contactRequest.update({
      where: { id: data.id },
      data: updateData,
    });
  }
  return true;
}

export async function getContactRequestsCount(): Promise<number> {
  return prisma.contactRequest.count();
}

async function addHistorique(requestId: string, action: string, auteur: string, details: string | null) {
  const request = await prisma.contactRequest.findUnique({
    where: { id: requestId },
    select: { historique: true },
  });
  if (!request) return;

  const historique = (request.historique as unknown as Array<{ action: string; date: string; auteur: string; details: string | null }>) || [];
  historique.push({ action, date: new Date().toISOString(), auteur, details });

  await prisma.contactRequest.update({
    where: { id: requestId },
    data: { historique: historique as Prisma.InputJsonValue },
  });
}

function generateRequestNumber(): string {
  const prefix = "ELEVATE";
  const random = randomBytes(4).toString("hex").toUpperCase();
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `${prefix}-${date}-${random}`;
}