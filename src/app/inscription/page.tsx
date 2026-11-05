"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function Inscription() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/apprenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-white px-6 py-24">
      <h1 className="text-3xl font-bold tracking-tight text-navy">Inscription</h1>
      <p className="mt-4 text-slate-600">Créez votre compte SAP Academy.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 p-8">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-navy">Nom</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-navy outline-none focus:border-primary" />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-navy">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-navy outline-none focus:border-primary" />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-navy">Mot de passe</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-navy outline-none focus:border-primary" />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" disabled={loading} className="h-12 w-full rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60">
          {loading ? "Inscription…" : "Créer mon compte"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Déjà un compte ?{" "}
          <Link href="/connexion" className="font-semibold text-primary hover:text-primary-dark">Se connecter</Link>
      </p>
    </main>
  );
}
