"use client";

import { useState } from "react";
import ApprenantSidebar from "@/components/apprenant/sidebar";
import UserBadge from "@/components/apprenant/user-badge";
import { useAuth } from "@/context/auth-context";
import {
  Send,
  MessageSquare,
  Search,
  CheckCheck,
  User,
  Paperclip,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface Message {
  id: string;
  sender: "mentor" | "learner";
  text: string;
  time: string;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  messages: Message[];
}

const INITIAL_CONTACTS: Contact[] = [
  {
    id: "claire",
    name: "Dr. Claire Moreau",
    role: "Consultante Senior SAP FI/CO",
    avatar: "CM",
    online: true,
    messages: [
      {
        id: "m1",
        sender: "mentor",
        text: "Bonjour ! Bienvenue dans le cursus SAP Finance. N'hésitez pas si vous rencontrez un blocage sur les transactions de clôture FB50 ou FS00.",
        time: "09:30",
      },
      {
        id: "m2",
        sender: "learner",
        text: "Bonjour Dr. Moreau, lors de mon atelier sur la saisie de pièces, j'ai eu une erreur 'Posting period 011 is not open'.",
        time: "09:42",
      },
      {
        id: "m3",
        sender: "mentor",
        text: "C'est classique en environnement de formation ! Il suffit d'ouvrir la variante de périodes comptables via la transaction OB52 pour votre code société 1000.",
        time: "09:45",
      },
    ],
  },
  {
    id: "karim",
    name: "Karim Benali",
    role: "Expert Supply Chain & Logistique (MM/SD)",
    avatar: "KB",
    online: true,
    messages: [
      {
        id: "k1",
        sender: "mentor",
        text: "Bonjour ! Avez-vous pu tester le flux complet Commande d'achat (ME21N) -> Réception marchandises (MIGO) -> Facture (MIRO) ?",
        time: "Hier",
      },
    ],
  },
  {
    id: "support",
    name: "Support Technique & Labs SAP",
    role: "Assistance Plateforme & Connexion SAP GUI",
    avatar: "ST",
    online: false,
    messages: [
      {
        id: "s1",
        sender: "mentor",
        text: "Le serveur SAP S/4HANA Cloud Lab est opérationnel 24/7. Pour réinitialiser votre mot de passe système, contactez-nous ici.",
        time: "04 nov.",
      },
    ],
  },
];

const QUICK_PROMPTS = [
  "Comment fonctionne le lettrage de comptes (FB05) ?",
  "Quelle est la différence entre ME21N et ME51N ?",
  "Pouvez-vous valider mon exercice de clôture mensuelle ?",
];

export default function MessageriePage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [activeContactId, setActiveContactId] = useState("claire");
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "learner",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedContacts = contacts.map((c) => {
      if (c.id === activeContact.id) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    setContacts(updatedContacts);
    const sentText = inputText;
    setInputText("");

    // Simulate realistic mentor response after 1.5s
    setTimeout(() => {
      let replyText = "Bien reçu ! Votre question est très pertinente dans le cadre du paramétrage SAP. Je vous prépare un exemple détaillé avec les captures SPRO d'ici quelques instants.";
      if (sentText.toLowerCase().includes("lettrage") || sentText.toLowerCase().includes("fb05")) {
        replyText = "Pour le lettrage en FB05 / F-03 : veillez à sélectionner le même compte général ou compte de tiers, puis activez les postes dont la somme des montants Débit et Crédit est rigoureusement égale à zéro.";
      } else if (sentText.toLowerCase().includes("me21n") || sentText.toLowerCase().includes("me51n")) {
        replyText = "Excellente distinction : ME51N crée une Demande d'Achat interne (DA / Purchase Requisition), tandis que ME21N crée la Commande d'Achat officielle (Purchase Order) émise vers le fournisseur.";
      }

      const autoReply: Message = {
        id: `reply-${Date.now()}`,
        sender: "mentor",
        text: replyText,
        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      };

      setContacts((prev) =>
        prev.map((c) => (c.id === activeContact.id ? { ...c, messages: [...c.messages, autoReply] } : c))
      );
    }, 1200);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-navy">
      <ApprenantSidebar />

      <main className="relative flex min-h-screen flex-1 flex-col bg-surface">
        {/* Top Navbar */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h1 className="text-base font-bold text-navy">Messagerie & Mentorat SAP</h1>
          </div>
          <UserBadge />
        </div>

        {/* Chat Workspace */}
        <div className="mx-auto flex w-full max-w-7xl flex-1 p-6 lg:p-8">
          <div className="flex w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm min-h-[650px]">
            {/* Left Contacts Sidebar */}
            <div className="w-80 shrink-0 border-r border-slate-200 flex flex-col bg-white">
              <div className="p-4 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un mentor SAP..."
                    className="h-9 w-full rounded-xl bg-surface pl-9 pr-3 text-xs text-navy outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {filteredContacts.map((contact) => {
                  const isSelected = contact.id === activeContact.id;
                  const lastMessage = contact.messages[contact.messages.length - 1];

                  return (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => setActiveContactId(contact.id)}
                      className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                        isSelected ? "bg-primary/5 border-l-4 border-primary" : "hover:bg-surface"
                      }`}
                    >
                      <div className="relative">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                          {contact.avatar}
                        </span>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-navy truncate">{contact.name}</p>
                          {lastMessage && (
                            <span className="text-[10px] text-slate-400">{lastMessage.time}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{contact.role}</p>
                        {lastMessage && (
                          <p className="mt-1 text-xs text-slate-400 truncate">
                            {lastMessage.text}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Chat Pane */}
            <div className="flex flex-1 flex-col bg-slate-50">
              {/* Chat Header */}
              <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {activeContact.avatar}
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-navy">{activeContact.name}</h2>
                    <p className="text-xs text-slate-500">{activeContact.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    En ligne · Réponse moyenne : 10 min
                  </span>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="text-center">
                  <span className="rounded-full bg-slate-200/70 px-3 py-1 text-[11px] font-medium text-slate-600">
                    Début des échanges avec {activeContact.name}
                  </span>
                </div>

                {activeContact.messages.map((msg) => {
                  const isLearner = msg.sender === "learner";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isLearner ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                          isLearner
                            ? "bg-primary text-white rounded-br-sm"
                            : "bg-white text-navy border border-slate-200 rounded-bl-sm"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div
                          className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                            isLearner ? "text-blue-100" : "text-slate-400"
                          }`}
                        >
                          <span>{msg.time}</span>
                          {isLearner && <CheckCheck className="h-3 w-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Questions Shortcuts */}
              <div className="px-6 py-2 bg-white/70 border-t border-slate-200 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" /> Questions rapides :
                </span>
                {QUICK_PROMPTS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(q)}
                    className="rounded-full bg-surface border border-slate-200 px-3 py-1 text-xs text-navy hover:bg-primary/10 hover:text-primary transition-colors truncate max-w-xs"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Message Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3 border-t border-slate-200 bg-white p-4"
              >
                <button
                  type="button"
                  title="Joindre une capture d'écran"
                  onClick={() => alert("Capture d'écran de transaction SAP attachée.")}
                  className="rounded-xl p-2 text-slate-400 hover:bg-surface hover:text-navy transition-colors"
                >
                  <Paperclip className="h-5 w-5" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Posez votre question sur SAP (Transaction, Customizing, Lab)..."
                  className="h-11 flex-1 rounded-xl bg-surface px-4 text-sm text-navy outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm hover:bg-primary-dark transition-all disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
