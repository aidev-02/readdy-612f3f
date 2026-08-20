import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";

const FIELD_LABELS: Record<string, string> = {
  nome: "Nome + Apelido",
  telemovel: "Telemóvel",
  email: "Email",
  aniversario: "Dia/mês de aniversário",
  nif: "NIF (opcional)",
};

function gerarCodigo(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function useQuery() {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

export default function LevantamentoPage() {
  const query = useQuery();
  const fieldsParam = query.get("fields") || "nome,telemovel,email,aniversario,nif";
  const enabledFields = fieldsParam.split(",").filter(Boolean);

  const [formData, setFormData] = useState<Record<string, string>>({
    nome: "",
    telemovel: "",
    email: "",
    aniversario: "",
    nif: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [codigoGerado, setCodigoGerado] = useState<string | null>(null);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (codigoGerado) setCodigoGerado(null);
  }

  function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidTelemovel(tel: string): boolean {
    return /^[0-9]{9,}$/.test(tel.replace(/\s/g, ""));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    // Validar campos obrigatórios
    if (enabledFields.includes("nome") && !formData.nome.trim()) {
      setFeedback({ type: "error", msg: "O campo Nome + Apelido é obrigatório." });
      return;
    }
    if (enabledFields.includes("telemovel")) {
      if (!formData.telemovel.trim()) {
        setFeedback({ type: "error", msg: "O campo Telemóvel é obrigatório." });
        return;
      }
      if (!isValidTelemovel(formData.telemovel)) {
        setFeedback({ type: "error", msg: "Insira um número de telemóvel válido (mínimo 9 dígitos)." });
        return;
      }
    }
    if (enabledFields.includes("email")) {
      if (!formData.email.trim()) {
        setFeedback({ type: "error", msg: "O campo Email é obrigatório." });
        return;
      }
      if (!isValidEmail(formData.email)) {
        setFeedback({ type: "error", msg: "Insira um email válido." });
        return;
      }
    }

    // Gerar código único
    let codigo = gerarCodigo();
    let tentativas = 0;
    while (tentativas < 5) {
      const { data: existente } = await supabase
        .from("levantamentos")
        .select("id")
        .eq("codigo_levantamento", codigo)
        .maybeSingle();
      if (!existente) break;
      codigo = gerarCodigo();
      tentativas++;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("levantamentos").insert({
        nome_apelido: formData.nome,
        telemovel: formData.telemovel,
        email: formData.email,
        aniversario: formData.aniversario || "",
        nif: formData.nif || null,
        codigo_levantamento: codigo,
      });

      if (error) throw error;

      setCodigoGerado(codigo);
      setFeedback({ type: "success", msg: "Código gerado com sucesso!" });
    } catch (err: any) {
      setFeedback({ type: "error", msg: err?.message || "Erro ao gerar código. Tente novamente." });
    } finally {
      setLoading(false);
    }
  }

  function handleNovo() {
    setCodigoGerado(null);
    setFeedback(null);
    setFormData({ nome: "", telemovel: "", email: "", aniversario: "", nif: "" });
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background-50">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Card Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <i className="ri-qr-code-line text-2xl w-6 h-6 flex items-center justify-center" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">
              Levantamento na Loja
            </h1>
            <p className="text-sm text-foreground-600 mt-2">
              Preencha os dados para gerar o seu código de levantamento
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-background-200/70 p-6 md:p-8">
            {codigoGerado ? (
              /* CÓDIGO GERADO */
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                  <i className="ri-check-double-line text-3xl w-8 h-8 flex items-center justify-center" />
                </div>
                <p className="text-sm text-foreground-600 mb-2">O seu código de levantamento é:</p>
                <div className="bg-background-100 rounded-xl py-6 px-4 mb-6 border border-background-200/70">
                  <span className="font-heading text-4xl md:text-5xl font-bold text-foreground-950 tracking-[0.3em]">
                    {codigoGerado}
                  </span>
                </div>
                <p className="text-xs text-foreground-500 mb-6">
                  Apresente este código na loja para recolher a sua encomenda.
                </p>
                <button
                  type="button"
                  onClick={handleNovo}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
                >
                  <i className="ri-refresh-line w-4 h-4 flex items-center justify-center" />
                  Novo levantamento
                </button>
              </div>
            ) : (
              /* FORMULÁRIO */
              <form onSubmit={handleSubmit} noValidate>
                {feedback && (
                  <div
                    className={`mb-5 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      feedback.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    <i
                      className={`${
                        feedback.type === "success" ? "ri-checkbox-circle-line" : "ri-error-warning-line"
                      } w-5 h-5 flex items-center justify-center`}
                    />
                    {feedback.msg}
                  </div>
                )}

                <div className="space-y-4">
                  {enabledFields.includes("nome") && (
                    <div>
                      <label className="block text-sm font-medium text-foreground-700 mb-1.5">
                        Nome + Apelido <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => updateField("nome", e.target.value)}
                        placeholder="O seu nome completo"
                        className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                        required={enabledFields.includes("nome")}
                      />
                    </div>
                  )}

                  {enabledFields.includes("telemovel") && (
                    <div>
                      <label className="block text-sm font-medium text-foreground-700 mb-1.5">
                        Telemóvel <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.telemovel}
                        onChange={(e) => updateField("telemovel", e.target.value)}
                        placeholder="Ex: 912345678"
                        className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                        required={enabledFields.includes("telemovel")}
                      />
                    </div>
                  )}

                  {enabledFields.includes("email") && (
                    <div>
                      <label className="block text-sm font-medium text-foreground-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="o-seu@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                        required={enabledFields.includes("email")}
                      />
                    </div>
                  )}

                  {enabledFields.includes("aniversario") && (
                    <div>
                      <label className="block text-sm font-medium text-foreground-700 mb-1.5">
                        Dia/mês de aniversário
                      </label>
                      <input
                        type="text"
                        value={formData.aniversario}
                        onChange={(e) => updateField("aniversario", e.target.value)}
                        placeholder="DD/MM"
                        maxLength={5}
                        className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                      />
                    </div>
                  )}

                  {enabledFields.includes("nif") && (
                    <div>
                      <label className="block text-sm font-medium text-foreground-700 mb-1.5">
                        NIF <span className="text-foreground-400 font-normal">(opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.nif}
                        onChange={(e) => updateField("nif", e.target.value)}
                        placeholder="O seu NIF"
                        className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-2-line animate-spin w-4 h-4 flex items-center justify-center" />
                      A gerar...
                    </>
                  ) : (
                    <>
                      <i className="ri-qr-scan-line w-4 h-4 flex items-center justify-center" />
                      GERAR CÓDIGO DE LEVANTAMENTO
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}