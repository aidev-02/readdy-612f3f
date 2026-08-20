import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Encomenda } from "@/pages/admin/components/encomendaUtils";
import {
  STATUS_OPCOES,
  STATUS_LABEL,
  formatPrazoHoras,
  calcPrazoTotalEncomenda,
  calcPrazoRestante,
  prazoBgClass,
  formatDate,
  formatDateTime,
  totalItems,
} from "@/pages/admin/components/encomendaUtils";

interface EncomendaDetailModalProps {
  encomenda: Encomenda;
  onClose: () => void;
  onUpdated: (updated: Encomenda) => void;
}

export default function EncomendaDetailModal({ encomenda, onClose, onUpdated }: EncomendaDetailModalProps) {
  const [editStatus, setEditStatus] = useState(encomenda.status || "pendente");
  const [editNotas, setEditNotas] = useState(encomenda.notas || "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);

    try {
      const { error: err } = await supabase
        .from("encomendas")
        .update({
          status: editStatus,
          notas: editNotas || null,
        })
        .eq("id", encomenda.id);

      if (err) throw err;

      const updated = { ...encomenda, status: editStatus, notas: editNotas || null };
      onUpdated(updated);
      onClose();
    } catch (e: unknown) {
      setSaveMsg({ type: "error", msg: e instanceof Error ? e.message : "Erro ao guardar." });
    } finally {
      setSaving(false);
    }
  };

  const handleAtendido = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const novoStatus = "em_entrega";
      const { error: err } = await supabase
        .from("encomendas")
        .update({ status: novoStatus })
        .eq("id", encomenda.id);
      if (err) throw err;
      const updated = { ...encomenda, status: novoStatus };
      onUpdated(updated);
      onClose();
    } catch (e: unknown) {
      setSaveMsg({ type: "error", msg: e instanceof Error ? e.message : "Erro ao atualizar." });
    } finally {
      setSaving(false);
    }
  };

  const handleEntregue = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const novoStatus = "entregue";
      const { error: err } = await supabase
        .from("encomendas")
        .update({ status: novoStatus })
        .eq("id", encomenda.id);
      if (err) throw err;
      const updated = { ...encomenda, status: novoStatus };
      onUpdated(updated);
      onClose();
    } catch (e: unknown) {
      setSaveMsg({ type: "error", msg: e instanceof Error ? e.message : "Erro ao atualizar." });
    } finally {
      setSaving(false);
    }
  };

  const handleDevolvido = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const novoStatus = "devolvido";
      const { error: err } = await supabase
        .from("encomendas")
        .update({ status: novoStatus })
        .eq("id", encomenda.id);
      if (err) throw err;
      const updated = { ...encomenda, status: novoStatus };
      onUpdated(updated);
      onClose();
    } catch (e: unknown) {
      setSaveMsg({ type: "error", msg: e instanceof Error ? e.message : "Erro ao atualizar." });
    } finally {
      setSaving(false);
    }
  };

  const statusAtual = encomenda.status;
  const isFinalizado = ["entregue", "devolvido", "cancelada"].includes(statusAtual);
  const isEmEntrega = statusAtual === "em_entrega";
  const podeAtendido = !isEmEntrega && !isFinalizado;
  const podeEntregue = isEmEntrega;
  const podeDevolvido = isEmEntrega;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center py-6 px-4 overflow-y-auto"
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) { onClose(); setSaveMsg(null); }
      }}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-3xl bg-background-50 rounded-2xl overflow-hidden z-10">
        <div className="sticky top-0 z-10 bg-background-50 border-b border-background-200/70 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground-950">
              Encomenda #{encomenda.id}
            </h2>
            <p className="text-sm text-foreground-600 mt-0.5">
              Recebida em {formatDateTime(encomenda.created_at)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-background-100 hover:bg-background-200/70 text-foreground-600 hover:text-foreground-950 transition-colors cursor-pointer whitespace-nowrap"
            aria-label="Fechar"
          >
            <i className="ri-close-line text-xl w-5 h-5 flex items-center justify-center" />
          </button>
        </div>

        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Status + Prazo */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
              <i className="ri-timer-line w-4 h-4 flex items-center justify-center" />
              Prazo da Encomenda
            </h3>
            <div className="flex items-center gap-6 p-4 rounded-xl bg-background-100/70 border border-background-200/60 flex-wrap">
              <div className="flex items-center gap-3">
                <p className="text-xs text-foreground-500">Prazo total</p>
                {(() => {
                  const total = calcPrazoTotalEncomenda(encomenda.created_at, encomenda.data_entrega);
                  return total !== null ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-mono bg-background-200/50 text-foreground-700">
                      <i className="ri-time-line w-3.5 h-3.5 flex items-center justify-center mr-1.5" />
                      {formatPrazoHoras(total)}
                    </span>
                  ) : (
                    <span className="text-sm text-foreground-400">—</span>
                  );
                })()}
              </div>
              <div className="w-px h-8 bg-background-300/60 hidden sm:block" />
              <div className="flex items-center gap-3">
                <p className="text-xs text-foreground-500">Prazo restante</p>
                {(() => {
                  const rest = calcPrazoRestante(encomenda.created_at, encomenda.data_entrega);
                  if (!rest) return <span className="text-sm text-foreground-400">—</span>;
                  const bgClass = rest.vencido
                    ? "bg-red-500/20 text-red-800"
                    : prazoBgClass(rest.percentConsumed);
                  return (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-mono ${bgClass}`}>
                      <i className="ri-timer-line w-3.5 h-3.5 flex items-center justify-center mr-1.5" />
                      {rest.display}
                      {rest.vencido && (
                        <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide opacity-80">vencido</span>
                      )}
                    </span>
                  );
                })()}
              </div>
              <div className="w-px h-8 bg-background-300/60 hidden sm:block" />
              <div className="flex items-center gap-3">
                <p className="text-xs text-foreground-500">Data de Entrega</p>
                <p className="text-sm font-semibold text-foreground-900">{formatDate(encomenda.data_entrega)}</p>
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
                <p className="text-xs text-foreground-500">Nome</p>
                <p className="text-sm font-semibold text-foreground-900 mt-0.5">{encomenda.nome}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-500">Email</p>
                <p className="text-sm font-semibold text-foreground-900 mt-0.5">{encomenda.email}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-500">Telefone</p>
                <p className="text-sm font-semibold text-foreground-900 mt-0.5">{encomenda.telefone || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-500">NIF</p>
                <p className="text-sm font-semibold text-foreground-900 mt-0.5">{encomenda.nif || "—"}</p>
              </div>
            </div>
          </div>

          {/* Entrega */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
              <i className="ri-truck-line w-4 h-4 flex items-center justify-center" />
              Entrega
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-background-100/70 border border-background-200/60">
              <div>
                <p className="text-xs text-foreground-500">Tipo</p>
                <p className="text-sm font-semibold text-foreground-900 mt-0.5">
                  {encomenda.tipo_entrega === "delivery" ? "Delivery" : "Levantamento na loja"}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground-500">Data de entrega</p>
                <p className="text-sm font-semibold text-foreground-900 mt-0.5">{formatDate(encomenda.data_entrega)}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-500">Horário</p>
                <p className="text-sm font-semibold text-foreground-900 mt-0.5">{encomenda.horario || "—"}</p>
              </div>
              {encomenda.tipo_entrega === "delivery" && (
                <div>
                  <p className="text-xs text-foreground-500">Morada</p>
                  <p className="text-sm font-semibold text-foreground-900 mt-0.5">{encomenda.morada || "—"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Itens */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
              <i className="ri-file-list-3-line w-4 h-4 flex items-center justify-center" />
              Itens do Pedido ({totalItems(encomenda.items)} {totalItems(encomenda.items) === 1 ? "item" : "itens"})
            </h3>
            <div className="divide-y divide-background-200/60 rounded-xl bg-background-100/70 border border-background-200/60 overflow-hidden">
              {(encomenda.items || []).length === 0 ? (
                <div className="p-4 text-sm text-foreground-500">Nenhum item registado.</div>
              ) : (
                (encomenda.items || []).map((item, idx) => (
                  <div key={idx} className="p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground-900">{item.produto}</p>
                      <p className="text-xs text-foreground-500">{item.variacao}</p>
                      {item.mensagem && (
                        <p className="text-xs text-foreground-500 mt-0.5 italic">
                          &ldquo;{item.mensagem}&rdquo;
                        </p>
                      )}
                      {item.alergias && item.alergias.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.alergias.map((a, i) => (
                            <span key={i} className="inline-flex px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-700 text-[10px] font-medium">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-primary-600">{item.preco}</p>
                      <p className="text-xs text-foreground-400">Qtd: {item.quantidade}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
              <span className="text-sm text-foreground-600">Subtotal</span>
              <span className="font-heading text-lg font-bold text-primary-600">
                {encomenda.subtotal != null
                  ? `${encomenda.subtotal.toFixed(2).replace(".", ",")} €`
                  : "Sob consulta"}
              </span>
            </div>
          </div>

          {/* Notas */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
              <i className="ri-sticky-note-line w-4 h-4 flex items-center justify-center" />
              Notas
            </h3>
            <div className="p-4 rounded-xl bg-background-100/70 border border-background-200/60">
              <textarea
                value={editNotas}
                onChange={(ev) => setEditNotas(ev.target.value)}
                placeholder="Notas internas sobre esta encomenda..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
              <i className="ri-flag-line w-4 h-4 flex items-center justify-center" />
              Estado da Encomenda
            </h3>
            <div className="p-4 rounded-xl bg-background-100/70 border border-background-200/60">
              <select
                value={editStatus}
                onChange={(ev) => setEditStatus(ev.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm font-semibold focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors appearance-none cursor-pointer"
              >
                {STATUS_OPCOES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background-50 border-t border-background-200/70 px-6 py-4">
          {saveMsg && (
            <div
              className={`mb-4 p-3 rounded-xl flex items-center gap-2.5 text-sm ${
                saveMsg.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              <i
                className={`w-4 h-4 flex items-center justify-center flex-shrink-0 ${
                  saveMsg.type === "success" ? "ri-check-line" : "ri-error-warning-line"
                }`}
              />
              <span>{saveMsg.msg}</span>
            </div>
          )}

          {/* Botões de workflow + Guardar + Fechar na mesma linha */}
          <div className="flex items-center gap-3">
            {!isFinalizado && (
              <>
                <button
                  type="button"
                  onClick={handleAtendido}
                  disabled={saving || !podeAtendido}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-500 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-600"
                >
                  <i className="ri-check-line w-4 h-4 flex items-center justify-center" />
                  {saving ? "A processar..." : "Atendido"}
                </button>
                <button
                  type="button"
                  onClick={handleEntregue}
                  disabled={saving || !podeEntregue}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-700"
                >
                  <i className="ri-check-double-line w-4 h-4 flex items-center justify-center" />
                  {saving ? "A processar..." : "Entregue"}
                </button>
                <button
                  type="button"
                  onClick={handleDevolvido}
                  disabled={saving || !podeDevolvido}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-700"
                >
                  <i className="ri-arrow-go-back-line w-4 h-4 flex items-center justify-center" />
                  {saving ? "A processar..." : "Devolvido"}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary-500 hover:bg-secondary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {saving ? (
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

            <button
              type="button"
              onClick={onClose}
              className="ml-auto px-6 py-2.5 rounded-full bg-background-100 border border-background-200/70 text-foreground-700 text-sm font-medium hover:bg-background-200/60 transition-colors cursor-pointer whitespace-nowrap"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}