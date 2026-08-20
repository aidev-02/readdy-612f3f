import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

/* ------------------------------------------------------------------ */
/*  Helpers de Prazo de Entrega                                        */
/* ------------------------------------------------------------------ */

/** Converte uma string de antecedência (ex: "48h", "3d", "10 minutos", "30min") em horas. Default 48h. */
const parseAntecedencia = (val: string | null | undefined): number => {
  if (!val || val.trim() === "") return 48;
  const trimmed = val.trim().toLowerCase();
  // Dias: 3d, 2 dias, 1 dia
  if (trimmed.endsWith("d") || trimmed.includes("dia")) {
    const days = parseFloat(trimmed);
    return isNaN(days) ? 48 : days * 24;
  }
  // Horas: 48h, 24 horas, 1 hora
  if (trimmed.endsWith("h") || trimmed.includes("hora")) {
    const hours = parseFloat(trimmed);
    return isNaN(hours) ? 48 : hours;
  }
  // Minutos: 10m, 30 min, 45 minutos, 15 minuto
  if (trimmed.endsWith("m") || trimmed.includes("min")) {
    const minutes = parseFloat(trimmed);
    return isNaN(minutes) ? 48 : minutes / 60;
  }
  // Numérico puro → assume horas
  const num = parseFloat(trimmed);
  return isNaN(num) ? 48 : num;
};

