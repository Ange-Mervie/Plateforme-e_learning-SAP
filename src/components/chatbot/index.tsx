"use client";

import { useState, useRef, useContext } from "react";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { LanguageContext, type Lang, fr, en } from "@/context/language-context";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

export default function Chatbot() {
  const ctx = useContext(LanguageContext);
  const lang: Lang = ctx?.lang ?? "fr";
  const dict = lang === "en" ? en : fr;
  const t = (key: string) => {
    const value = key.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object") {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, dict);
    return typeof value === "string" ? value : key;
  };
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: t("chatbot.welcome"),
      time: "",
    },
  ]);
  const idRef = useRef(1);

  const nextId = () => {
    idRef.current += 1;
    return idRef.current.toString();
  };

  const now = () => new Date().toLocaleTimeString(lang === "fr" ? "fr-FR" : "en-US", { hour: "2-digit", minute: "2-digit" });

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: nextId(),
      sender: "user",
      text: input.trim(),
      time: now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const reply = getBotResponse(input.trim(), lang);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          sender: "bot",
          text: reply,
          time: now(),
        },
      ]);
    }, 800);
  };

  const handleQuick = (q: string) => {
    setInput(q);
    const userMsg: ChatMessage = {
      id: nextId(),
      sender: "user",
      text: q,
      time: now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply = getBotResponse(q, lang);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          sender: "bot",
          text: reply,
          time: now(),
        },
      ]);
    }, 800);
  };

  const toggle = () => setIsOpen((prev) => !prev);

  const quickQuestions = [
    t("chatbot.quick1"),
    t("chatbot.quick2"),
    t("chatbot.quick3"),
    t("chatbot.quick4"),
    t("chatbot.quick5"),
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating button */}
      <button
        onClick={toggle}
        className="relative h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl hover:bg-primary-dark transition-all focus:outline-none"
        aria-label={t("chatbot.ariaLabel")}
      >
        <div className={`absolute inset-0 rounded-full border-2 border-primary/30 animate-ping`}></div>
        <MessageCircle className="h-7 w-7" />
        {!isOpen && (
          <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
            NEW
          </span>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="relative z-50 flex flex-col h-[420px] w-[340px] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-navy text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-emerald-300">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold">{t("chatbot.title")}</h3>
                <p className="text-[10px] text-emerald-100">{t("chatbot.subtitle")}</p>
              </div>
            </div>
            <button
              onClick={toggle}
              className="rounded-md p-1 text-white/70 hover:bg-white/20 transition-colors"
              aria-label={t("chatbot.close")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-2.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-surface text-navy border border-slate-200 rounded-bl-sm"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`mt-1 block text-[9px] ${
                    msg.sender === "user" ? "text-emerald-100" : "text-slate-400"
                  }`}>{msg.time}</span>
                </div>
              </div>
            ))}
            <div className="h-6" />
          </div>

          {/* Quick actions - vertical compact */}
          <div className="px-3 py-2 border-t border-slate-100 bg-white">
            <div className="flex flex-col gap-1.5 mb-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuick(q)}
                  className="w-full rounded-md border border-slate-200 bg-surface px-2 py-1.5 text-left text-[11px] text-navy hover:bg-primary hover:text-white transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chatbot.placeholder")}
                className="flex-1 h-9 rounded-md border border-slate-200 bg-white px-2.5 text-[11px] text-navy outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded-md bg-primary px-2 text-[11px] text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getBotResponse(userText: string, lang: Lang): string {
  const text = userText.toLowerCase();
  const responses: Record<string, string[]> = {
    connexion: lang === "fr"
      ? [
          "Pour vous connecter, rendez-vous sur la page /connexion avec votre email et mot de passe. En cas d'oubli, utilisez le lien « Mot de passe oublié ».",
          "Si votre compte est bloqué, contactez le support technique via la messagerie.",
        ]
      : [
          "To log in, go to the /login page with your email and password. If you forgot it, use the « Forgot password » link.",
          "If your account is blocked, contact technical support via the messaging system.",
        ],
    abonnement: lang === "fr"
      ? [
          "L'abonnement est requis pour accéder aux cours protégés, aux évaluations et aux attestations. Vous pouvez souscrire depuis la page /paiement.",
          "Les statuts d'abonnement : en attente, actif, expiré, annulé, échec de paiement.",
        ]
      : [
          "To start a training program, contact a trainer through the request form. Our team will guide you through your learning path.",
          "You can track your request progress from your dedicated space.",
        ],
    cours: lang === "fr"
      ? [
          "Les cours sont accessibles depuis le catalogue (/catalogue). Chaque formation comporte des modules, chapitres et leçons avec suivi de progression.",
          "Les contenus protégés nécessitent un abonnement actif et payé.",
        ]
      : [
          "Courses are accessible from the catalog (/catalog). Each training includes modules, chapters and lessons with progress tracking.",
          "To access a complete learning path, contact a certified IBN Group trainer.",
        ],
    examen: lang === "fr"
      ? [
          "Les évaluations se passent dans l'onglet évaluation de chaque formation. Seuil de réussite : 70%.",
          "Les examens blancs sont accessibles gratuitement depuis la page Certifications.",
        ]
      : [
          "Assessments take place in the assessment tab of each training. Passing threshold: 70%.",
          "Mock exams are available for free from the Certifications page.",
        ],
    attestation: lang === "fr"
      ? [
          "L'attestation est délivrée après validation de l'évaluation finale, du projet final et de la soutenance.",
          "Téléchargez votre attestation depuis votre espace apprenant, onglet « Mes attestations ».",
        ]
      : [
          "The certificate is issued after validation of the final assessment, final project and defense.",
          "Download your certificate from your learner space, tab « My certificates ».",
        ],
    projet: lang === "fr"
      ? [
          "Le projet final est obligatoire pour valider votre parcours. Soumettez-le depuis votre espace apprenant.",
          "Un formateur évaluera votre projet et organisera votre soutenance.",
        ]
      : [
          "The final project is mandatory to validate your path. Submit it from your learner space.",
          "A trainer will evaluate your project and organize your defense.",
        ],
    support: lang === "fr"
      ? [
          "Pour toute difficulté technique, utilisez la messagerie pour contacter un formateur ou le support technique.",
          "Le support est disponible pour les problèmes de connexion, SAP GUI Labs et accès aux contenus.",
        ]
      : [
          "For any technical difficulty, use the messaging system to contact a trainer or technical support.",
          "Support is available for connection issues, SAP GUI Labs and content access.",
        ],
  };

  for (const [key, list] of Object.entries(responses)) {
    if (text.includes(key)) {
      return list[Math.floor(Math.random() * list.length)];
    }
  }

  const defaults = lang === "fr"
    ? [
        "Je suis votre assistant SAP Learning Academy. Comment puis-je vous aider aujourd'hui ?",
        "Posez-moi une question sur la plateforme, les cours SAP ou votre abonnement.",
      ]
    : [
        "I am your SAP Learning Academy assistant. How can I help you today?",
        "Ask me a question about the platform, SAP courses or your subscription.",
      ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}
