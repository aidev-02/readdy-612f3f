import { useState } from "react";

const assuntos = [
  "Encomenda de sobremesa",
  "Orçamento para evento",
  "Parceria profissional",
  "Dúvida sobre produto",
  "Outro assunto",
];

export default function FormularioContactos() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check
    const honeypot = formData.get("website_alt")?.toString().trim() || "";
    if (honeypot) {
      setStatus("success");
      form.reset();
      setCharCount(0);
      return;
    }

    // Remove honeypot from payload
    formData.delete("website_alt");

    // Validate textarea length
    const mensagem = formData.get("mensagem")?.toString() || "";
    if (mensagem.length > 500) {
      setStatus("error");
      setErrorMsg("A mensagem não pode exceder 500 caracteres.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch("https://readdy.ai/api/form/d9fd388jnu01ovhhkvt0", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>),
      });
      const responseText = await response.text();
      let parsed: { code?: string; meta?: { message?: string; detail?: string }; message?: string } | null = null;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = null;
      }

      const serverMsg =
        parsed?.meta?.message ||
        parsed?.meta?.detail ||
        parsed?.message ||
        responseText;

      if (
        !response.ok ||
        !parsed ||
        parsed.code !== "OK" ||
        serverMsg.toLowerCase().includes("spam") ||
        serverMsg.toLowerCase().includes("form data is spam")
      ) {
        setStatus("error");
        setErrorMsg(serverMsg || "Ocorreu um erro ao enviar. Por favor tenta novamente.");
        return;
      }

      setStatus("success");
      form.reset();
      setCharCount(0);
    } catch {
      setStatus("error");
      setErrorMsg("Ocorreu um erro de rede. Por favor tenta novamente.");
    }
  };

  return (
    <section className="w-full px-4 md:px-10 py-16 md:py-24 bg-background-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-100 border border-accent-200/60 text-accent-800 text-xs uppercase tracking-[0.24em] font-label whitespace-nowrap">
            <i className="ri-send-plane-line w-3 h-3 flex items-center justify-center" />
            Enviar mensagem
          </span>
          <h2 className="mt-5 font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight">
            Tens alguma dúvida ou encomenda especial?
          </h2>
          <p className="mt-4 text-base text-foreground-700 leading-relaxed max-w-md">
            Responderemos o mais breve possível — normalmente dentro de algumas horas em dias úteis.
            Para encomendas urgentes, recomendamos o telefone.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 shrink-0">
                <i className="ri-shield-check-line text-lg w-5 h-5 flex items-center justify-center" />
              </div>
              <div>
                <h4 className="font-heading text-base font-semibold text-foreground-950">
                  Resposta rápida
                </h4>
                <p className="text-sm text-foreground-600 mt-1">
                  Respondemos a todas as mensagens em menos de 24h em dias úteis.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 flex items-center justify-center rounded-full bg-accent-100 text-accent-600 shrink-0">
                <i className="ri-lock-line text-lg w-5 h-5 flex items-center justify-center" />
              </div>
              <div>
                <h4 className="font-heading text-base font-semibold text-foreground-950">
                  Dados protegidos
                </h4>
                <p className="text-sm text-foreground-600 mt-1">
                  Os teus dados são tratados com confidencialidade e nunca partilhados.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 flex items-center justify-center rounded-full bg-secondary-100 text-secondary-600 shrink-0">
                <i className="ri-customer-service-2-line text-lg w-5 h-5 flex items-center justify-center" />
              </div>
              <div>
                <h4 className="font-heading text-base font-semibold text-foreground-950">
                  Atendimento personalizado
                </h4>
                <p className="text-sm text-foreground-600 mt-1">
                  Cada encomenda é tratada com atenção individual pelo Chef e equipa.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-background-50 border border-background-200/70 p-6 md:p-8">
          <form
            id="form-contacto-manger"
            data-readdy-form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Honeypot */}
            <div className="form-safety-net">
              <input
                type="text"
                name="website_alt"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-foreground-800 mb-1.5">
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  placeholder="O teu nome"
                  className="w-full px-4 py-3 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground-800 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="email@exemplo.pt"
                  className="w-full px-4 py-3 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-foreground-800 mb-1.5">
                  Telemóvel
                </label>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  placeholder="+351 000 000 000"
                  className="w-full px-4 py-3 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
                />
              </div>
              <div>
                <label htmlFor="assunto" className="block text-sm font-medium text-foreground-800 mb-1.5">
                  Assunto
                </label>
                <select
                  id="assunto"
                  name="assunto"
                  required
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all appearance-none"
                  style={{ backgroundImage: "none" }}
                >
                  <option value="" disabled>
                    Seleciona um assunto
                  </option>
                  {assuntos.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="mensagem" className="block text-sm font-medium text-foreground-800 mb-1.5">
                Mensagem
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                required
                rows={5}
                maxLength={500}
                placeholder="Conta-nos o que precisas..."
                onChange={(e) => setCharCount(e.target.value.length)}
                className="w-full px-4 py-3 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all resize-none"
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${charCount > 450 ? "text-primary-600" : "text-foreground-400"}`}>
                  {charCount}/500
                </span>
              </div>
            </div>

            {status === "error" && errorMsg && (
              <div className="rounded-lg bg-primary-50 border border-primary-200 p-4 flex items-start gap-3">
                <i className="ri-error-warning-line text-primary-600 mt-0.5 w-5 h-5 flex items-center justify-center shrink-0" />
                <p className="text-sm text-primary-800">{errorMsg}</p>
              </div>
            )}

            {status === "success" && (
              <div className="rounded-lg bg-accent-50 border border-accent-200 p-4 flex items-start gap-3">
                <i className="ri-checkbox-circle-line text-accent-600 mt-0.5 w-5 h-5 flex items-center justify-center shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-accent-900">Mensagem enviada com sucesso!</p>
                  <p className="text-sm text-accent-800 mt-0.5">
                    Obrigado pelo contacto. Responderemos em breve.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors"
            >
              {status === "loading" ? (
                <>
                  <i className="ri-loader-4-line animate-spin w-5 h-5 flex items-center justify-center" />
                  A enviar...
                </>
              ) : (
                <>
                  <i className="ri-send-plane-line w-5 h-5 flex items-center justify-center" />
                  Enviar mensagem
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}