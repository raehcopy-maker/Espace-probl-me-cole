import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../lib/supabase";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    // 1. Authenticate the user with Supabase Auth
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (loginError) {
      setLoading(false);
      setError("Email ou mot de passe incorrect.");
      return;
    }

    // 2. Check whether the authenticated user is an authorized admin
    const { data: isAdmin, error: adminCheckError } =
      await supabase.rpc("is_admin");

    // 3. If authentication succeeded but the account isn't an admin,
    // immediately revoke the session.
    if (adminCheckError || !isAdmin) {
      await supabase.auth.signOut();

      setLoading(false);
      setError(
        "Accès refusé. Ce compte ne possède pas les privilèges administrateur.",
      );
      return;
    }

    // 4. Authentication + authorization succeeded
    setLoading(false);
    onLogin();
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-logo">🛡️</div>

        <p className="admin-eyebrow">ESPACE ADMINISTRATION</p>

        <h1>Bienvenue</h1>

        <p className="admin-login-description">
          Connectez-vous pour consulter et traiter les signalements reçus.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="admin-email">Adresse email</label>

            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@ecole.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Mot de passe</label>

            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="admin-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="admin-security-note">
          🔒 Accès réservé aux administrateurs autorisés.
        </p>
      </div>
    </main>
  );
}