/** Formata horas decimais em HH:mm (ex: 48 → "48:00", 0.166 → "00:10") */
const formatPrazoHoras = (horas: number): string => {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

interface PrazoInfo {
  display: string;
  percentConsumed: number;
  vencido: boolean;
}

/** Calcula tempo restante (HH:mm) e % consumido com base na antecedência do produto */
const calcPrazo = (createdAt: string, antecedenciaHoras: number): PrazoInfo | null => {
  if (!createdAt || antecedenciaHoras <= 0) return null;
  const now = new Date();
  const created = new Date(createdAt);
  if (isNaN(created.getTime())) return null;
  const elapsedMs = now.getTime() - created.getTime();
  const elapsedHoras = elapsedMs / (1000 * 60 * 60);
  const remainingHoras = antecedenciaHoras - elapsedHoras;
  const vencido = remainingHoras < 0;
  const percentConsumed = Math.min(100, Math.round((elapsedHoras / antecedenciaHoras) * 100));

  const absRemaining = Math.abs(remainingHoras);
  const h = Math.floor(absRemaining);
  const m = Math.floor((absRemaining - h) * 60);
  const sign = vencido ? "-" : "";

  return {
    display: `${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    percentConsumed,
    vencido,
  };
};

/** Devolve as classes de cor de fundo com base na % consumida */
const prazoBgClass = (pct: number): string => {
  if (pct < 50) return "bg-emerald-500/15 text-emerald-800";
  if (pct < 75) return "bg-amber-500/15 text-amber-800";
  return "bg-red-500/15 text-red-800";
};

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */
interface Orcamento {
  id: number;
  tipo_orcamento: string | null;
  produto_id: number | null;
  produto_nome: string | null;
  produto_descricao: string | null;
  produto_imagem: string | null;
  tamanho_id: number | null;
  tamanho_nome: string | null;
  formato: string | null;
  formato_especifico: string | null;
  quantidade: number | null;
  mensagem_especial: string | null;
  alergias_restricoes: string | null;
  informacoes_adicionais: string | null;
  data_limite: string | null;
  nome_destinatario: string;
  email: string;
  telemovel: string | null;
  possui_whatsapp: boolean | null;
  created_at: string;
  arquivo_proposta: string | null;
  funcao_cliente: string | null;
  nip_nif_cliente: string | null;
  estabelecimento: string | null;
  validade: number | null;
  pco_unit: number | null;
  pco_total: number | null;
  subtotal: number | null;
  desconto: number | null;
  total_orcamento: number | null;
  iva: number | null;
  prazos_pagamento: string | null;
  empresa_cliente: string | null;
  unidade: string | null;
}

interface OpcaoLista {
  id: number;
  nome: string;
}

interface OpcaoProduto {
  id: number;
  name: string;
}

/* ------------------------------------------------------------------ */
/*  Página principal                                                   */
/* ------------------------------------------------------------------ */
export default function AdminOrcamentosPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Orcamento | null>(null);
  const [antecedenciaMap, setAntecedenciaMap] = useState<Record<number, string>>({});
  const [gerandoProposta, setGerandoProposta] = useState(false);
  const [propostaStatus, setPropostaStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templateCacheRef = useRef<{
    templateId: number;
    updatedAt: string;
    arrayBuffer: ArrayBuffer;
    tags: { tag_template: string; campo_banco: string | null; mascara: string | null }[];
  } | null>(null);
  const [propostaProgress, setPropostaProgress] = useState<string>("");

  /* ---- estado de edição inline no detalhe ---- */
  const [editValidade, setEditValidade] = useState<number>(30);
  const [editPcoUnit, setEditPcoUnit] = useState<string>("");
  const [editDesconto, setEditDesconto] = useState<string>("0");
  const [editPrazosPagamento, setEditPrazosPagamento] = useState<string>("30");
  const [editQuantidade, setEditQuantidade] = useState<number>(1);
  const [editUnidade, setEditUnidade] = useState<string>("");
  const [editNome, setEditNome] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");
  const [editEmpresa, setEditEmpresa] = useState<string>("");
  const [editEstabelecimento, setEditEstabelecimento] = useState<string>("");
  const [editTelemovel, setEditTelemovel] = useState<string>("");
  const [editWhatsapp, setEditWhatsapp] = useState<string>("Não");
  const [editCargoFuncao, setEditCargoFuncao] = useState<string>("");
  const [editNipNif, setEditNipNif] = useState<string>("");
  const [editTipoOrcamento, setEditTipoOrcamento] = useState<string>("");
  const [editProdutoId, setEditProdutoId] = useState<number>(0);
  const [editTamanho, setEditTamanho] = useState<string>("");
  const [editFormato, setEditFormato] = useState<string>("");
  const [editFormatoEspecifico, setEditFormatoEspecifico] = useState<string>("");
  const [editDataLimite, setEditDataLimite] = useState<string>("");
  const [editMensagemEspecial, setEditMensagemEspecial] = useState<string>("");
  const [editAlergias, setEditAlergias] = useState<string>("");
  const [editInfoAdicionais, setEditInfoAdicionais] = useState<string>("");
  const [savingFields, setSavingFields] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ---- opções para listboxes ---- */
  const [opcoesTipos, setOpcoesTipos] = useState<OpcaoLista[]>([]);
  const [opcoesTamanhos, setOpcoesTamanhos] = useState<OpcaoLista[]>([]);
  const [opcoesFormatos, setOpcoesFormatos] = useState<OpcaoLista[]>([]);
  const [opcoesAlergenicos, setOpcoesAlergenicos] = useState<OpcaoLista[]>([]);
  const [opcoesProdutos, setOpcoesProdutos] = useState<OpcaoProduto[]>([]);

  /* ---- carregar opções das tabelas de cadastro ---- */
  const carregarOpcoes = useCallback(async () => {
    try {
      const [
        { data: tipos },
        { data: tamanhos },
        { data: formatos },
        { data: alergenicos },
        { data: produtos },
      ] = await Promise.all([
        supabase.from("admin_tipos_orcamento").select("id, nome").order("sort_order"),
        supabase.from("admin_tamanhos").select("id, nome").order("sort_order"),
        supabase.from("admin_formatos").select("id, nome").order("sort_order"),
        supabase.from("admin_alergenicos").select("id, nome").order("sort_order"),
        supabase.from("b2b_gallery_products").select("id, name").order("sort_order"),
      ]);
      if (tipos) setOpcoesTipos(tipos as OpcaoLista[]);
      if (tamanhos) setOpcoesTamanhos(tamanhos as OpcaoLista[]);
      if (formatos) setOpcoesFormatos(formatos as OpcaoLista[]);
      if (alergenicos) setOpcoesAlergenicos(alergenicos as OpcaoLista[]);
      if (produtos) setOpcoesProdutos(produtos as OpcaoProduto[]);
    } catch {
      // silencioso — os campos continuam como texto livre
    }
  }, []);

  /* ---- helpers para campos derivados ---- */
  const getIdOrcamento = (o: Orcamento): string => {
    if (!o.created_at) return "";
    const d = new Date(o.created_at);
    const year = d.getFullYear().toString();
    const idPadded = String(o.id).padStart(5, "0");
    return `${year}${idPadded}`;
  };

  const getNroProposta = (o: Orcamento): string => {
    const idOrc = getIdOrcamento(o);
    return idOrc ? `MGR${idOrc}` : "";
  };

  const carregar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [{ data, error: err }, { data: produtosData }] = await Promise.all([
        supabase
          .from("orcamentos")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("b2b_gallery_products")
          .select("id, antecedencia"),
      ]);

      if (err) throw err;

      setOrcamentos((data as Orcamento[]) || []);

      if (produtosData) {
        const map: Record<number, string> = {};
        (produtosData as { id: number; antecedencia: string | null }[]).forEach((p) => {
          if (p.antecedencia && p.antecedencia.trim() !== "") {
            map[p.id] = p.antecedencia;
          }
        });
        setAntecedenciaMap(map);
      }
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar orçamentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, []);

  // Auto-open detail from URL param (e.g. ?open=123)
  useEffect(() => {
    if (loading || orcamentos.length === 0) return;
    const openId = searchParams.get("open");
    if (!openId) return;
    const id = parseInt(openId, 10);
    if (isNaN(id)) return;
    const orc = orcamentos.find((o) => o.id === id);
    if (orc) {
      handleSelectOrcamento(orc);
      // Remove o parâmetro da URL sem recarregar
      const next = new URLSearchParams(searchParams);
      next.delete("open");
      setSearchParams(next, { replace: true });
    }
  }, [loading, orcamentos, searchParams, setSearchParams]);

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (d: string | null) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ---- formatar valor do orçamento para inserção no .docx ---- */
  const formatProposalValue = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "boolean") return val ? "Sim" : "Não";
    return String(val);
  };

  /* ---- formatar data com máscara (DD/MM/YYYY, DD-mmm-AAAA, etc.) ---- */
  const MESES_PT: Record<number, string> = {
    0: "jan", 1: "fev", 2: "mar", 3: "abr", 4: "mai", 5: "jun",
    6: "jul", 7: "ago", 8: "set", 9: "out", 10: "nov", 11: "dez",
  };
  const MESES_PT_FULL: Record<number, string> = {
    0: "janeiro", 1: "fevereiro", 2: "março", 3: "abril", 4: "maio", 5: "junho",
    6: "julho", 7: "agosto", 8: "setembro", 9: "outubro", 10: "novembro", 11: "dezembro",
  };
  const DIAS_SEMANA_PT: Record<number, string> = {
    0: "dom", 1: "seg", 2: "ter", 3: "qua", 4: "qui", 5: "sex", 6: "sab",
  };

  const formatDateWithMask = (raw: unknown, mask: string): string => {
    if (raw === null || raw === undefined || raw === "") return "";
    const d = new Date(raw as string);
    if (isNaN(d.getTime())) return String(raw);

    const DD = String(d.getDate()).padStart(2, "0");
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const AAAA = String(d.getFullYear());
    const YYYY = AAAA;
    const HH = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const mm_min = String(d.getMinutes()).padStart(2, "0");
    const ddd = DIAS_SEMANA_PT[d.getDay()];
    const mmm = MESES_PT[d.getMonth()];
    const mmmm = MESES_PT_FULL[d.getMonth()];

    let result = mask;
    result = result.replace(/mmmm/g, mmmm);
    result = result.replace(/mmm/g, mmm);
    result = result.replace(/AAAA/g, AAAA);
    result = result.replace(/YYYY/g, YYYY);
    result = result.replace(/DD/g, DD);
    result = result.replace(/MM/g, MM);
    result = result.replace(/HH/g, HH);
    result = result.replace(/mm/g, mm_min);
    result = result.replace(/ddd/g, ddd);
    return result;
  };

  /* ---- download do ficheiro de proposta gerado ---- */
  const handleDownloadProposta = async (arquivo: string) => {
    try {
      const { data } = await supabase.storage.from("public").createSignedUrl(arquivo, 3600);
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch {
      // ignora
    }
  };

  /* ---- upload de ficheiro .docx alterado pelo utilizador ---- */
  const handleUploadProposta = async (orcamento: Orcamento, file: File) => {
    setPropostaStatus(null);

    try {
      const fileName = `propostas-geradas/orcamento_${orcamento.id}_${Date.now()}.docx`;
      const { error: uploadErr } = await supabase.storage
        .from("public")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadErr) throw new Error("Erro ao fazer upload do ficheiro.");

      const { error: updateErr } = await supabase
        .from("orcamentos")
        .update({ arquivo_proposta: fileName })
        .eq("id", orcamento.id);

      if (updateErr) throw new Error("Erro ao atualizar registo do orçamento.");

      setOrcamentos((prev) =>
        prev.map((o) =>
          o.id === orcamento.id ? { ...o, arquivo_proposta: fileName } : o
        )
      );
      setSelected((prev) =>
        prev ? { ...prev, arquivo_proposta: fileName } : null
      );

      setPropostaStatus({ type: "success", msg: "Ficheiro carregado com sucesso!" });
      setTimeout(() => setPropostaStatus(null), 6000);
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Erro desconhecido ao fazer upload.";
      setPropostaStatus({ type: "error", msg });
    }
  };

  /* ---- gerar proposta .docx ---- */
  const handleGerarProposta = async (orcamento: Orcamento) => {
    setGerandoProposta(true);
    setPropostaStatus(null);
    setPropostaProgress("A preparar...");

    // instrumentação de tempo por etapa
    const t: Record<string, number> = {};
    const mark = (label: string, ms: number) => {
      t[label] = Math.round(ms);
      // log detalhado na consola para diagnóstico
      // eslint-disable-next-line no-console
      console.log(`[GerarProposta] ${label}: ${Math.round(ms)}ms`);
    };
    const tStart = performance.now();

    // salvaguarda: se por algum motivo o finally não correr, um safety timeout repõe o estado
    const safetyTimer = setTimeout(() => {
      setGerandoProposta(false);
      setPropostaProgress("");
    }, 120000);

    try {
      let arrayBuffer: ArrayBuffer;
      let tags: { tag_template: string; campo_banco: string | null; mascara: string | null }[];

      // ---------------------------------------------------------------
      // 1. Descobrir sempre qual é o template válido atual (query leve).
      //    Isto garante que, se o template for substituído em Cadastros,
      //    a próxima geração usa o novo ficheiro e não o cache antigo.
      // ---------------------------------------------------------------
      setPropostaProgress("A carregar template...");
      const tMeta = performance.now();
      const { data: template, error: templateErr } = await supabase
        .from("admin_template_proposta")
        .select("id, arquivo_docx, valido, updated_at")
        .eq("nome_tabela_cadastro", "orcamentos")
        .eq("valido", true)
        .maybeSingle();

      if (templateErr || !template) {
        throw new Error("Nenhum template válido encontrado para Orçamentos. Vá a Cadastros → TemplateProposta e crie um template com a checkbox 'Válido' marcada.");
      }
      if (!template.arquivo_docx) {
        throw new Error("O template válido não tem um ficheiro .docx associado.");
      }
      mark("metadados", performance.now() - tMeta);

      const cache = templateCacheRef.current;
      const cacheValido =
        cache &&
        cache.templateId === template.id &&
        cache.updatedAt === (template.updated_at ?? "");

      if (cacheValido) {
        // reutiliza buffer e tags — salta download + query de tags
        arrayBuffer = cache!.arrayBuffer;
        tags = cache!.tags;
        mark("cache_hit", 0);
      } else {
        // tags + URL assinada em paralelo
        const tTagsUrl = performance.now();
        const [{ data: tagsData, error: tagsErr }, { data: signedData, error: signedErr }] =
          await Promise.all([
            supabase
              .from("admin_tags_template")
              .select("tag_template, campo_banco, mascara")
              .eq("template_id", template.id)
              .order("id"),
            supabase.storage.from("public").createSignedUrl(template.arquivo_docx, 120),
          ]);

        if (tagsErr) throw tagsErr;
        if (signedErr || !signedData?.signedUrl) {
          throw new Error("Erro ao obter acesso ao ficheiro .docx do template. Verifique se o ficheiro foi carregado corretamente no storage.");
        }
        mark("tags_e_url", performance.now() - tTagsUrl);

        tags = (tagsData || []) as typeof tags;

        // download do .docx
        setPropostaProgress("A descarregar template...");
        const tDl = performance.now();
        const abortController = new AbortController();
        const fetchTimeoutId = setTimeout(() => abortController.abort(), 30000);

        let fetchRes: Response;
        try {
          fetchRes = await fetch(signedData.signedUrl, { signal: abortController.signal });
        } catch (fetchErr: unknown) {
          clearTimeout(fetchTimeoutId);
          if (fetchErr instanceof DOMException && fetchErr.name === "AbortError") {
            throw new Error("Timeout ao descarregar o ficheiro .docx (30s). O ficheiro pode ser demasiado grande ou a rede está lenta. Tente novamente.");
          }
          throw new Error(`Erro de rede ao descarregar o ficheiro .docx: ${fetchErr instanceof Error ? fetchErr.message : "Erro desconhecido"}`);
        }
        clearTimeout(fetchTimeoutId);

        if (!fetchRes.ok) {
          throw new Error(`Erro ao descarregar o ficheiro .docx do template (HTTP ${fetchRes.status}).`);
        }
        arrayBuffer = await fetchRes.arrayBuffer();
        mark("download_docx", performance.now() - tDl);

        // guardar tudo em cache (chave = id + updated_at do template)
        templateCacheRef.current = {
          templateId: template.id,
          updatedAt: template.updated_at ?? "",
          arrayBuffer,
          tags,
        };
      }

      // ---------------------------------------------------------------
      // 4. Construir mapa de substituição
      // ---------------------------------------------------------------
      const tMap = performance.now();
      const tagValues: Record<string, string> = {};
      for (const tag of tags) {
        if (tag.campo_banco && (tag.campo_banco in orcamento)) {
          const rawValue = (orcamento as Record<string, unknown>)[tag.campo_banco];
          if (tag.mascara && tag.mascara.trim()) {
            tagValues[tag.tag_template] = formatDateWithMask(rawValue, tag.mascara.trim());
          } else {
            tagValues[tag.tag_template] = formatProposalValue(rawValue);
          }
        }
      }
      mark("montar_tags", performance.now() - tMap);

      // ---------------------------------------------------------------
      // 5. Gerar novo .docx (compressão STORE = muito mais rápido)
      // ---------------------------------------------------------------
      setPropostaProgress("A preencher documento...");
      const tRender = performance.now();
      let blob: Blob;
      try {
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, {
          delimiters: { start: "[", end: "]" },
          nullGetter: () => "",
        });
        doc.render(tagValues);
        blob = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          compression: "STORE",
        });
      } catch (docxErr: unknown) {
        const detail = docxErr instanceof Error ? docxErr.message : "Erro desconhecido";
        throw new Error(`Erro ao processar o documento .docx: ${detail}. Verifique se o ficheiro do template não está corrompido.`);
      }
      mark("render_docx", performance.now() - tRender);

      // ---------------------------------------------------------------
      // 6+7. Upload e update — upload primeiro, update logo a seguir
      // ---------------------------------------------------------------
      setPropostaProgress("A guardar proposta...");
      const fileName = `propostas-geradas/orcamento_${orcamento.id}_${Date.now()}.docx`;

      const tUpload = performance.now();
      const { error: uploadErr } = await supabase.storage
        .from("public")
        .upload(fileName, blob, {
          cacheControl: "3600",
          upsert: true,
          contentType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
      if (uploadErr) throw new Error("Erro ao guardar a proposta gerada no storage.");
      mark("upload", performance.now() - tUpload);

      const tUpdate = performance.now();
      const { error: updateErr } = await supabase
        .from("orcamentos")
        .update({ arquivo_proposta: fileName })
        .eq("id", orcamento.id);
      if (updateErr) throw updateErr;
      mark("update_db", performance.now() - tUpdate);

      // 8. Actualizar estado local
      setOrcamentos((prev) =>
        prev.map((o) =>
          o.id === orcamento.id ? { ...o, arquivo_proposta: fileName } : o
        )
      );
      setSelected((prev) =>
        prev ? { ...prev, arquivo_proposta: fileName } : null
      );

      const totalMs = Math.round(performance.now() - tStart);
      mark("TOTAL", totalMs);

      // resumo legível do breakdown
      const breakdown = Object.entries(t)
        .filter(([k]) => k !== "TOTAL" && k !== "cache_hit")
        .map(([k, v]) => `${k} ${v}ms`)
        .join(" · ");

      setPropostaStatus({
        type: "success",
        msg: `Proposta gerada em ${(totalMs / 1000).toFixed(1)}s${breakdown ? ` (${breakdown})` : ""}`,
      });
      setTimeout(() => setPropostaStatus(null), 10000);
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Erro desconhecido ao gerar proposta.";
      setPropostaStatus({ type: "error", msg });
    } finally {
      clearTimeout(safetyTimer);
      setGerandoProposta(false);
      setPropostaProgress("");
    }
  };

  const handleSelectOrcamento = (o: Orcamento) => {
    setSelected(o);
    setPropostaStatus(null);
    setSaveStatus(null);
    setEditValidade(o.validade ?? 30);
    setEditPcoUnit(o.pco_unit != null ? String(o.pco_unit) : "");
    setEditDesconto(o.desconto != null ? String(o.desconto) : "0");
    setEditPrazosPagamento(o.prazos_pagamento ?? "30");
    setEditQuantidade(o.quantidade ?? 1);
    setEditUnidade(o.unidade ?? "");
    setEditNome(o.nome_destinatario ?? "");
    setEditEmail(o.email ?? "");
    setEditEmpresa(o.empresa_cliente ?? "");
    setEditEstabelecimento(o.estabelecimento ?? "");
    setEditTelemovel(o.telemovel ?? "");
    setEditWhatsapp(o.possui_whatsapp ? "Sim" : "Não");
    setEditCargoFuncao(o.funcao_cliente ?? "");
    setEditNipNif(o.nip_nif_cliente ?? "");
    setEditTipoOrcamento(o.tipo_orcamento ?? "");
    setEditProdutoId(o.produto_id ?? 0);
    setEditTamanho(o.tamanho_nome ?? "");
    setEditFormato(o.formato ?? "");
    setEditFormatoEspecifico(o.formato_especifico ?? "");
    setEditDataLimite(o.data_limite ? o.data_limite.split("T")[0] : "");
    setEditMensagemEspecial(o.mensagem_especial ?? "");
    setEditAlergias(o.alergias_restricoes ?? "");
    setEditInfoAdicionais(o.informacoes_adicionais ?? "");

    // carregar opções das tabelas ao abrir modal
    carregarOpcoes();
  };

  /* ---- cálculos automáticos do orçamento ---- */
  const calcPcoTotal = (pcoUnit: number, qtd: number): number => {
    if (isNaN(pcoUnit) || isNaN(qtd) || qtd <= 0) return 0;
    return Math.round(pcoUnit * qtd * 100) / 100;
  };

  const calcSubtotal = (pcoTotal: number): number => pcoTotal;

  const calcTotalOrcamento = (subtotalVal: number, descontoPct: number): number => {
    if (isNaN(subtotalVal) || isNaN(descontoPct)) return subtotalVal;
    return Math.round(subtotalVal * (1 - descontoPct / 100) * 100) / 100;
  };

  const calcIva = (totalOrcamentoVal: number): number => {
    if (isNaN(totalOrcamentoVal)) return 0;
    return Math.round(totalOrcamentoVal * 0.23 * 100) / 100;
  };

  const getPcoUnitNum = (): number => {
    const v = parseFloat(editPcoUnit.replace(",", "."));
    return isNaN(v) ? 0 : v;
  };

  const getDescontoNum = (): number => {
    const v = parseFloat(editDesconto.replace(",", "."));
    return isNaN(v) ? 0 : v;
  };

  const pcoTotalCalc = calcPcoTotal(getPcoUnitNum(), editQuantidade);
  const subtotalCalc = calcSubtotal(pcoTotalCalc);
  const valorDescontoCalc = Math.round(subtotalCalc * getDescontoNum() / 100 * 100) / 100;
  const totalOrcamentoCalc = calcTotalOrcamento(subtotalCalc, getDescontoNum());
  const ivaCalc = calcIva(totalOrcamentoCalc);

  /* ---- guardar alterações dos campos editáveis ---- */
  const handleSaveFields = async () => {
    if (!selected) return;
    setSavingFields(true);
    setSaveStatus(null);

    const pcoUnitNum = getPcoUnitNum();
    const descontoNum = getDescontoNum();
    const pcoTotalVal = calcPcoTotal(pcoUnitNum, editQuantidade);
    const subtotalVal = calcSubtotal(pcoTotalVal);
    const totalVal = calcTotalOrcamento(subtotalVal, descontoNum);
    const ivaVal = calcIva(totalVal);

    try {
      const { error } = await supabase
        .from("orcamentos")
        .update({
          validade: editValidade,
          pco_unit: pcoUnitNum || null,
          quantidade: editQuantidade,
          pco_total: pcoTotalVal || null,
          subtotal: subtotalVal || null,
          desconto: descontoNum || 0,
          total_orcamento: totalVal || null,
          iva: ivaVal || null,
          prazos_pagamento: editPrazosPagamento || "30",
          unidade: editUnidade || null,
          nome_destinatario: editNome,
          email: editEmail,
          funcao_cliente: editCargoFuncao || null,
          nip_nif_cliente: editNipNif || null,
          empresa_cliente: editEmpresa || null,
          estabelecimento: editEstabelecimento || null,
          telemovel: editTelemovel || null,
          possui_whatsapp: editWhatsapp === "Sim",
          produto_id: editProdutoId || null,
          produto_nome: editProdutoId
            ? (opcoesProdutos.find((p) => p.id === editProdutoId)?.name ?? selected.produto_nome)
            : selected.produto_nome,
          tipo_orcamento: editTipoOrcamento || null,
          tamanho_nome: editTamanho || null,
          formato: editFormato || null,
          formato_especifico: editFormatoEspecifico || null,
          data_limite: editDataLimite ? new Date(editDataLimite).toISOString() : null,
          mensagem_especial: editMensagemEspecial || null,
          alergias_restricoes: editAlergias || null,
          informacoes_adicionais: editInfoAdicionais || null,
        })
        .eq("id", selected.id);

      if (error) throw error;

      // atualizar estado local
      const updated: Orcamento = {
        ...selected,
        validade: editValidade,
        pco_unit: pcoUnitNum || null,
        quantidade: editQuantidade,
        pco_total: pcoTotalVal || null,
        subtotal: subtotalVal || null,
        desconto: descontoNum || 0,
        total_orcamento: totalVal || null,
        iva: ivaVal || null,
        prazos_pagamento: editPrazosPagamento || "30",
        unidade: editUnidade || null,
        nome_destinatario: editNome,
        email: editEmail,
        funcao_cliente: editCargoFuncao || null,
        nip_nif_cliente: editNipNif || null,
        empresa_cliente: editEmpresa || null,
        estabelecimento: editEstabelecimento || null,
        telemovel: editTelemovel || null,
        possui_whatsapp: editWhatsapp === "Sim",
        produto_id: editProdutoId || null,
        produto_nome: editProdutoId
          ? (opcoesProdutos.find((p) => p.id === editProdutoId)?.name ?? selected.produto_nome)
          : selected.produto_nome,
        tipo_orcamento: editTipoOrcamento || null,
        tamanho_nome: editTamanho || null,
        formato: editFormato || null,
        formato_especifico: editFormatoEspecifico || null,
        data_limite: editDataLimite ? new Date(editDataLimite).toISOString() : null,
        mensagem_especial: editMensagemEspecial || null,
        alergias_restricoes: editAlergias || null,
        informacoes_adicionais: editInfoAdicionais || null,
      };
      setSelected(updated);
      setOrcamentos((prev) =>
        prev.map((o) => (o.id === selected.id ? updated : o))
      );

      setSaveStatus({ type: "success", msg: "Alterações guardadas com sucesso!" });
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao guardar.";
      setSaveStatus({ type: "error", msg });
    } finally {
      setSavingFields(false);
    }
  };

  /* ---- excluir orçamento ---- */
  const handleDeleteOrcamento = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("orcamentos")
        .delete()
        .eq("id", selected.id);

      if (error) throw error;

      setOrcamentos((prev) => prev.filter((o) => o.id !== selected.id));
      setSelected(null);
      setShowDeleteConfirm(false);
      setPropostaStatus(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao excluir.";
      setSaveStatus({ type: "error", msg });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex bg-background-50">
      <AdminSidebar activeHref="/admin/orcamentos" title="Orçamentos" />

      {/* Main content */}
      <main className="flex-1 lg:pt-0 pt-14">
        <div className="px-4 md:px-8 py-6 md:py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">
                Orçamentos
              </h1>
              <p className="mt-1 text-sm text-foreground-600">
                {orcamentos.length} pedido{orcamentos.length !== 1 ? "s" : ""} de orçamento recebido{orcamentos.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={carregar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-100 border border-background-200/70 text-foreground-700 text-sm font-medium hover:bg-background-200/60 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-refresh-line w-4 h-4 flex items-center justify-center" />
              Atualizar
            </button>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
              <i className="ri-error-warning-line w-5 h-5 flex items-center justify-center text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={carregar}
                className="ml-auto text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer whitespace-nowrap"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <i className="ri-loader-4-line animate-spin text-2xl w-6 h-6 flex items-center justify-center text-foreground-400" />
            </div>
          ) : orcamentos.length === 0 ? (
            <div className="rounded-xl bg-background-100 border border-background-200/70 py-16 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-background-200/60 mx-auto mb-4">
                <i className="ri-file-list-3-line text-xl w-6 h-6 flex items-center justify-center text-foreground-400" />
              </div>
              <p className="text-foreground-600 text-sm">Nenhum orçamento recebido ainda.</p>
              <p className="text-foreground-400 text-xs mt-1">
                Os pedidos feitos na página "Para Empresas" aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-background-100 border border-background-200/70 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-background-200/60">
                      <th className="text-left px-4 py-3 font-medium text-foreground-600 w-16">#</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600">Data</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600">Prazo</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600">Prazo restante</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600 min-w-[180px]">Produto</th>
                      <th className="text-center px-4 py-3 font-medium text-foreground-600">Qtd</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600 hidden md:table-cell">Data Limite</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600">Cliente</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600 hidden lg:table-cell">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600 hidden lg:table-cell">Telemóvel</th>
                      <th className="text-center px-4 py-3 font-medium text-foreground-600 w-14">Det.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orcamentos.map((o) => (
                      <tr
                        key={o.id}
                        onClick={() => handleSelectOrcamento(o)}
                        className="border-b border-background-200/40 hover:bg-background-50/60 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 text-foreground-500 font-mono text-xs">{o.id}</td>
                        <td className="px-4 py-3 text-foreground-700 whitespace-nowrap">
                          {formatDateTime(o.created_at)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {(() => {
                            const temPrazoCustom = o.produto_id != null && antecedenciaMap[o.produto_id] !== undefined;
                            const antecedenciaHoras = parseAntecedencia(
                              o.produto_id ? antecedenciaMap[o.produto_id] : null
                            );
                            return (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-mono bg-background-200/50 text-foreground-700">
                                <i className="ri-time-line w-3.5 h-3.5 flex items-center justify-center mr-1.5" />
                                {formatPrazoHoras(antecedenciaHoras)}
                                {!temPrazoCustom && (
                                  <sup className="ml-0.5 text-[9px] font-normal opacity-70" title="Prazo padrão de 48h (não definido no produto)">*</sup>
                                )}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {(() => {
                            const temPrazoCustom2 = o.produto_id != null && antecedenciaMap[o.produto_id] !== undefined;
                            const antecedenciaHoras2 = parseAntecedencia(
                              o.produto_id ? antecedenciaMap[o.produto_id] : null
                            );
                            const prazo = calcPrazo(o.created_at, antecedenciaHoras2);
                            if (!prazo) return <span className="text-foreground-400">—</span>;
                            const bgClass = prazo.vencido
                              ? "bg-red-500/20 text-red-800"
                              : prazoBgClass(prazo.percentConsumed);
                            return (
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-mono ${bgClass}`}>
                                <i className="ri-timer-line w-3.5 h-3.5 flex items-center justify-center mr-1.5" />
                                {prazo.display}
                                {prazo.vencido && (
                                  <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide opacity-80">vencido</span>
                                )}
                                {!temPrazoCustom2 && !prazo.vencido && (
                                  <sup className="ml-0.5 text-[9px] font-normal opacity-70" title="Prazo padrão de 48h (não definido no produto)">*</sup>
                                )}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-3 text-foreground-700 min-w-[180px] max-w-[300px] truncate">
                          {o.produto_nome || "—"}
                        </td>
                        <td className="px-4 py-3 text-center text-foreground-700">{o.quantidade ?? "—"}</td>
                        <td className="px-4 py-3 text-foreground-600 hidden md:table-cell whitespace-nowrap">
                          {formatDateTime(o.data_limite)}
                        </td>
                        <td className="px-4 py-3 text-foreground-800 font-medium">{o.nome_destinatario}</td>
                        <td className="px-4 py-3 text-foreground-600 hidden lg:table-cell">{o.email}</td>
                        <td className="px-4 py-3 text-foreground-600 whitespace-nowrap hidden lg:table-cell">{o.telemovel || "—"}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleSelectOrcamento(o)}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-background-200/60 text-foreground-500 hover:text-foreground-700 transition-colors cursor-pointer whitespace-nowrap"
                            title="Ver detalhes"
                          >
                            <i className="ri-eye-line w-4 h-4 flex items-center justify-center" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal de detalhes */}
          {selected && (
            <div
              className="fixed inset-0 z-50 flex items-start justify-center py-6 px-4 overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) { setSelected(null); setPropostaStatus(null); }
              }}
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
              <div className="relative w-full max-w-3xl bg-background-50 rounded-2xl overflow-hidden z-10">
                <div className="sticky top-0 z-10 bg-background-50 border-b border-background-200/70 px-6 py-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground-950">
                      Orçamento #{selected.id}
                    </h2>
                    <p className="text-sm text-foreground-600 mt-0.5">
                      Recebido em {formatDateTime(selected.created_at)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-background-100 hover:bg-background-200/70 text-foreground-600 hover:text-foreground-950 transition-colors cursor-pointer whitespace-nowrap"
                    aria-label="Fechar"
                  >
                    <i className="ri-close-line text-xl w-5 h-5 flex items-center justify-center" />
                  </button>
                </div>

                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-5">
                  {/* Identificação do Orçamento */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                      <i className="ri-file-copy-line w-4 h-4 flex items-center justify-center" />
                      Identificação do Orçamento
                    </h3>
                    <div className="flex items-center gap-6 p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-foreground-500">ID Orçamento</p>
                        <p className="text-sm font-mono font-bold text-foreground-900">{getIdOrcamento(selected)}</p>
                      </div>
                      <div className="w-px h-8 bg-background-300/60" />
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-foreground-500">Nº Proposta</p>
                        <p className="text-sm font-mono font-bold text-foreground-900">{getNroProposta(selected)}</p>
                      </div>
                      <div className="w-px h-8 bg-background-300/60" />
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-foreground-500">Validade (dias)</p>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditValidade(Math.max(1, editValidade - 1))}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-background-200/60 hover:bg-background-300/60 text-foreground-700 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <i className="ri-subtract-line w-3.5 h-3.5 flex items-center justify-center" />
                          </button>
                          <input
                            type="number"
                            value={editValidade}
                            onChange={(e) => setEditValidade(Math.max(1, parseInt(e.target.value) || 1))}
                            min={1}
                            className="w-16 text-center px-2 py-1.5 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                          />
                          <button
                            type="button"
                            onClick={() => setEditValidade(editValidade + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-background-200/60 hover:bg-background-300/60 text-foreground-700 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <i className="ri-add-line w-3.5 h-3.5 flex items-center justify-center" />
                          </button>
                          <span className="text-xs text-foreground-500 ml-0.5">dias</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dados do cliente */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                      <i className="ri-user-line w-4 h-4 flex items-center justify-center" />
                      Dados do Cliente
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                      <div>
                        <p className="text-xs text-foreground-500">Nome da Empresa</p>
                        <input
                          type="text"
                          value={editEmpresa}
                          onChange={(e) => setEditEmpresa(e.target.value)}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-foreground-500">NIP / NIF</p>
                        <input
                          type="text"
                          value={editNipNif}
                          onChange={(e) => setEditNipNif(e.target.value)}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-foreground-500">Nome do Estabelecimento</p>
                        <input
                          type="text"
                          value={editEstabelecimento}
                          onChange={(e) => setEditEstabelecimento(e.target.value)}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-foreground-500">Nome</p>
                        <input
                          type="text"
                          value={editNome}
                          onChange={(e) => setEditNome(e.target.value)}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-foreground-500">Cargo / Função</p>
                        <input
                          type="text"
                          value={editCargoFuncao}
                          onChange={(e) => setEditCargoFuncao(e.target.value)}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-foreground-500">Email</p>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-foreground-500">Telemóvel</p>
                        <input
                          type="text"
                          value={editTelemovel}
                          onChange={(e) => setEditTelemovel(e.target.value)}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-foreground-500">WhatsApp</p>
                        <select
                          value={editWhatsapp}
                          onChange={(e) => setEditWhatsapp(e.target.value)}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer appearance-none"
                        >
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Dados do pedido */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                      <i className="ri-shopping-bag-3-line w-4 h-4 flex items-center justify-center" />
                      Dados do Pedido
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                      <div>
                        <p className="text-xs text-foreground-500">Produto</p>
                        <select
                          value={editProdutoId}
                          onChange={(e) => setEditProdutoId(Number(e.target.value))}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer appearance-none"
                        >
                          <option value="0">—</option>
                          {opcoesProdutos.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-xs text-foreground-500">Data Limite</p>
                        <input
                          type="date"
                          value={editDataLimite}
                          onChange={(e) => setEditDataLimite(e.target.value)}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-foreground-500">Tipo de Orçamento</p>
                        <select
                          value={editTipoOrcamento}
                          onChange={(e) => setEditTipoOrcamento(e.target.value)}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer appearance-none"
                        >
                          <option value="">—</option>
                          {opcoesTipos.map((t) => (
                            <option key={t.id} value={t.nome}>{t.nome}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-xs text-foreground-500">Tamanho</p>
                        <select
                          value={editTamanho}
                          onChange={(e) => setEditTamanho(e.target.value)}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer appearance-none"
                        >
                          <option value="">—</option>
                          {opcoesTamanhos.map((t) => (
                            <option key={t.id} value={t.nome}>{t.nome}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-xs text-foreground-500">Formato</p>
                        <select
                          value={editFormato}
                          onChange={(e) => setEditFormato(e.target.value)}
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer appearance-none"
                        >
                          <option value="">—</option>
                          {opcoesFormatos.map((f) => (
                            <option key={f.id} value={f.nome}>{f.nome}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-xs text-foreground-500">Formato Específico</p>
                        <input
                          type="text"
                          value={editFormatoEspecifico}
                          onChange={(e) => setEditFormatoEspecifico(e.target.value)}
                          placeholder="Ex.: Coração, Número..."
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descrição do produto */}
                  {selected.produto_descricao && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                        <i className="ri-file-text-line w-4 h-4 flex items-center justify-center" />
                        Descrição do Produto
                      </h3>
                      <div className="p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                        <p className="text-sm text-foreground-700 leading-relaxed">{selected.produto_descricao}</p>
                      </div>
                    </div>
                  )}

                  {/* Dados Financeiros */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                      <i className="ri-money-euro-circle-line w-4 h-4 flex items-center justify-center" />
                      Dados Financeiros
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                      {/* Linha 1: Preço Unitário | Quantidade | Unidade | Preço Total */}
                      <div>
                        <p className="text-xs text-foreground-500">Preço Unitário (€)</p>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={editPcoUnit}
                          onChange={(e) => setEditPcoUnit(e.target.value)}
                          placeholder="0,00"
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>

                      <div>
                        <p className="text-xs text-foreground-500 text-center">Quantidade</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <button
                            type="button"
                            onClick={() => setEditQuantidade(Math.max(1, editQuantidade - 1))}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-background-200/60 hover:bg-background-300/60 text-foreground-700 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <i className="ri-subtract-line w-3.5 h-3.5 flex items-center justify-center" />
                          </button>
                          <input
                            type="number"
                            value={editQuantidade}
                            onChange={(e) => setEditQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                            min={1}
                            className="w-16 text-center px-2 py-1.5 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                          />
                          <button
                            type="button"
                            onClick={() => setEditQuantidade(editQuantidade + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-background-200/60 hover:bg-background-300/60 text-foreground-700 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <i className="ri-add-line w-3.5 h-3.5 flex items-center justify-center" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-foreground-500 text-center">Unidade</p>
                        <input
                          type="text"
                          value={editUnidade}
                          onChange={(e) => setEditUnidade(e.target.value)}
                          placeholder="kg, un, L..."
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 text-center focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>

                      <div className="flex flex-col items-center justify-start">
                        <p className="text-xs text-foreground-500">Preço Total (€)</p>
                        <p className="mt-0.5 px-3 py-2 text-sm font-bold text-foreground-900">
                          {pcoTotalCalc.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </p>
                      </div>

                      {/* Linha 2: empty | empty | Subtotal (€) | valor */}
                      <div />
                      <div />
                      <div className="flex items-center justify-end">
                        <p className="text-xs text-foreground-500">Subtotal (€)</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="text-sm font-bold text-foreground-900">
                          {subtotalCalc.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </p>
                      </div>

                      {/* Linha 3: empty | Desconto | valor % | Valor Desconto */}
                      <div />
                      <div className="flex items-center justify-end">
                        <p className="text-xs text-foreground-500">Desconto</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={editDesconto}
                            onChange={(e) => setEditDesconto(e.target.value)}
                            placeholder="0"
                            className="w-20 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                          />
                          <span className="text-sm text-foreground-600">%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="text-sm font-bold text-foreground-900">
                          {valorDescontoCalc.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </p>
                      </div>

                      {/* Linha 4: empty | empty | IVA 23% (€) | valor */}
                      <div />
                      <div />
                      <div className="flex items-center justify-end">
                        <p className="text-xs text-foreground-500">IVA 23% (€)</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="text-sm font-bold text-foreground-900">
                          {ivaCalc.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </p>
                      </div>

                      {/* Linha 5: TOTAL (com IVA) — faixa única com destaque */}
                      <div className="col-span-full grid grid-cols-4 bg-background-300/60 rounded-lg">
                        <div />
                        <div />
                        <div className="flex items-center justify-end">
                          <p className="text-xs font-semibold text-foreground-800">TOTAL (com IVA)</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <p className="text-sm font-bold text-foreground-900">
                            {totalOrcamentoCalc.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                          </p>
                        </div>
                      </div>

                      {/* Linha 6: Prazos de Pagamento | valor | empty | empty */}
                      <div className="flex items-center justify-end">
                        <p className="text-xs text-foreground-500">Prazos de Pagamento</p>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={editPrazosPagamento}
                          onChange={(e) => setEditPrazosPagamento(e.target.value)}
                          placeholder="30"
                          className="w-full mt-0.5 px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-semibold text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>
                      <div />
                      <div />
                    </div>
                  </div>

                  {/* Mensagem especial */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                      <i className="ri-chat-quote-line w-4 h-4 flex items-center justify-center" />
                      Mensagem Especial / Frase a ser colocada no bolo
                    </h3>
                    <div className="p-4 rounded-xl bg-accent-100 border border-accent-200">
                      <input
                        type="text"
                        value={editMensagemEspecial}
                        onChange={(e) => setEditMensagemEspecial(e.target.value)}
                        placeholder="Ex.: Feliz Aniversário, Maria!"
                        className="w-full px-3 py-2 rounded-lg border border-accent-200 bg-background-50 text-sm font-medium text-foreground-900 italic placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>
                  </div>

                  {/* Alergias */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                      <i className="ri-virus-line w-4 h-4 flex items-center justify-center" />
                      Alergias / Restrições
                    </h3>
                    <div className="p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {opcoesAlergenicos.map((a) => {
                          const selecionada = editAlergias
                            .split(",")
                            .map((s) => s.trim().toLowerCase())
                            .includes(a.nome.toLowerCase());
                          return (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => {
                                const atuais = editAlergias
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean);
                                let novas: string[];
                                if (selecionada) {
                                  novas = atuais.filter(
                                    (s) => s.toLowerCase() !== a.nome.toLowerCase()
                                  );
                                } else {
                                  novas = [...atuais, a.nome];
                                }
                                setEditAlergias(novas.join(", "));
                              }}
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                                selecionada
                                  ? "bg-secondary-500 text-background-50 border-secondary-500"
                                  : "bg-background-50 text-foreground-600 border-background-200/70 hover:border-background-300/60 hover:bg-background-100"
                              }`}
                            >
                              {a.nome}
                            </button>
                          );
                        })}
                      </div>
                      <input
                        type="text"
                        value={editAlergias}
                        onChange={(e) => setEditAlergias(e.target.value)}
                        placeholder="Ex.: Glúten, Lactose, Frutos secos..."
                        className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-medium text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                      {editAlergias.trim() && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {editAlergias.split(",").map((a, i) => {
                            const trimmed = a.trim();
                            if (!trimmed) return null;
                            return (
                              <span
                                key={i}
                                className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary-100 text-secondary-800 text-xs font-medium border border-secondary-200"
                              >
                                {trimmed}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informações adicionais */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                      <i className="ri-information-line w-4 h-4 flex items-center justify-center" />
                      Informações Adicionais
                    </h3>
                    <div className="p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                      <textarea
                        value={editInfoAdicionais}
                        onChange={(e) => setEditInfoAdicionais(e.target.value)}
                        placeholder="Informações complementares..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm font-medium text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                      />
                    </div>
                  </div>

                  {/* Arquivo Proposta */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                      <i className="ri-file-word-2-line w-4 h-4 flex items-center justify-center" />
                      Arquivo Proposta
                    </h3>
                    <div className="p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                      {selected.arquivo_proposta ? (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-100 flex-shrink-0">
                              <i className="ri-file-word-2-line text-green-600 w-4 h-4 flex items-center justify-center" />
                            </div>
                            <span className="text-sm font-mono text-foreground-800 truncate">
                              {selected.arquivo_proposta.split("/").pop()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleDownloadProposta(selected.arquivo_proposta!)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <i className="ri-download-line w-3.5 h-3.5 flex items-center justify-center" />
                              Download
                            </button>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <i className="ri-upload-line w-3.5 h-3.5 flex items-center justify-center" />
                              Upload
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleUploadProposta(selected, file);
                                }
                                if (e.target) e.target.value = "";
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground-500">
                          Nenhuma proposta gerada para este orçamento.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-background-50 border-t border-background-200/70 px-6 py-4">
                  {/* Status da proposta */}
                  {propostaStatus && (
                    <div
                      className={`mb-4 p-3 rounded-xl flex items-center gap-2.5 text-sm ${
                        propostaStatus.type === "success"
                          ? "bg-green-50 border border-green-200 text-green-700"
                          : "bg-red-50 border border-red-200 text-red-700"
                      }`}
                    >
                      <i
                        className={`w-4 h-4 flex items-center justify-center flex-shrink-0 ${
                          propostaStatus.type === "success"
                            ? "ri-check-line"
                            : "ri-error-warning-line"
                        }`}
                      />
                      <span>{propostaStatus.msg}</span>
                    </div>
                  )}

                  {/* Status do guardar */}
                  {saveStatus && (
                    <div
                      className={`mb-4 p-3 rounded-xl flex items-center gap-2.5 text-sm ${
                        saveStatus.type === "success"
                          ? "bg-green-50 border border-green-200 text-green-700"
                          : "bg-red-50 border border-red-200 text-red-700"
                      }`}
                    >
                      <i
                        className={`w-4 h-4 flex items-center justify-center flex-shrink-0 ${
                          saveStatus.type === "success"
                            ? "ri-check-line"
                            : "ri-error-warning-line"
                        }`}
                      />
                      <span>{saveStatus.msg}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Botão Guardar campos financeiros */}
                    <button
                      type="button"
                      onClick={handleSaveFields}
                      disabled={savingFields}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary-500 hover:bg-secondary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                    >
                      {savingFields ? (
                        <>
                          <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                          A guardar...
                        </>
                      ) : (
                        <>
                          <i className="ri-save-line w-4 h-4 flex items-center justify-center" />
                          Guardar
                        </>
                      )}
                    </button>
                    {/* Botão Excluir Orçamento */}
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/15 hover:bg-red-500/25 text-red-700 text-sm font-semibold border border-red-300/60 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
                      Excluir Orçamento
                    </button>
                    {/* Info de proposta existente */}
                    {selected.arquivo_proposta && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                        <i className="ri-file-word-2-line w-4 h-4 flex items-center justify-center flex-shrink-0" />
                        <span className="truncate max-w-[180px] text-xs font-mono">
                          {selected.arquivo_proposta.split("/").pop()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 sm:ml-auto">
                      {selected.arquivo_proposta ? (
                        <>
                          {/* Gerar novamente */}
                          <button
                            type="button"
                            onClick={() => handleGerarProposta(selected)}
                            disabled={gerandoProposta}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background-100 border border-background-200/70 text-foreground-700 text-sm font-semibold hover:bg-background-200/60 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                          >
                            {gerandoProposta ? (
                              <>
                                <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                                {propostaProgress || "A gerar..."}
                              </>
                            ) : (
                              <>
                                <i className="ri-file-text-line w-4 h-4 flex items-center justify-center" />
                                Gerar novamente
                              </>
                            )}
                          </button>

                          {/* Enviar */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(null);
                              setPropostaStatus(null);
                            }}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center" />
                            Enviar
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Gerar Proposta */}
                          <button
                            type="button"
                            onClick={() => handleGerarProposta(selected)}
                            disabled={gerandoProposta}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                          >
                            {gerandoProposta ? (
                              <>
                                <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                                {propostaProgress || "A gerar..."}
                              </>
                            ) : (
                              <>
                                <i className="ri-file-text-line w-4 h-4 flex items-center justify-center" />
                                Gerar Proposta
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelected(null);
                              setPropostaStatus(null);
                            }}
                            className="px-6 py-2.5 rounded-full bg-background-100 border border-background-200/70 text-foreground-700 text-sm font-medium hover:bg-background-200/60 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Fechar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Popup de confirmação de exclusão */}
              {showDeleteConfirm && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-2xl">
                  <div
                    className="relative w-full max-w-md mx-4 bg-background-50 rounded-2xl p-6 z-30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
                      <i className="ri-error-warning-line text-2xl w-6 h-6 flex items-center justify-center text-red-600" />
                    </div>
                    <h3 className="text-lg font-heading font-bold text-foreground-950 text-center mb-3">
                      Excluir Orçamento
                    </h3>
                    <p className="text-sm text-foreground-600 text-center leading-relaxed mb-6">
                      Tem certeza que quer excluir esse pedido de Orçamento? Essa ação não poderá ser desfeita e os dados desse pedido de orçamento serão apagados da base de dados do sistema.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleting}
                        className="flex-1 px-5 py-2.5 rounded-full bg-background-100 border border-background-200/70 text-foreground-700 text-sm font-semibold hover:bg-background-200/60 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                      >
                        Não
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteOrcamento}
                        disabled={deleting}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                      >
                        {deleting ? (
                          <>
                            <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                            A excluir...
                          </>
                        ) : (
                          <>
                            <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
                            Sim
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}