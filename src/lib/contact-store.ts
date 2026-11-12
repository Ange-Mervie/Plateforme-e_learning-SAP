import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const REQUESTS_FILE = path.join(DATA_DIR, "contact-requests.json");

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
  // Admin
  formateurAssigne: string | null;
  commentaireInterne: string | null;
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

export async function createContactRequest(data: Omit<ContactRequest, "id" | "requestNumber" | "createdAt" | "status" | "formateurAssigne" | "commentaireInterne">): Promise<ContactRequest> {
  await ensureInitialized();
  const request: ContactRequest = {
    ...data,
    id: randomBytes(16).toString("hex"),
    requestNumber: generateRequestNumber(),
    createdAt: new Date().toISOString(),
    status: "nouvelle",
    formateurAssigne: null,
    commentaireInterne: null,
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

export async function updateContactRequestStatus(id: string, status: string, commentaire?: string, formateurAssigne?: string): Promise<boolean> {
  await ensureInitialized();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  requests[idx].status = status;
  if (commentaire !== undefined) requests[idx].commentaireInterne = commentaire;
  if (formateurAssigne !== undefined) requests[idx].formateurAssigne = formateurAssigne;
  await saveRequests();
  return true;
}

export async function getContactRequestsCount(): Promise<number> {
  await ensureInitialized();
  return requests.length;
}

export type { ContactRequest };
