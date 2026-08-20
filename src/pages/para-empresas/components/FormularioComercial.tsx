import { useState, type FormEvent } from "react";

const tiposEstabelecimento = [
  "Restaurante",
  "Hotel",
  "Catering",
  "Espaço para eventos",
  "Cafetaria",
  "Outro",
];

const interesses = [
  "Fornecimento regular",
  "Pedidos conforme necessidade",
  "Menu sazonal",
  "Produto exclusivo",
  "Eventos",
  "Degustação",
  "Ainda estou a avaliar",
];

export default function FormularioComercial() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [erroMsg, setErroMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const honeypot = (formData.get("company_alt") as string || "").trim();
    if (honeypot) {
      setStatus("success");
      form.reset();
      return;
    }

    formData.delete("company_alt");

    setStatus("loading");
    setErroMsg("");

    try {
      const response = await fetch("https://readdy.ai/api/form/d9floqulb8e5uktkmudg", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>),
      });

      const responseText = await response.text();
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = null;
      }

      const serverMsg =
        parsed?.meta?.message || parsed?.message || parsed?.meta?.detail || responseText || "";

      if (parsed?.code === "OK" || (response.ok && !serverMsg.toLowerCase().includes("spam"))) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErroMsg(serverMsg || "Ocorreu um erro ao enviar. Tente novamente.");
      }
    } catch {
      setStatus("error");
      setErroMsg("Erro de ligação. Verifique a sua internet e tente novamente.");
    }
  };

  return (
    <section id="formulario-comercial" className="bg-background-100 py-20 md:py-24 texture-paper">
      <div className="w-full px-4 md:px-10 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-600 mb-4">
            <span className="w-8 h-px bg-primary-400" />
            Contacto comercial
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight mb-4">
            Vamos criar uma oferta à medida do seu estabelecimento
          </h2>
          <p className="text-base text-foreground-600 max-w-xl mx-auto">
            Conte-nos um pouco sobre o seu hotel, restaurante ou projeto. A equipa da Manger.pt entrará em contacto para compreender a sua necessidade e apresentar uma proposta adequada.
          </p>
        </div>

        {status === "success" ? (
          <div className="p-8 rounded-2xl bg-accent-100 border border-accent-200 text-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-accent-500 text-background-50 mx-auto mb-4">
              <i className="ri-check-line text-2xl w-7 h-7 flex items-center justify-center" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground-950 mb-2">
              Obrigado pelo seu interesse
            </h3>
            <p className="text-sm text-foreground-600 leading-relaxed">
              Recebemos o seu pedido e entraremos em contacto para conhecer melhor o seu estabelecimento e preparar uma proposta adequada.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            data-readdy-form
            id="form-b2b-comercial"
            className="p-6 md:p-8 rounded-2xl bg-background-50 border border-background-200/70"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="b2b-nome" className="block text-sm font-medium text-foreground-700 mb-1.5">
                  Nome <span className="text-primary-500">*</span>
                </label>
                <input
                  id="b2b-nome"
                  name="nome"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  placeholder="O seu nome"
                />
              </div>
              <div>
                <label htmlFor="b2b-empresa" className="block text-sm font-medium text-foreground-700 mb-1.5">
                  Empresa ou estabelecimento <span className="text-primary-500">*</span>
                </label>
                <input
                  id="b2b-empresa"
                  name="empresa"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  placeholder="Nome do restaurante ou hotel"
                />
              </div>
              <div>
                <label htmlFor="b2b-cargo" className="block text-sm font-medium text-foreground-700 mb-1.5">
                  Cargo <span className="text-primary-500">*</span>
                </label>
                <input
                  id="b2b-cargo"
                  name="cargo"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  placeholder="Ex: Chef Executivo, Gerente"
                />
              </div>
              <div>
                <label htmlFor="b2b-email" className="block text-sm font-medium text-foreground-700 mb-1.5">
                  E-mail <span className="text-primary-500">*</span>
                </label>
                <input
                  id="b2b-email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  placeholder="email@empresa.pt"
                />
              </div>
              <div>
                <label htmlFor="b2b-telefone" className="block text-sm font-medium text-foreground-700 mb-1.5">
                  Telefone <span className="text-primary-500">*</span>
                </label>
                <input
                  id="b2b-telefone"
                  name="telefone"
                  type="tel"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  placeholder="+351 000 000 000"
                />
              </div>
              <div>
                <label htmlFor="b2b-localidade" className="block text-sm font-medium text-foreground-700 mb-1.5">
                  Localidade <span className="text-primary-500">*</span>
                </label>
                <input
                  id="b2b-localidade"
                  name="localidade"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  placeholder="Cidade ou região"
                />
              </div>
              <div>
                <label htmlFor="b2b-tipo" className="block text-sm font-medium text-foreground-700 mb-1.5">
                  Tipo de estabelecimento <span className="text-primary-500">*</span>
                </label>
                <select
                  id="b2b-tipo"
                  name="tipo_estabelecimento"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                >
                  <option value="">Selecionar...</option>
                  {tiposEstabelecimento.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="b2b-interesse" className="block text-sm font-medium text-foreground-700 mb-1.5">
                  Interesse principal <span className="text-primary-500">*</span>
                </label>
                <select
                  id="b2b-interesse"
                  name="interesse"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                >
                  <option value="">Selecionar...</option>
                  {interesses.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="b2b-website" className="block text-sm font-medium text-foreground-700 mb-1.5">
                  Website ou Instagram
                </label>
                <input
                  id="b2b-website"
                  name="website"
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  placeholder="www.empresa.pt ou @instagram"
                />
              </div>
              <div>
                <label htmlFor="b2b-clientes" className="block text-sm font-medium text-foreground-700 mb-1.5">
                  Clientes médios por dia
                </label>
                <input
                  id="b2b-clientes"
                  name="clientes_dia"
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  placeholder="Ex: 80"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="b2b-mensagem" className="block text-sm font-medium text-foreground-700 mb-1.5">
                Mensagem <span className="text-primary-500">*</span>
              </label>
              <textarea
                id="b2b-mensagem"
                name="mensagem"
                required
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 resize-none"
                placeholder="Conte-nos sobre o seu estabelecimento, necessidades e o que procura..."
              />
              <p className="text-xs text-foreground-400 mt-1">Máximo 500 caracteres</p>
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consentimento"
                  required
                  className="mt-0.5 w-4 h-4 rounded border-background-300 text-primary-500 focus:ring-primary-300"
                />
                <span className="text-sm text-foreground-600 leading-relaxed">
                  Autorizo o contacto da Manger.pt para responder ao meu pedido e apresentar informações comerciais.
                </span>
              </label>
            </div>

            <input
              type="text"
              name="company_alt"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              readOnly
              className="form-safety-net"
            />

            {erroMsg && (
              <div className="mb-4 p-4 rounded-lg bg-primary-100 border border-primary-200 text-primary-800 text-sm">
                {erroMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary-500 text-background-50 text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                  A enviar...
                </>
              ) : (
                <>
                  <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center" />
                  Solicitar contacto
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}