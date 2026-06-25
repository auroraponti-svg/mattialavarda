"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(`${error.message} (codice ${error.status ?? "?"})`);
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Logo" width={56} height={62} className="h-14 w-auto mb-3" />
          <h1 className="text-2xl font-bold text-navy">Area riservata</h1>
          <p className="text-sm text-navy/50">Accedi per gestire il blog</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-xl p-6 shadow-sm border border-navy/10 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy focus:outline-none focus:ring-3 focus:ring-steel/40 focus:border-steel transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-navy mb-1">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy focus:outline-none focus:ring-3 focus:ring-steel/40 focus:border-steel transition"
            />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-steel text-white font-semibold px-6 py-3 rounded-lg hover:bg-navy transition-colors duration-200 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Accesso in corso…" : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
}
