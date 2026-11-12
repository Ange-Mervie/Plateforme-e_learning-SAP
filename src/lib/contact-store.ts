import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const REQUESTS_FILE = path.join(DATA_DIR, "contact-requests.json");

interface HistoriqueEntree {
  action: string;
  date: string;
  auteur: string;
  details: string | null;
}

interface ContactRequest {
  id: string;
  requestNumber: string;
  createdAt: string;
  status: string;
  // Informations personnelles
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  pays: string;
  situation: string;
  // Informations formation
  formation: string;
  module: string;
  formateur: string;
  niveau: string;
  objectif: string;
  mode: string;
  disponibilite: string;
  dateDebut: string;
  // Complémentaires
  dejaUtiliseSAP: string;
  dejaFormationSAP: string;
  attentes: string;
  message: string;
  consentement: boolean;
  // Admin & suivi pédagogique
  formateurAssigne: string | null;
  commentaireInterne: string | null;
  formationCommencee: boolean;
  progression: number;
  evaluationPassee: boolean;
  evaluationScore: number;
  attestationValidee: boolean;
  motifRefusAttestation: string | null;
  historique: HistoriqueEntree[];
}

interface UpdateContactRequestData {
  status?: string;
  commentaire?: string;
  formateurAssigne?: string;
  formationCommencee?: boolean;
  progression?: number;
  evaluationPassee?: boolean;
  evaluationScore?: number;
  attestationValidee?: boolean;
  motifRefusAttestation?: string;
  historiqueAction?: string;
  historiqueAuteur?: string;
  historiqueDetails?: string;
}

let requests: ContactRequest[] = [];
let initialized = false;

async function ensureInitialized() {
  if (initialized) return;
  initialized = true;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(REQUESTS_FILE, "utf-8");
    requests = JSON.parse(content);
    // Migration: ajouter les nouveaux champs aux anciennes entrées
    requests = requests.map((r) => ({
      ...r,
      formationCommencee: r.formationCommencee ?? false,
      progression: r.progression ?? 0,
      evaluationPassee: r.evaluationPassee ?? false,
      evaluationScore: r.evaluationScore ?? 0,
      attestationValidee: r.attestationValidee ?? false,
      motifRefusAttestation: r.motifRefusAttestation ?? null,
      historique: r.historique ?? [],
    }));
    await saveRequests();
  } catch {
    requests = [];
  }
}

function generateRequestNumber(): string {
  const prefix = "ELEVATE";
  const random = randomBytes(4).toString("hex").toUpperCase();
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `${prefix}-${date}-${random}`;
}

async function saveRequests() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2), "utf-8");
}

function ajouterHistorique(
  r: ContactRequest,
  action: string,
  auteur: string,
  details: string | null
) {
  r.historique.push({
    action,
    date: new Date().toISOString(),
    auteur,
    details,
  });
}

export async function createContactRequest(data: Omit<ContactRequest, "id" | "requestNumber" | "createdAt" | "status" | "formateurAssigne" | "commentaireInterne" | "formationCommencee" | "progression" | "evaluationPassee" | "evaluationScore" | "attestationValidee" | "motifRefusAttestation" | "historique">): Promise<ContactRequest> {
  await ensureInitialized();
  const request: ContactRequest = {
    ...data,
    id: randomBytes(16).toString("hex"),
    requestNumber: generateRequestNumber(),
    createdAt: new Date().toISOString(),
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
  };
  requests.push(request);
  await saveRequests();
  return request;
}

export async function getAllContactRequests(): Promise<ContactRequest[]> {
  await ensureInitialized();
  return [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getContactRequestById(id: string): Promise<ContactRequest | null> {
  await ensureInitialized();
  const req = requests.find((r) => r.id === id);
  return req || null;
}

export async function updateContactRequest(data: UpdateContactRequestData & { id: string }): Promise<boolean> {
  await ensureInitialized();
  const idx = requests.findIndex((r) => r.id === data.id);
  if (idx === -1) return false;

  const r = requests[idx];
  const auteur = data.historiqueAuteur || "admin";

  if (data.status !== undefined && data.status !== r.status) {
    ajouterHistorique(r, `Statut changé: ${r.status} → ${data.status}`, auteur, null);
    r.status = data.status;
  }
  if (data.commentaire !== undefined) {
    r.commentaireInterne = data.commentaire;
    ajouterHistorique(r, "Commentaire ajouté", auteur, data.commentaire);
  }
  if (data.formateurAssigne !== undefined && data.formateurAssigne !== r.formateurAssigne) {
    ajouterHistorique(r, `Formateur affecté: ${data.formateurAssigne}`, auteur, null);
    r.formateurAssigne = data.formateurAssigne;
  }
  if (data.formationCommencee !== undefined && data.formationCommencee !== r.formationCommencee) {
    ajouterHistorique(r, `Formation commencée: ${data.formationCommencee}`, auteur, null);
    r.formationCommencee = data.formationCommencee;
  }
  if (data.progression !== undefined && data.progression !== r.progression) {
    ajouterHistorique(r, `Progression: ${r.progression}% → ${data.progression}%`, auteur, null);
    r.progression = data.progression;
  }
  if (data.evaluationPassee !== undefined && data.evaluationPassee !== r.evaluationPassee) {
    ajouterHistorique(r, `Évaluation passée: ${data.evaluationPassee}`, auteur, data.evaluationScore !== undefined ? `Score: ${data.evaluationScore}` : null);
    r.evaluationPassee = data.evaluationPassee;
  }
  if (data.evaluationScore !== undefined) {
    r.evaluationScore = data.evaluationScore;
  }
  if (data.attestationValidee !== undefined && data.attestationValidee !== r.attestationValidee) {
    const motif = data.attestationValidee ? null : data.motifRefusAttestation;
    ajouterHistorique(r, `Attestation ${data.attestationValidee ? "validée" : "refusée"}`, auteur, motif || null);
    r.attestationValidee = data.attestationValidee;
    r.motifRefusAttestation = motif ?? null;
  }

  requests[idx] = r;
  await saveRequests();
  return true;
}

export async function getContactRequestsCount(): Promise<number> {
  await ensureInitialized();
  return requests.length;
}

export type { ContactRequest };
