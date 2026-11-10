"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface SubscriptionRow {
  id: number;
  user_id: number;
  user_email: string;
  user_name: string;
  status: string;
  expires_at: string | null;
  created_at: string;
}

export default function AdminSubscriptions() {
  const [rows, setRows] = useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/subscriptions", { credentials: "same-origin" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Impossible de charger les abonnements");
        return r.json();
      })
      .then((data) => {
        setRows(data.rows ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    await fetch("/api/admin/subscriptions/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  if (loading) return <div className="text-sm text-slate-500">Chargement des abonnements…</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Gestion des abonnements</h1>
        <Link href="/admin" className="text-sm text-primary hover:text-primary-dark">← Retour</Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Expire le</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-slate-500 py-4">
                  Aucun abonnement pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-surface transition-colors">
                  <TableCell className="font-medium text-navy">{row.user_name}</TableCell>
                  <TableCell className="text-sm text-slate-600">{row.user_email}</TableCell>
                  <TableCell className="text-sm font-semibold">
                    <select
                      value={row.status}
                      onChange={(e) => handleStatusChange(row.id, e.target.value)}
                      className="text-xs border rounded px-1 py-0.5 focus:outline-none"
                    >
                      <option value="pending">En attente</option>
                      <option value="active">Actif</option>
                      <option value="expired">Expiré</option>
                      <option value="cancelled">Annulé</option>
                      <option value="failed">Échec paiement</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{row.expires_at || "—"}</TableCell>
                  <TableCell className="text-sm text-slate-600">{new Date(row.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right text-sm text-slate-500">ID #{row.id}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
