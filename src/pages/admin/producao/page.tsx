import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";
import { supabase } from "@/lib/supabase";
import QRCodeLib from "qrcode";

interface Horario {
  id: number;
  dia_semana: number;
  ativo: boolean;
  encomendas_abertura: string | null;
  encomendas_fecho: string | null;
  levantamento_abertura: string | null;
  levantamento_fecho: string | null;
}

const DIAS_SEMANA = [
  { valor: 0, label: "Domingo" },
  { valor: 1, label: "Segunda-feira" },
  { valor: 2, label: "Terca-feira" },
  { valor: 3, label: "Quarta-feira" },
  { valor: 4, label: "Quinta-feira" },
  { valor: 5, label: "Sexta-feira" },
  { valor: 6, label: "Sabado" },
];

export default function AdminProducaoPage() {
  const navigate = useNavigate();
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // QR-Code state
  const QR_FIELD_KEYS = ["nome", "telemovel", "email", "aniversario", "nif"];
  const [qrFields, setQrFields] = useState<string[]>(() => [...QR_FIELD_KEYS]);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrGenerating, setQrGenerating] = useState(false);
  const qrPrintRef = useRef<HTMLDivElement>(null);

  // Dados bancários
  const [dadosBancarios, setDadosBancarios] = useState({ entidade: "", referencia_multibanco: "", iban: "" });
  const [savingBancario, setSavingBancario] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("manger_admin_session");
    if (!session) {
      navigate("/admin");
      return;
    }
    carregarHorarios();
    carregarDadosBancarios();
  }, [navigate]);

  async function carregarHorarios() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("horarios_funcionamento")
        .select("*")
        .order("dia_semana", { ascending: true });

      if (error) throw error;
      setHorarios(data || []);
    } catch (err: any) {
      setFeedback({ type: "error", msg: err?.message || "Erro ao carregar horarios." });
    } finally {
      setLoading(false);
    }
  }

  function toggleDia(diaSemana: number) {
    setHorarios((prev) =>
      prev.map((h) =>
        h.dia_semana === diaSemana ? { ...h, ativo: !h.ativo } : h
      )
    );
  }

  function updateHorario(
    diaSemana: number,
    campo: "encomendas_abertura" | "encomendas_fecho" | "levantamento_abertura" | "levantamento_fecho",
    valor: string
  ) {
    setHorarios((prev) =>
      prev.map((h) =>
        h.dia_semana === diaSemana ? { ...h, [campo]: valor } : h
      )
    );
  }

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    try {
      const updates = horarios.map((h) => ({
        id: h.id,
        dia_semana: h.dia_semana,
        ativo: h.ativo,
        encomendas_abertura: h.ativo ? h.encomendas_abertura : null,
        encomendas_fecho: h.ativo ? h.encomendas_fecho : null,
        levantamento_abertura: h.ativo ? h.levantamento_abertura : null,
        levantamento_fecho: h.ativo ? h.levantamento_fecho : null,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("horarios_funcionamento")
        .upsert(updates, { onConflict: "dia_semana" });

      if (error) throw error;
      setFeedback({ type: "success", msg: "Horarios guardados com sucesso!" });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: "error", msg: err?.message || "Erro ao guardar horarios." });
    } finally {
      setSaving(false);
    }
  }

  function toggleQrField(field: string) {
    setQrFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
    setQrDataUrl(null);
  }

  async function handleGerarQR() {
    if (qrFields.length === 0) {
      setFeedback({ type: "error", msg: "Selecione pelo menos um campo para gerar o QR-Code." });
      return;
    }
    setQrGenerating(true);
    setFeedback(null);
    try {
      const basePath = (window as any).__BASE_PATH__ || "";
      const pathPrefix = basePath ? `/${String(basePath).replace(/^\/|\/$/g, "")}` : "";
      const url = `${window.location.origin}${pathPrefix}/levantamento?fields=${qrFields.join(",")}`;
      const dataUrl = await QRCodeLib.toDataURL(url, { width: 300, margin: 2, color: { dark: "#1a1a1a", light: "#ffffff" } });
      setQrDataUrl(dataUrl);
    } catch (err: any) {
      setFeedback({ type: "error", msg: "Erro ao gerar QR-Code." });
    } finally {
      setQrGenerating(false);
    }
  }

  function handlePrintQR() {
    if (!qrDataUrl) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR-Code Levantamento - manger.pt</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; font-family: system-ui, sans-serif; }
              .container { text-align: center; padding: 40px; }
              img { max-width: 300px; width: 100%; height: auto; }
              h2 { font-size: 18px; color: #333; margin-bottom: 24px; }
              p { font-size: 13px; color: #888; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>manger.pt - Levantamento na Loja</h2>
              <img src="${qrDataUrl}" alt="QR-Code Levantamento" />
              <p>Aponte a camara do seu smartphone para este QR-Code</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 300);
    }
  }

  async function carregarDadosBancarios() {
    try {
      const { data, error } = await supabase
        .from("dados_bancarios")
        .select("entidade, referencia_multibanco, iban")
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setDadosBancarios({
          entidade: data.entidade || "",
          referencia_multibanco: data.referencia_multibanco || "",
          iban: data.iban || "",
        });
      }
    } catch {
      // silently fail, user can still edit
    }
  }

  async function handleSaveBancario() {
    setSavingBancario(true);
    setFeedback(null);
    try {
      const { error } = await supabase
        .from("dados_bancarios")
        .upsert({
          id: 1,
          entidade: dadosBancarios.entidade,
          referencia_multibanco: dadosBancarios.referencia_multibanco,
          iban: dadosBancarios.iban,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });

      if (error) throw error;
      setFeedback({ type: "success", msg: "Dados bancarios guardados com sucesso!" });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: "error", msg: err?.message || "Erro ao guardar dados bancarios." });
    } finally {
      setSavingBancario(false);
    }
  }

  return (
    <div className="min-h-[100dvh] flex bg-background-50">
      <AdminSidebar activeHref="/admin/producao" title="Producao" />

      <main className="flex-1 lg:pt-0 pt-14">
        <div className="px-4 md:px-8 py-6 md:py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <i className="ri-restaurant-line text-xl w-5 h-5 flex items-center justify-center" />
            </div>
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">Producao</h1>
              <p className="text-sm text-foreground-600">Horario de Funcionamento · Configuracao de disponibilidade</p>
            </div>
          </div>

          {feedback && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
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

          <div className="rounded-xl bg-background-100 border border-background-200/70 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground-950">
                  Horario de Funcionamento
                </h2>
                <p className="text-sm text-foreground-600 mt-1">
                  Defina os dias e horarios em que o manger.pt esta aberto para encomendas e levantamento na loja.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i
                  className={`${
                    saving ? "ri-loader-2-line animate-spin" : "ri-check-line"
                  } w-4 h-4 flex items-center justify-center`}
                />
                {saving ? "A guardar..." : "Guardar"}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <i className="ri-loader-2-line animate-spin text-2xl w-8 h-8 flex items-center justify-center text-foreground-400" />
              </div>
            ) : (
              <>
                {/* Cabeçalho da tabela - visível só em desktop */}
                <div className="hidden md:grid grid-cols-[1fr_80px_1fr_1fr_1fr_1fr] gap-3 mb-3 px-3">
                  <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">Dia</span>
                  <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider text-center">Ativo</span>
                  <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">Enc. Abertura</span>
                  <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">Enc. Fecho</span>
                  <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">Lev. Abertura</span>
                  <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">Lev. Fecho</span>
                </div>

                <div className="space-y-2">
                  {horarios.map((h) => (
                    <div
                      key={h.dia_semana}
                      className={`rounded-xl border transition-colors ${
                        h.ativo
                          ? "bg-background-50 border-background-200/70"
                          : "bg-background-100/50 border-background-200/40"
                      }`}
                    >
                      {/* Mobile layout */}
                      <div className="md:hidden p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-foreground-900">
                            {DIAS_SEMANA[h.dia_semana]?.label}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleDia(h.dia_semana)}
                            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                              h.ativo ? "bg-primary-500" : "bg-background-300"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-background-50 transition-transform ${
                                h.ativo ? "left-[22px]" : "left-0.5"
                              }`}
                            />
                          </button>
                        </div>

                        {h.ativo && (
                          <div className="space-y-3">
                            <div className="bg-background-100 rounded-lg p-3">
                              <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider block mb-2">
                                Encomendas
                              </span>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-foreground-500 block mb-1">Abertura</label>
                                  <input
                                    type="time"
                                    value={h.encomendas_abertura || ""}
                                    onChange={(e) => updateHorario(h.dia_semana, "encomendas_abertura", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-foreground-500 block mb-1">Fecho</label>
                                  <input
                                    type="time"
                                    value={h.encomendas_fecho || ""}
                                    onChange={(e) => updateHorario(h.dia_semana, "encomendas_fecho", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-colors"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="bg-background-100 rounded-lg p-3">
                              <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider block mb-2">
                                Levantamento
                              </span>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-foreground-500 block mb-1">Abertura</label>
                                  <input
                                    type="time"
                                    value={h.levantamento_abertura || ""}
                                    onChange={(e) => updateHorario(h.dia_semana, "levantamento_abertura", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-foreground-500 block mb-1">Fecho</label>
                                  <input
                                    type="time"
                                    value={h.levantamento_fecho || ""}
                                    onChange={(e) => updateHorario(h.dia_semana, "levantamento_fecho", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-colors"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {!h.ativo && (
                          <p className="text-xs text-foreground-400 mt-1">Dia sem atendimento</p>
                        )}
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden md:grid grid-cols-[1fr_80px_1fr_1fr_1fr_1fr] gap-3 items-center p-3">
                        <span className="text-sm font-medium text-foreground-900 pl-1">
                          {DIAS_SEMANA[h.dia_semana]?.label}
                        </span>

                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => toggleDia(h.dia_semana)}
                            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                              h.ativo ? "bg-primary-500" : "bg-background-300"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-background-50 transition-transform ${
                                h.ativo ? "left-[22px]" : "left-0.5"
                              }`}
                            />
                          </button>
                        </div>

                        {h.ativo ? (
                          <>
                            <input
                              type="time"
                              value={h.encomendas_abertura || ""}
                              onChange={(e) => updateHorario(h.dia_semana, "encomendas_abertura", e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-colors"
                            />
                            <input
                              type="time"
                              value={h.encomendas_fecho || ""}
                              onChange={(e) => updateHorario(h.dia_semana, "encomendas_fecho", e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-colors"
                            />
                            <input
                              type="time"
                              value={h.levantamento_abertura || ""}
                              onChange={(e) => updateHorario(h.dia_semana, "levantamento_abertura", e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-colors"
                            />
                            <input
                              type="time"
                              value={h.levantamento_fecho || ""}
                              onChange={(e) => updateHorario(h.dia_semana, "levantamento_fecho", e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-colors"
                            />
                          </>
                        ) : (
                          <>
                            <span className="text-xs text-foreground-400 px-3">—</span>
                            <span className="text-xs text-foreground-400 px-3">—</span>
                            <span className="text-xs text-foreground-400 px-3">—</span>
                            <span className="text-xs text-foreground-400 px-3">—</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-background-200/50 flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-foreground-500">
                    <span className="inline-block w-3 h-3 rounded-sm bg-primary-500" />
                    Dias ativos
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground-500">
                    <span className="inline-block w-3 h-3 rounded-sm bg-background-300" />
                    Dias inativos
                  </div>
                  <span className="text-xs text-foreground-400 ml-auto">
                    {horarios.filter((h) => h.ativo).length} de {horarios.length} dias ativos
                  </span>
                </div>
              </>
            )}
          </div>

          {/* ─── QR-CODE LEVANTAMENTO ─── */}
          <div className="rounded-xl bg-background-100 border border-background-200/70 p-6 md:p-8 mt-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground-950">
                  QR-Code de Levantamento
                </h2>
                <p className="text-sm text-foreground-600 mt-1">
                  Configure os campos do formulario e gere o QR-Code para os clientes fazerem levantamento na loja.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
              {/* Coluna esquerda: seleção de campos */}
              <div>
                <h3 className="text-sm font-semibold text-foreground-800 mb-4">
                  Campos do formulario
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-background-50 border border-background-200/70 cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={qrFields.includes("nome")}
                      onChange={() => toggleQrField("nome")}
                      className="w-5 h-5 rounded-md border-background-300 text-primary-500 focus:ring-primary-400 cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground-900">Nome + Apelido</span>
                      <span className="text-xs text-red-500 ml-1">*</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-background-50 border border-background-200/70 cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={qrFields.includes("telemovel")}
                      onChange={() => toggleQrField("telemovel")}
                      className="w-5 h-5 rounded-md border-background-300 text-primary-500 focus:ring-primary-400 cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground-900">Telemovel</span>
                      <span className="text-xs text-red-500 ml-1">*</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-background-50 border border-background-200/70 cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={qrFields.includes("email")}
                      onChange={() => toggleQrField("email")}
                      className="w-5 h-5 rounded-md border-background-300 text-primary-500 focus:ring-primary-400 cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground-900">Email</span>
                      <span className="text-xs text-red-500 ml-1">*</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-background-50 border border-background-200/70 cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={qrFields.includes("aniversario")}
                      onChange={() => toggleQrField("aniversario")}
                      className="w-5 h-5 rounded-md border-background-300 text-primary-500 focus:ring-primary-400 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-foreground-900">Dia/mes de aniversario</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-background-50 border border-background-200/70 cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={qrFields.includes("nif")}
                      onChange={() => toggleQrField("nif")}
                      className="w-5 h-5 rounded-md border-background-300 text-primary-500 focus:ring-primary-400 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-foreground-900">NIF (opcional)</span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleGerarQR}
                  disabled={qrGenerating || qrFields.length === 0}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {qrGenerating ? (
                    <>
                      <i className="ri-loader-2-line animate-spin w-4 h-4 flex items-center justify-center" />
                      A gerar...
                    </>
                  ) : (
                    <>
                      <i className="ri-qr-code-line w-4 h-4 flex items-center justify-center" />
                      Gerar QR-Code
                    </>
                  )}
                </button>
              </div>

              {/* Coluna direita: preview do QR */}
              <div className="flex flex-col items-center justify-start">
                <h3 className="text-sm font-semibold text-foreground-800 mb-4 self-start">
                  Pre-visualizacao
                </h3>
                <div
                  ref={qrPrintRef}
                  className="w-full aspect-square max-w-[280px] rounded-2xl border-2 border-dashed border-background-300 bg-background-50 flex items-center justify-center transition-all"
                >
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="QR-Code para levantamento"
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="text-center px-4">
                      <i className="ri-qr-code-line text-4xl w-10 h-10 flex items-center justify-center text-foreground-300 mx-auto mb-2" />
                      <p className="text-xs text-foreground-400">
                        {qrFields.length === 0
                          ? "Selecione os campos e clique em Gerar QR-Code"
                          : "Clique em Gerar QR-Code"}
                      </p>
                    </div>
                  )}
                </div>

                {qrDataUrl && (
                  <button
                    type="button"
                    onClick={handlePrintQR}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-background-50 border border-background-200/70 hover:border-background-300 text-foreground-700 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors"
                  >
                    <i className="ri-printer-line w-4 h-4 flex items-center justify-center" />
                    Imprimir QR-Code
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ─── DADOS BANCARIOS ─── */}
          <div className="rounded-xl bg-background-100 border border-background-200/70 p-6 md:p-8 mt-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground-950">
                  Dados Bancarios
                </h2>
                <p className="text-sm text-foreground-600 mt-1">
                  Configure os dados que aparecem nas instrucoes de pagamento para Multibanco e Transferencia Bancaria.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveBancario}
                disabled={savingBancario}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i
                  className={`${
                    savingBancario ? "ri-loader-2-line animate-spin" : "ri-check-line"
                  } w-4 h-4 flex items-center justify-center`}
                />
                {savingBancario ? "A guardar..." : "Guardar"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-foreground-800 mb-1.5">
                  <i className="ri-bank-line w-4 h-4 inline-flex items-center justify-center mr-1.5 text-foreground-500" />
                  Entidade (Multibanco)
                </label>
                <input
                  type="text"
                  value={dadosBancarios.entidade}
                  onChange={(e) =>
                    setDadosBancarios((prev) => ({ ...prev, entidade: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                  placeholder="Ex: 12345"
                  maxLength={5}
                />
                <p className="text-xs text-foreground-400 mt-1">Codigo de 5 digitos da entidade</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-800 mb-1.5">
                  <i className="ri-barcode-line w-4 h-4 inline-flex items-center justify-center mr-1.5 text-foreground-500" />
                  Referencia Multibanco
                </label>
                <input
                  type="text"
                  value={dadosBancarios.referencia_multibanco}
                  onChange={(e) =>
                    setDadosBancarios((prev) => ({ ...prev, referencia_multibanco: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                  placeholder="Ex: 123 456 789"
                  maxLength={20}
                />
                <p className="text-xs text-foreground-400 mt-1">9 digitos, agrupados de 3 em 3</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-800 mb-1.5">
                  <i className="ri-exchange-line w-4 h-4 inline-flex items-center justify-center mr-1.5 text-foreground-500" />
                  IBAN
                </label>
                <input
                  type="text"
                  value={dadosBancarios.iban}
                  onChange={(e) =>
                    setDadosBancarios((prev) => ({ ...prev, iban: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                  placeholder="Ex: PT50 0000 0000 0000 0000 0000 0"
                  maxLength={34}
                />
                <p className="text-xs text-foreground-400 mt-1">IBAN para transferencia bancaria</p>
              </div>
            </div>

            <p className="text-xs text-foreground-400 mt-5 flex items-center gap-1.5">
              <i className="ri-information-line w-4 h-4 flex items-center justify-center" />
              Estes dados serao exibidos ao cliente apos selecionar Multibanco ou Transferencia Bancaria no checkout.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}