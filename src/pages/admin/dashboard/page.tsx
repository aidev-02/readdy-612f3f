import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";
import EncomendaDetailModal from "@/pages/admin/components/EncomendaDetailModal";
import type { Encomenda } from "@/pages/admin/components/encomendaUtils";
import {
  STATUS_LABEL,
  STATUS_COLOR,
  formatDate,
} from "@/pages/admin/components/encomendaUtils";

interface StatItem {
  label: string;
  value: string;
  change: string;
  color: "primary" | "accent" | "secondary";
}

interface RecentOrcamento {
  id: number;
  created_at: string;
  nome_destinatario: string;
  empresa_cliente: string | null;
  produto_nome: string | null;
  produto_id: number | null;
}

interface OrcamentoDetalhe {
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

/* ------------------------------------------------------------------ */
/*  Helpers de Prazo (partilhados com orcamentos/page.tsx)             */
/* ------------------------------------------------------------------ */

const parseAntecedencia = (val: string | null | undefined): number => {
  if (!val || val.trim() === "") return 48;
  const trimmed = val.trim().toLowerCase();
  if (trimmed.endsWith("d") || trimmed.includes("dia")) {
    const days = parseFloat(trimmed);
    return isNaN(days) ? 48 : days * 24;
  }
  if (trimmed.endsWith("h") || trimmed.includes("hora")) {
    const hours = parseFloat(trimmed);
    return isNaN(hours) ? 48 : hours;
  }
  if (trimmed.endsWith("m") || trimmed.includes("min")) {
    const minutes = parseFloat(trimmed);
    return isNaN(minutes) ? 48 : minutes / 60;
  }
  const num = parseFloat(trimmed);
  return isNaN(num) ? 48 : num;
};

const formatPrazoHorasDash = (horas: number): string => {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

interface PrazoInfoDash {
  display: string;
  percentConsumed: number;
  vencido: boolean;
}

const calcPrazoDash = (createdAt: string, antecedenciaHoras: number): PrazoInfoDash | null => {
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

const prazoBgClassDash = (pct: number, vencido: boolean): string => {
  if (vencido) return "bg-red-500/15 text-red-800";
  if (pct < 50) return "bg-emerald-500/15 text-emerald-800";
  if (pct < 75) return "bg-amber-500/15 text-amber-800";
  return "bg-red-500/15 text-red-800";
};

function formatCurrency(value: number): string {
  return `${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;
}

export default function AdminDashboardPage() {
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [loadingEncomendas, setLoadingEncomendas] = useState(true);
  const [selectedEncomenda, setSelectedEncomenda] = useState<Encomenda | null>(null);
  const [selectedOrcamentoDetalhe, setSelectedOrcamentoDetalhe] = useState<OrcamentoDetalhe | null>(null);
  const [loadingOrcamentoDetalhe, setLoadingOrcamentoDetalhe] = useState(false);
  const [recentOrcamentos, setRecentOrcamentos] = useState<RecentOrcamento[]>([]);
  const [loadingOrcamentos, setLoadingOrcamentos] = useState(true);
  const [antecedenciaMapDash, setAntecedenciaMapDash] = useState<Record<number, string>>({});

  const [stats, setStats] = useState<StatItem[]>([
    { label: "Encomendas hoje", value: "—", change: "A carregar...", color: "primary" },
    { label: "Pendentes", value: "—", change: "A carregar...", color: "accent" },
    { label: "Receita do mês", value: "—", change: "A carregar...", color: "secondary" },
    { label: "Produtos ativos", value: "—", change: "A carregar...", color: "primary" },
  ]);

  const carregarStats = useCallback(async () => {
    try {
      const hoje = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const ontem = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      // 1. Encomendas hoje vs ontem
      const { count: countHoje } = await supabase
        .from("encomendas")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${hoje}T00:00:00`)
        .lte("created_at", `${hoje}T23:59:59`);

      const { count: countOntem } = await supabase
        .from("encomendas")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${ontem}T00:00:00`)
        .lte("created_at", `${ontem}T23:59:59`);

      const diffHoje = (countHoje || 0) - (countOntem || 0);
      const changeHoje = diffHoje >= 0 ? `+${diffHoje} vs ontem` : `${diffHoje} vs ontem`;

      // 2. Pendentes (status = "pendente")
      const { count: countPendentes } = await supabase
        .from("encomendas")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente");

      // 3. Receita do mês vs mês passado
      const now = new Date();
      const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const inicioMesPassado = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const fimMesPassado = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

      const { data: receitaMes } = await supabase
        .from("encomendas")
        .select("subtotal")
        .gte("created_at", inicioMes)
        .not("subtotal", "is", null);

      const { data: receitaMesPassado } = await supabase
        .from("encomendas")
        .select("subtotal")
        .gte("created_at", inicioMesPassado)
        .lte("created_at", fimMesPassado)
        .not("subtotal", "is", null);

      const totalMes = (receitaMes || []).reduce((acc, r) => acc + (Number(r.subtotal) || 0), 0);
      const totalMesPassado = (receitaMesPassado || []).reduce((acc, r) => acc + (Number(r.subtotal) || 0), 0);

      let changeReceita: string;
      if (totalMesPassado === 0) {
        changeReceita = totalMes > 0 ? "Novo mês" : "Sem receita";
      } else {
        const pct = Math.round(((totalMes - totalMesPassado) / totalMesPassado) * 100);
        changeReceita = pct >= 0 ? `+${pct}% vs mês passado` : `${pct}% vs mês passado`;
      }

      // 4. Produtos ativos e em revisão
      const { count: countAtivos } = await supabase
        .from("b2b_gallery_products")
        .select("*", { count: "exact", head: true })
        .eq("estado", "publicado");

      const { count: countRevisao } = await supabase
        .from("b2b_gallery_products")
        .select("*", { count: "exact", head: true })
        .or("estado.neq.publicado");

      const changeProdutos = (countRevisao || 0) > 0
        ? `${countRevisao} em revisão`
        : "Nenhum em revisão";

      setStats([
        { label: "Encomendas hoje", value: String(countHoje || 0), change: changeHoje, color: "primary" },
        { label: "Pendentes", value: String(countPendentes || 0), change: "A levantar", color: "accent" },
        { label: "Receita do mês", value: formatCurrency(totalMes), change: changeReceita, color: "secondary" },
        { label: "Produtos ativos", value: String(countAtivos || 0), change: changeProdutos, color: "primary" },
      ]);
    } catch {
      // mantém os placeholders em caso de erro
    }
  }, []);

  const carregarEncomendas = useCallback(async () => {
    setLoadingEncomendas(true);
    try {
      const { data, error: err } = await supabase
        .from("encomendas")
        .select("*")
        .in("status", ["em_entrega", "pendente"])
        .order("created_at", { ascending: false });

      if (err) throw err;

      const parsed = ((data || []) as Encomenda[]).map((e) => ({
        ...e,
        items: typeof e.items === "string" ? JSON.parse(e.items as string) : (e.items || []),
      }));
      setEncomendas(parsed);
    } catch {
      // silencioso - mantém os dados anteriores
    } finally {
      setLoadingEncomendas(false);
    }
  }, []);

  const carregarOrcamentos = useCallback(async () => {
    setLoadingOrcamentos(true);
    try {
      const [{ data: orcData, error: orcErr }, { data: prodData }] = await Promise.all([
        supabase
          .from("orcamentos")
          .select("id, created_at, nome_destinatario, empresa_cliente, produto_nome, produto_id")
          .order("created_at", { ascending: false }),
        supabase
          .from("b2b_gallery_products")
          .select("id, antecedencia"),
      ]);

      if (orcErr) throw orcErr;
      setRecentOrcamentos((orcData as RecentOrcamento[]) || []);

      if (prodData) {
        const map: Record<number, string> = {};
        (prodData as { id: number; antecedencia: string | null }[]).forEach((p) => {
          if (p.antecedencia && p.antecedencia.trim() !== "") {
            map[p.id] = p.antecedencia;
          }
        });
        setAntecedenciaMapDash(map);
      }
    } catch {
      // silencioso
    } finally {
      setLoadingOrcamentos(false);
    }
  }, []);

  const handleSelectOrcamentoDashboard = async (orc: RecentOrcamento) => {
    setLoadingOrcamentoDetalhe(true);
    try {
      const { data, error } = await supabase
        .from("orcamentos")
        .select("*")
        .eq("id", orc.id)
        .maybeSingle();

      if (error) throw error;
      setSelectedOrcamentoDetalhe((data as OrcamentoDetalhe) || null);
    } catch {
      setSelectedOrcamentoDetalhe(null);
    } finally {
      setLoadingOrcamentoDetalhe(false);
    }
  };

  useEffect(() => {
    carregarEncomendas();
    carregarStats();
    carregarOrcamentos();
  }, [carregarEncomendas, carregarStats, carregarOrcamentos]);

  const handleEncomendaUpdated = useCallback((updated: Encomenda) => {
    if (updated.status !== "em_entrega" && updated.status !== "pendente") {
      setEncomendas((prev) => prev.filter((e) => e.id !== updated.id));
    } else {
      setEncomendas((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    }
    // Recarrega stats pois os números podem ter mudado
    carregarStats();
    setSelectedEncomenda(null);
  }, [carregarStats]);

  const getProdutoLabel = (items: Encomenda["items"]) => {
    if (!items || items.length === 0) return "—";
    if (items.length === 1) return items[0].produto;
    return `${items.length} itens`;
  };


  return (
    <div className="min-h-[100dvh] flex bg-background-50">
      <AdminSidebar activeHref="/admin/dashboard" title="Dashboard" />

      {/* Main content */}
      <main className="flex-1 lg:pt-0 pt-14">
        <div className="px-4 md:px-8 py-6 md:py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-foreground-600">
                Resumo das operações · {new Date().toLocaleDateString("pt-PT", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <Link
              to="/encomenda"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center" />
              Nova encomenda
            </Link>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl border p-5 ${
                  stat.color === "primary"
                    ? "bg-primary-50 border-primary-200/60"
                    : stat.color === "accent"
                    ? "bg-accent-50 border-accent-200/60"
                    : "bg-secondary-50 border-secondary-200/60"
                }`}
              >
                <p className="text-sm text-foreground-600 mb-1">{stat.label}</p>
                <p
                  className={`font-heading text-2xl md:text-3xl font-bold ${
                    stat.color === "primary"
                      ? "text-primary-800"
                      : stat.color === "accent"
                      ? "text-accent-800"
                      : "text-secondary-800"
                  }`}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-foreground-500 mt-1">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Encomendas em curso */}
          <div className="rounded-xl bg-background-100 border border-background-200/70 overflow-hidden">
            <div className="px-5 py-4 border-b border-background-200/60 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-foreground-950">
                Encomendas em curso
              </h2>
              <Link
                to="/admin/encomendas"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors cursor-pointer flex items-center gap-1"
              >
                Ver todas
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              {loadingEncomendas ? (
                <div className="flex items-center justify-center py-12">
                  <i className="ri-loader-4-line animate-spin text-xl w-5 h-5 flex items-center justify-center text-foreground-400" />
                </div>
              ) : encomendas.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background-200/60 mx-auto mb-3">
                    <i className="ri-check-double-line text-lg w-5 h-5 flex items-center justify-center text-foreground-400" />
                  </div>
                  <p className="text-sm text-foreground-600">Nenhuma encomenda em curso.</p>
                  <p className="text-xs text-foreground-400 mt-1">Encomendas com estado "Em entrega" ou "A levantar" aparecerão aqui.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-background-200/60">
                      <th className="text-left px-5 py-3 font-medium text-foreground-600">ID</th>
                      <th className="text-left px-5 py-3 font-medium text-foreground-600">Cliente</th>
                      <th className="text-left px-5 py-3 font-medium text-foreground-600 hidden md:table-cell">Produto</th>
                      <th className="text-left px-5 py-3 font-medium text-foreground-600">Data</th>
                      <th className="text-left px-5 py-3 font-medium text-foreground-600">Estado</th>
                      <th className="text-right px-5 py-3 font-medium text-foreground-600">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {encomendas.map((e) => (
                      <tr
                        key={e.id}
                        onClick={() => setSelectedEncomenda(e)}
                        className="border-b border-background-200/40 hover:bg-background-50/60 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3.5 font-mono text-xs font-medium text-foreground-800">{e.id}</td>
                        <td className="px-5 py-3.5 text-foreground-700">{e.nome}</td>
                        <td className="px-5 py-3.5 text-foreground-700 hidden md:table-cell max-w-[220px] truncate">{getProdutoLabel(e.items)}</td>
                        <td className="px-5 py-3.5 text-foreground-600 whitespace-nowrap">{formatDate(e.created_at)}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${STATUS_COLOR[e.status] || "bg-background-200 text-foreground-600 border-background-300"}`}
                          >
                            {STATUS_LABEL[e.status] || e.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-medium text-foreground-800 whitespace-nowrap">
                          {e.subtotal != null ? `${e.subtotal.toFixed(2).replace(".", ",")} €` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Modal de detalhes */}
          {selectedEncomenda && (
            <EncomendaDetailModal
              encomenda={selectedEncomenda}
              onClose={() => setSelectedEncomenda(null)}
              onUpdated={handleEncomendaUpdated}
            />
          )}

          {/* Recent orcamentos */}
          <div className="mt-6 rounded-xl bg-background-100 border border-background-200/70 overflow-hidden">
            <div className="px-5 py-4 border-b border-background-200/60 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-foreground-950">
                Orçamentos em andamento
              </h2>
              <Link
                to="/admin/orcamentos"
                className="text-sm font-medium text-accent-600 hover:text-accent-500 transition-colors cursor-pointer flex items-center gap-1"
              >
                Ver todos
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              {loadingOrcamentos ? (
                <div className="flex items-center justify-center py-12">
                  <i className="ri-loader-4-line animate-spin text-xl w-5 h-5 flex items-center justify-center text-foreground-400" />
                </div>
              ) : recentOrcamentos.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background-200/60 mx-auto mb-3">
                    <i className="ri-file-list-3-line text-lg w-5 h-5 flex items-center justify-center text-foreground-400" />
                  </div>
                  <p className="text-sm text-foreground-600">Nenhum orçamento recebido ainda.</p>
                  <p className="text-xs text-foreground-400 mt-1">Os pedidos feitos na página &quot;Para Empresas&quot; aparecerão aqui.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-background-200/60">
                      <th className="text-left px-5 py-3 font-medium text-foreground-600">ID</th>
                      <th className="text-left px-5 py-3 font-medium text-foreground-600">Cliente</th>
                      <th className="text-left px-5 py-3 font-medium text-foreground-600 hidden md:table-cell">Empresa</th>
                      <th className="text-left px-5 py-3 font-medium text-foreground-600">Produto</th>
                      <th className="text-left px-5 py-3 font-medium text-foreground-600">Data</th>
                      <th className="text-left px-5 py-3 font-medium text-foreground-600">Prazo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrcamentos.map((orc) => {
                      const antecedenciaHoras = parseAntecedencia(
                        orc.produto_id ? antecedenciaMapDash[orc.produto_id] : null
                      );
                      const prazo = calcPrazoDash(orc.created_at, antecedenciaHoras);
                      return (
                        <tr
                          key={orc.id}
                          onClick={() => handleSelectOrcamentoDashboard(orc)}
                          className="border-b border-background-200/40 hover:bg-background-50/60 transition-colors cursor-pointer"
                        >
                          <td className="px-5 py-3.5 font-mono text-xs font-medium text-foreground-800">{orc.id}</td>
                          <td className="px-5 py-3.5 text-foreground-700">{orc.nome_destinatario}</td>
                          <td className="px-5 py-3.5 text-foreground-700 hidden md:table-cell">{orc.empresa_cliente || "—"}</td>
                          <td className="px-5 py-3.5 text-foreground-700 max-w-[220px] truncate">{orc.produto_nome || "—"}</td>
                          <td className="px-5 py-3.5 text-foreground-600 whitespace-nowrap">{formatDate(orc.created_at)}</td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            {prazo ? (
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-mono ${prazoBgClassDash(prazo.percentConsumed, prazo.vencido)}`}
                              >
                                <i className="ri-timer-line w-3.5 h-3.5 flex items-center justify-center mr-1.5" />
                                {prazo.display}
                                {prazo.vencido && (
                                  <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide opacity-80">vencido</span>
                                )}
                              </span>
                            ) : (
                              <span className="text-foreground-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/admin/catalogo"
              className="rounded-xl bg-background-100 border border-background-200/70 p-5 hover:border-primary-300/40 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-3">
                <i className="ri-cake-3-line text-lg w-5 h-5 flex items-center justify-center" />
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground-950">Gerir catálogo</h3>
              <p className="text-sm text-foreground-600 mt-1">Adicionar, editar ou arquivar produtos.</p>
              <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary-600 group-hover:text-primary-500 transition-colors">
                Abrir
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
              </span>
            </Link>
            <Link
              to="/admin/agenda"
              className="rounded-xl bg-background-100 border border-background-200/70 p-5 hover:border-primary-300/40 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-100 text-accent-600 mb-3">
                <i className="ri-calendar-line text-lg w-5 h-5 flex items-center justify-center" />
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground-950">Ver agenda</h3>
              <p className="text-sm text-foreground-600 mt-1">Encomendas por dia e capacidade.</p>
              <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-accent-600 group-hover:text-accent-500 transition-colors">
                Abrir
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
              </span>
            </Link>
            <Link
              to="/admin/clientes"
              className="rounded-xl bg-background-100 border border-background-200/70 p-5 hover:border-primary-300/40 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 text-secondary-600 mb-3">
                <i className="ri-team-line text-lg w-5 h-5 flex items-center justify-center" />
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground-950">Base de clientes</h3>
              <p className="text-sm text-foreground-600 mt-1">CRM com histórico e preferências.</p>
              <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-secondary-600 group-hover:text-secondary-500 transition-colors">
                Abrir
                <i className="ri-arrow-right-line w-4 h-5 flex items-center justify-center" />
              </span>
            </Link>
          </div>
        </div>

        {/* Modal de detalhes do orçamento */}
        {selectedOrcamentoDetalhe && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center py-6 px-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedOrcamentoDetalhe(null);
            }}
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-3xl bg-background-50 rounded-2xl overflow-hidden z-10">
              {loadingOrcamentoDetalhe ? (
                <div className="flex items-center justify-center py-20">
                  <i className="ri-loader-4-line animate-spin text-2xl w-6 h-6 flex items-center justify-center text-foreground-400" />
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="sticky top-0 z-10 bg-background-50 border-b border-background-200/70 px-6 py-5 flex items-center justify-between">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-foreground-950">
                        Orçamento #{selectedOrcamentoDetalhe.id}
                      </h2>
                      <p className="text-sm text-foreground-600 mt-0.5">
                        Recebido em {(() => {
                          const d = new Date(selectedOrcamentoDetalhe.created_at);
                          return d.toLocaleDateString("pt-PT", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          });
                        })()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedOrcamentoDetalhe(null)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-background-100 hover:bg-background-200/70 text-foreground-600 hover:text-foreground-950 transition-colors cursor-pointer whitespace-nowrap"
                      aria-label="Fechar"
                    >
                      <i className="ri-close-line text-xl w-5 h-5 flex items-center justify-center" />
                    </button>
                  </div>

                  <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-5">
                    {/* Identificação */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                        <i className="ri-file-copy-line w-4 h-4 flex items-center justify-center" />
                        Identificação do Orçamento
                      </h3>
                      <div className="flex items-center gap-6 p-4 rounded-xl bg-background-100/70 border border-background-200/60 flex-wrap">
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-foreground-500">ID Orçamento</p>
                          <p className="text-sm font-mono font-bold text-foreground-900">
                            {(() => {
                              const d = new Date(selectedOrcamentoDetalhe.created_at);
                              return `${d.getFullYear()}${String(selectedOrcamentoDetalhe.id).padStart(5, "0")}`;
                            })()}
                          </p>
                        </div>
                        <div className="w-px h-8 bg-background-300/60" />
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-foreground-500">Nº Proposta</p>
                          <p className="text-sm font-mono font-bold text-foreground-900">
                            {(() => {
                              const d = new Date(selectedOrcamentoDetalhe.created_at);
                              return `MGR${d.getFullYear()}${String(selectedOrcamentoDetalhe.id).padStart(5, "0")}`;
                            })()}
                          </p>
                        </div>
                        <div className="w-px h-8 bg-background-300/60" />
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-foreground-500">Validade</p>
                          <p className="text-sm font-bold text-foreground-900">
                            {selectedOrcamentoDetalhe.validade ?? 30} dias
                          </p>
                        </div>
                        <div className="w-px h-8 bg-background-300/60" />
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-foreground-500">Prazo</p>
                          {(() => {
                            const antecedenciaHoras = parseAntecedencia(
                              selectedOrcamentoDetalhe.produto_id
                                ? antecedenciaMapDash[selectedOrcamentoDetalhe.produto_id]
                                : null
                            );
                            const prazo = calcPrazoDash(selectedOrcamentoDetalhe.created_at, antecedenciaHoras);
                            if (!prazo) return <p className="text-sm text-foreground-400">—</p>;
                            return (
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-mono ${prazoBgClassDash(prazo.percentConsumed, prazo.vencido)}`}>
                                <i className="ri-timer-line w-3.5 h-3.5 flex items-center justify-center mr-1.5" />
                                {prazo.display}
                                {prazo.vencido && (
                                  <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide opacity-80">vencido</span>
                                )}
                              </span>
                            );
                          })()}
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
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.empresa_cliente || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">NIP / NIF</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.nip_nif_cliente || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Nome do Estabelecimento</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.estabelecimento || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Nome</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.nome_destinatario}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Cargo / Função</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.funcao_cliente || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Email</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Telemóvel</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.telemovel || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">WhatsApp</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">
                            {selectedOrcamentoDetalhe.possui_whatsapp ? "Sim" : "Não"}
                          </p>
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
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.produto_nome || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Data Limite</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">
                            {selectedOrcamentoDetalhe.data_limite
                              ? new Date(selectedOrcamentoDetalhe.data_limite).toLocaleDateString("pt-PT", {
                                  day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                                })
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Tipo de Orçamento</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.tipo_orcamento || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Tamanho</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.tamanho_nome || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Formato</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.formato || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Formato Específico</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.formato_especifico || "—"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Descrição do produto */}
                    {selectedOrcamentoDetalhe.produto_descricao && (
                      <div>
                        <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                          <i className="ri-file-text-line w-4 h-4 flex items-center justify-center" />
                          Descrição do Produto
                        </h3>
                        <div className="p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                          <p className="text-sm text-foreground-700 leading-relaxed">{selectedOrcamentoDetalhe.produto_descricao}</p>
                        </div>
                      </div>
                    )}

                    {/* Dados Financeiros */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                        <i className="ri-money-euro-circle-line w-4 h-4 flex items-center justify-center" />
                        Dados Financeiros
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                        <div>
                          <p className="text-xs text-foreground-500">Qtd</p>
                          <p className="text-sm font-bold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.quantidade ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Unidade</p>
                          <p className="text-sm font-bold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.unidade || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Preço Unitário</p>
                          <p className="text-sm font-bold text-foreground-900 mt-0.5">
                            {selectedOrcamentoDetalhe.pco_unit != null
                              ? `${selectedOrcamentoDetalhe.pco_unit.toFixed(2).replace(".", ",")} €`
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Preço Total</p>
                          <p className="text-sm font-bold text-foreground-900 mt-0.5">
                            {selectedOrcamentoDetalhe.pco_total != null
                              ? `${selectedOrcamentoDetalhe.pco_total.toFixed(2).replace(".", ",")} €`
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Subtotal</p>
                          <p className="text-sm font-bold text-foreground-900 mt-0.5">
                            {selectedOrcamentoDetalhe.subtotal != null
                              ? `${selectedOrcamentoDetalhe.subtotal.toFixed(2).replace(".", ",")} €`
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">Desconto</p>
                          <p className="text-sm font-bold text-foreground-900 mt-0.5">
                            {selectedOrcamentoDetalhe.desconto != null
                              ? `${selectedOrcamentoDetalhe.desconto}%`
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground-500">IVA 23%</p>
                          <p className="text-sm font-bold text-foreground-900 mt-0.5">
                            {selectedOrcamentoDetalhe.iva != null
                              ? `${selectedOrcamentoDetalhe.iva.toFixed(2).replace(".", ",")} €`
                              : "—"}
                          </p>
                        </div>
                        <div className="col-span-2 sm:col-span-4 bg-background-300/60 rounded-lg p-3 flex items-center justify-between">
                          <p className="text-xs font-semibold text-foreground-800">TOTAL (com IVA)</p>
                          <p className="text-sm font-bold text-foreground-900">
                            {selectedOrcamentoDetalhe.total_orcamento != null
                              ? `${selectedOrcamentoDetalhe.total_orcamento.toFixed(2).replace(".", ",")} €`
                              : "—"}
                          </p>
                        </div>
                        <div className="col-span-2 sm:col-span-4">
                          <p className="text-xs text-foreground-500">Prazos de Pagamento</p>
                          <p className="text-sm font-semibold text-foreground-900 mt-0.5">{selectedOrcamentoDetalhe.prazos_pagamento || "—"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Mensagem especial */}
                    {selectedOrcamentoDetalhe.mensagem_especial && (
                      <div>
                        <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                          <i className="ri-chat-quote-line w-4 h-4 flex items-center justify-center" />
                          Mensagem Especial
                        </h3>
                        <div className="p-4 rounded-xl bg-accent-100 border border-accent-200">
                          <p className="text-sm font-medium text-foreground-900 italic">{selectedOrcamentoDetalhe.mensagem_especial}</p>
                        </div>
                      </div>
                    )}

                    {/* Alergias */}
                    {selectedOrcamentoDetalhe.alergias_restricoes && (
                      <div>
                        <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                          <i className="ri-virus-line w-4 h-4 flex items-center justify-center" />
                          Alergias / Restrições
                        </h3>
                        <div className="p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                          <div className="flex flex-wrap gap-2">
                            {selectedOrcamentoDetalhe.alergias_restricoes.split(",").map((a, i) => {
                              const trimmed = a.trim();
                              if (!trimmed) return null;
                              return (
                                <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary-100 text-secondary-800 text-xs font-medium border border-secondary-200">
                                  {trimmed}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Informações adicionais */}
                    {selectedOrcamentoDetalhe.informacoes_adicionais && (
                      <div>
                        <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
                          <i className="ri-information-line w-4 h-4 flex items-center justify-center" />
                          Informações Adicionais
                        </h3>
                        <div className="p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                          <p className="text-sm text-foreground-700 leading-relaxed whitespace-pre-wrap">{selectedOrcamentoDetalhe.informacoes_adicionais}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="sticky bottom-0 bg-background-50 border-t border-background-200/70 px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedOrcamentoDetalhe(null)}
                      className="px-6 py-2.5 rounded-full bg-background-100 border border-background-200/70 text-foreground-700 text-sm font-medium hover:bg-background-200/60 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Fechar
                    </button>
                    <Link
                      to={`/admin/orcamentos?open=${selectedOrcamentoDetalhe.id}`}
                      className="sm:ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-external-link-line w-4 h-4 flex items-center justify-center" />
                      Abrir nos Orçamentos
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}