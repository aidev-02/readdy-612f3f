import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";
import EncomendaDetailModal from "@/pages/admin/components/EncomendaDetailModal";
import type { Encomenda } from "@/pages/admin/components/encomendaUtils";
import {
  STATUS_OPCOES,
  STATUS_LABEL,
  STATUS_COLOR,
  formatPrazoHoras,
  calcPrazoTotalEncomenda,
  calcPrazoRestante,
  prazoBgClass,
  formatDate,
  formatDateTime,
  totalItems,
} from "@/pages/admin/components/encomendaUtils";

export default function AdminEncomendasPage() {
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Encomenda | null>(null);

  /* Filtros */
  const [showEntregues, setShowEntregues] = useState(false);
  const [showDevolvidos, setShowDevolvidos] = useState(false);
  const [showAguardandoPagamento, setShowAguardandoPagamento] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const carregar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await supabase
        .from("encomendas")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;

      const parsed = ((data || []) as Encomenda[]).map((e) => ({
        ...e,
        items: typeof e.items === "string" ? JSON.parse(e.items as string) : (e.items || []),
      }));
      setEncomendas(parsed);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao carregar encomendas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  /* Filtragem */
  const filteredEncomendas = useMemo(() => {
    let result = encomendas;

    const filtroAtivo = showEntregues || showDevolvidos || showAguardandoPagamento;

    if (!filtroAtivo) {
      // Default: esconde entregues, devolvidos e aguardando pagamento
      result = result.filter((e) => e.status !== "entregue" && e.status !== "devolvido" && e.status !== "Aguardando pagamento");
    } else {
      // Checkbox marcados: inclui só os status selecionados
      const allowed: string[] = [];
      if (showEntregues) allowed.push("entregue");
      if (showDevolvidos) allowed.push("devolvido");
      if (showAguardandoPagamento) allowed.push("Aguardando pagamento");
      result = result.filter((e) => allowed.includes(e.status));
    }

    // Filtro por período (só quando filtro está ativo)
    if (filtroAtivo && (dateFrom || dateTo)) {
      result = result.filter((e) => {
        const createdAt = new Date(e.created_at);
        if (dateFrom) {
          const from = new Date(dateFrom);
          from.setHours(0, 0, 0, 0);
          if (createdAt < from) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          if (createdAt > to) return false;
        }
        return true;
      });
    }

    return result;
  }, [encomendas, showEntregues, showDevolvidos, showAguardandoPagamento, dateFrom, dateTo]);

  const handleSelect = (e: Encomenda) => {
    setSelected(e);
  };

  const handleDelete = async (e: Encomenda, ev: React.MouseEvent) => {
    ev.stopPropagation();
    if (!window.confirm(`Tem a certeza que deseja excluir a encomenda #${e.id}? Esta ação não pode ser desfeita.`)) return;

    try {
      const { error: err } = await supabase
        .from("encomendas")
        .delete()
        .eq("id", e.id);

      if (err) throw err;

      setEncomendas((prev) => prev.filter((o) => o.id !== e.id));
      if (selected?.id === e.id) setSelected(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao excluir encomenda.");
    }
  };

  const handleUpdated = (updated: Encomenda) => {
    setEncomendas((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setSelected(null);
  };

  const filtroAtivo = showEntregues || showDevolvidos || showAguardandoPagamento;

  return (
    <div className="min-h-[100dvh] flex bg-background-50">
      <AdminSidebar activeHref="/admin/encomendas" title="Encomendas" />

      <main className="flex-1 lg:pt-0 pt-14">
        <div className="px-4 md:px-8 py-6 md:py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">
                Encomendas
              </h1>
              <p className="mt-1 text-sm text-foreground-600">
                {filteredEncomendas.length} encomenda{filteredEncomendas.length !== 1 ? "s" : ""} {filtroAtivo ? "encontrada" : "pendente"}{filteredEncomendas.length !== 1 ? "s" : ""}
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

          {/* Filtro de status + período */}
          <div className="mb-5 p-4 rounded-xl bg-background-100 border border-background-200/70">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm font-semibold text-foreground-700 whitespace-nowrap">Mostrar também:</p>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEntregues}
                  onChange={(ev) => setShowEntregues(ev.target.checked)}
                  className="w-4 h-4 rounded border-background-300 text-emerald-600 focus:ring-emerald-400 cursor-pointer"
                />
                <span className="text-sm text-foreground-700 font-medium whitespace-nowrap">Entregues</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDevolvidos}
                  onChange={(ev) => setShowDevolvidos(ev.target.checked)}
                  className="w-4 h-4 rounded border-background-300 text-rose-600 focus:ring-rose-400 cursor-pointer"
                />
                <span className="text-sm text-foreground-700 font-medium whitespace-nowrap">Devolvidos</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAguardandoPagamento}
                  onChange={(ev) => setShowAguardandoPagamento(ev.target.checked)}
                  className="w-4 h-4 rounded border-background-300 text-orange-600 focus:ring-orange-400 cursor-pointer"
                />
                <span className="text-sm text-foreground-700 font-medium whitespace-nowrap">Aguardando pagamento</span>
              </label>

              {filtroAtivo && (
                <div className="flex flex-wrap items-center gap-3 ml-0 sm:ml-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-foreground-500 font-medium whitespace-nowrap">De:</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(ev) => setDateFrom(ev.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-background-200 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-foreground-500 font-medium whitespace-nowrap">Até:</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(ev) => setDateTo(ev.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-background-200 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
                    />
                  </div>

                  {(dateFrom || dateTo) && (
                    <button
                      type="button"
                      onClick={() => { setDateFrom(""); setDateTo(""); }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground-500 hover:text-foreground-700 hover:bg-background-200/60 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-close-line w-3.5 h-3.5 flex items-center justify-center" />
                      Limpar datas
                    </button>
                  )}
                </div>
              )}
            </div>
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
          ) : filteredEncomendas.length === 0 ? (
            <div className="rounded-xl bg-background-100 border border-background-200/70 py-16 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-background-200/60 mx-auto mb-4">
                <i className="ri-shopping-bag-3-line text-xl w-6 h-6 flex items-center justify-center text-foreground-400" />
              </div>
              <p className="text-foreground-600 text-sm">Nenhuma encomenda encontrada.</p>
              <p className="text-foreground-400 text-xs mt-1">
                {filtroAtivo
                  ? "Tente ajustar os filtros de estado ou período."
                  : "Os pedidos feitos na página de encomenda aparecerão aqui."}
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
                      <th className="text-left px-4 py-3 font-medium text-foreground-600">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600">Prazo</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600">Prazo restante</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600">Cliente</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600 hidden md:table-cell">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600 hidden lg:table-cell">Telemóvel</th>
                      <th className="text-center px-4 py-3 font-medium text-foreground-600">Itens</th>
                      <th className="text-right px-4 py-3 font-medium text-foreground-600">Valor</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600 hidden md:table-cell">Entrega</th>
                      <th className="text-center px-4 py-3 font-medium text-foreground-600 w-14">Det.</th>
                      <th className="text-center px-4 py-3 font-medium text-foreground-600 w-14">Excl.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEncomendas.map((e) => {
                      const prazoTotalHoras = calcPrazoTotalEncomenda(e.created_at, e.data_entrega);
                      const prazo = calcPrazoRestante(e.created_at, e.data_entrega);
                      return (
                        <tr
                          key={e.id}
                          onClick={() => handleSelect(e)}
                          className="border-b border-background-200/40 hover:bg-background-50/60 transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-3 text-foreground-500 font-mono text-xs">{e.id}</td>
                          <td className="px-4 py-3 text-foreground-700 whitespace-nowrap">
                            {formatDateTime(e.created_at)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${STATUS_COLOR[e.status] || "bg-background-200 text-foreground-600 border-background-300"}`}>
                              {STATUS_LABEL[e.status] || e.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {prazoTotalHoras !== null ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-mono bg-background-200/50 text-foreground-700">
                                <i className="ri-time-line w-3.5 h-3.5 flex items-center justify-center mr-1.5" />
                                {formatPrazoHoras(prazoTotalHoras)}
                              </span>
                            ) : (
                              <span className="text-foreground-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {!prazo ? (
                              <span className="text-foreground-400">—</span>
                            ) : (() => {
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
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-4 py-3 text-foreground-800 font-medium">{e.nome}</td>
                          <td className="px-4 py-3 text-foreground-600 hidden md:table-cell">{e.email}</td>
                          <td className="px-4 py-3 text-foreground-600 whitespace-nowrap hidden lg:table-cell">{e.telefone || "—"}</td>
                          <td className="px-4 py-3 text-center text-foreground-700">{totalItems(e.items)}</td>
                          <td className="px-4 py-3 text-right text-foreground-800 font-semibold whitespace-nowrap">
                            {e.subtotal != null ? `${e.subtotal.toFixed(2).replace(".", ",")} €` : "—"}
                          </td>
                          <td className="px-4 py-3 text-foreground-600 hidden md:table-cell whitespace-nowrap">
                            {e.tipo_entrega === "delivery" ? "Delivery" : "Levantamento"}
                            {e.data_entrega && (
                              <span className="block text-xs text-foreground-400">{formatDate(e.data_entrega)}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={(ev) => { ev.stopPropagation(); handleSelect(e); }}
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-background-200/60 text-foreground-500 hover:text-foreground-700 transition-colors cursor-pointer whitespace-nowrap"
                              title="Ver detalhes"
                            >
                              <i className="ri-eye-line w-4 h-4 flex items-center justify-center" />
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={(ev) => handleDelete(e, ev)}
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-red-100 text-foreground-400 hover:text-red-600 transition-colors cursor-pointer whitespace-nowrap"
                              title="Excluir encomenda"
                            >
                              <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal de detalhes */}
          {selected && (
            <EncomendaDetailModal
              encomenda={selected}
              onClose={() => setSelected(null)}
              onUpdated={handleUpdated}
            />
          )}
        </div>
      </main>
    </div>
  );
}