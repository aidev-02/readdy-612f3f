import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    // Mock auth — aceita qualquer credencial para demonstração
    // Em produção, isto deve ligar ao Supabase Auth
    setTimeout(() => {
      if (email.trim() && password.trim()) {
        localStorage.setItem("manger_admin_session", JSON.stringify({ email, loggedInAt: Date.now() }));
        setStatus("idle");
        navigate("/admin/dashboard");
      } else {
        setStatus("error");
        setErrorMsg("Preenche o email e a palavra-passe.");
      }
    }, 800);
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block cursor-pointer">
            <img
              src="https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/c935aa9a-c680-41c9-a0a6-ff65cb4f7853_compressed_manger.pt_logo.webp"
              alt="Manger.pt"
              className="h-12 w-auto mx-auto"
            />
          </Link>
          <p className="mt-3 text-sm text-foreground-500">
            Área reservada · Acesso administrativo
          </p>
        </div>

        <div className="rounded-xl bg-background-100 border border-background-200/70 p-8">
          <h1 className="font-heading text-2xl font-bold text-foreground-950 mb-1">
            Iniciar sessão
          </h1>
          <p className="text-sm text-foreground-600 mb-6">
            Introduz as tuas credenciais para aceder ao painel.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-foreground-800 mb-1.5">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@manger.pt"
                className="w-full px-4 py-3 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-foreground-800 mb-1.5">
                Palavra-passe
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
              />
            </div>

            {status === "error" && errorMsg && (
              <div className="rounded-lg bg-primary-50 border border-primary-200 p-3 flex items-start gap-2">
                <i className="ri-error-warning-line text-primary-600 mt-0.5 w-4 h-4 flex items-center justify-center shrink-0" />
                <p className="text-sm text-primary-800">{errorMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-6 py-3.5 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors"
            >
              {status === "loading" ? (
                <>
                  <i className="ri-loader-4-line animate-spin w-5 h-5 flex items-center justify-center" />
                  A entrar...
                </>
              ) : (
                <>
                  <i className="ri-login-box-line w-5 h-5 flex items-center justify-center" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-background-200/60">
            <p className="text-xs text-foreground-500 leading-relaxed">
              <strong>Nota de desenvolvimento:</strong> Este login é uma demonstração.
              Para autenticação segura em produção, é necessário ligar o{" "}
              <strong>Supabase Auth</strong>.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-foreground-600 hover:text-primary-600 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center" />
            Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}