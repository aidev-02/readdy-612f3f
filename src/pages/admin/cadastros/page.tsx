import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";
import TemplateProposta from "./components/TemplateProposta";

/* ------------------------------------------------------------------ */
/*  Definição dos cadastros (tabs)                                     */
/* ------------------------------------------------------------------ */
interface ExtraColumn {
  key: string;
  label: string;
  type: 'select' | 'number' | 'checkbox';
  sourceTable?: string;
  sourceColumn?: string;
  width?: string;
}

interface CadastroDef {
  key: string;
  label: string;
  icon: string;
  table: string;
  extraColumns?: ExtraColumn[];
}

const cadastrosDefs: CadastroDef[] = [
  { key: "familia", label: "Família", icon: "ri-folder-2-line", table: "product_categories" },
  { key: "alergenicos", label: "Alergénicos", icon: "ri-virus-line", table: "admin_alergenicos" },
  { key: "ingredientes", label: "Ingredientes", icon: "ri-leaf-line", table: "admin_ingredientes", extraColumns: [
    { key: "quantidade", label: "Quantidade", type: "number" },
    { key: "unidade_medida_id", label: "Unidade", type: "select", sourceTable: "admin_unidades_medida", sourceColumn: "nome" },
    { key: "preco_venda", label: "Preço Venda", type: "number" },
    { key: "orcamento", label: "Orçamento", type: "checkbox" },
  ] },
  { key: "disponibilidade", label: "Disponibilidade", icon: "ri-time-line", table: "admin_disponibilidade" },
  { key: "categorias-b2b", label: "Categorias B2B", icon: "ri-building-2-line", table: "admin_categorias_b2b" },
  { key: "tipo-orcamento", label: "Tipo de Orçamento", icon: "ri-file-list-3-line", table: "admin_tipos_orcamento" },
  { key: "tamanho", label: "Tamanho", icon: "ri-ruler-line", table: "admin_tamanhos" },
  { key: "formato", label: "Formato", icon: "ri-shapes-line", table: "admin_formatos" },
  { key: "unidade-medida", label: "Unidade de Medida", icon: "ri-scales-3-line", table: "admin_unidades_medida" },
  { key: "template-proposta", label: "TemplateProposta", icon: "ri-file-word-2-line", table: "admin_template_proposta" },
];

/* ------------------------------------------------------------------ */
/*  Linha de registo                                                   */
/* ------------------------------------------------------------------ */
interface Registro {
  id: number;
  nome: string;
  sort_order: number;
  [key: string]: any;
}

interface CadastroTableProps {
  def: CadastroDef;
}

function CadastroTable({ def }: CadastroTableProps) {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [adding, setAdding] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [saving, setSaving] = useState(false);

  const extraCols = useMemo(() => def.extraColumns || [], [def.extraColumns]);
  const [selectOptions, setSelectOptions] = useState<Record<string, { id: number; nome: string }[]>>({});
  const [editExtra, setEditExtra] = useState<Record<string, any>>({});
  const [newExtra, setNewExtra] = useState<Record<string, any>>({});

  const column = def.table === "product_categories" ? "name" : "nome";

  useEffect(() => {
    const loadOptions = async () => {
      const opts: Record<string, { id: number; nome: string }[]> = {};
      for (const col of extraCols) {
        if (col.type === "select" && col.sourceTable && col.sourceColumn) {
          const { data } = await supabase
            .from(col.sourceTable)
            .select(`id, ${col.sourceColumn}`)
            .order("sort_order");
          opts[col.key] = (data || []).map((r: any) => ({
            id: r.id,
            nome: r[col.sourceColumn!] || "",
          }));
        }
      }
      setSelectOptions(opts);
    };
    loadOptions();
  }, [def.key]);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const selectCols = extraCols.length > 0
        ? `id, ${column}, sort_order, ${extraCols.map((c) => c.key).join(", ")}`
        : `id, ${column}, sort_order`;
      const { data, error: err } = await supabase
        .from(def.table)
        .select(selectCols)
        .order("sort_order")
        .order("id");
      if (err) throw err;
      const mapped: Registro[] = (data || []).map((r: any) => {
        const obj: Registro = {
          id: r.id,
          nome: r[column] || "",
          sort_order: r.sort_order ?? 0,
        };
        extraCols.forEach((col) => {
          obj[col.key] = r[col.key];
        });
        return obj;
      });
      setRegistros(mapped);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [def.table, column, extraCols]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem a certeza que deseja eliminar este registo?")) return;
    try {
      const { error: err } = await supabase.from(def.table).delete().eq("id", id);
      if (err) throw err;
      setRegistros((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      alert(e?.message || "Erro ao eliminar.");
    }
  };

  const startEdit = (r: Registro) => {
    setEditingId(r.id);
    setEditNome(r.nome);
    setAdding(false);
    setNewNome("");
    const extra: Record<string, any> = {};
    extraCols.forEach((col) => {
      extra[col.key] = r[col.key] ?? (col.type === "checkbox" ? false : col.type === "number" ? "" : "");
    });
    setEditExtra(extra);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNome("");
    setEditExtra({});
  };

  const saveEdit = async (id: number) => {
    if (!editNome.trim()) return;
    setSaving(true);
    const updateData: Record<string, any> = { [column]: editNome.trim(), updated_at: new Date().toISOString() };
    extraCols.forEach((col) => {
      if (col.type === "checkbox") {
        updateData[col.key] = editExtra[col.key] === true;
      } else if (col.type === "number") {
        const val = editExtra[col.key];
        updateData[col.key] = val === "" || val === undefined ? null : parseFloat(val);
      } else {
        const val = editExtra[col.key];
        updateData[col.key] = val === "" || val === undefined ? null : val;
      }
    });
    try {
      const { error: err } = await supabase
        .from(def.table)
        .update(updateData)
        .eq("id", id);
      if (err) throw err;
      setRegistros((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const updated = { ...r, nome: editNome.trim() };
          extraCols.forEach((col) => {
            if (col.type === "checkbox") {
              updated[col.key] = editExtra[col.key] === true;
            } else if (col.type === "number") {
              const val = editExtra[col.key];
              updated[col.key] = val === "" || val === undefined ? null : parseFloat(val);
            } else {
              const val = editExtra[col.key];
              updated[col.key] = val === "" || val === undefined ? null : val;
            }
          });
          return updated;
        })
      );
      setEditingId(null);
      setEditNome("");
      setEditExtra({});
    } catch (e: any) {
      alert(e?.message || "Erro ao guardar.");
    } finally {
      setSaving(false);
    }
  };

  const startAdd = () => {
    setAdding(true);
    setNewNome("");
    setEditingId(null);
    setEditNome("");
    const extra: Record<string, any> = {};
    extraCols.forEach((col) => {
      extra[col.key] = col.type === "checkbox" ? true : "";
    });
    setNewExtra(extra);
  };

  const cancelAdd = () => {
    setAdding(false);
    setNewNome("");
    setNewExtra({});
  };

  const saveAdd = async () => {
    if (!newNome.trim()) return;
    setSaving(true);
    const maxSort = registros.reduce((max, r) => Math.max(max, r.sort_order), 0);
    const insertData: Record<string, any> = { [column]: newNome.trim(), sort_order: maxSort + 1, updated_at: new Date().toISOString() };
    extraCols.forEach((col) => {
      if (col.type === "checkbox") {
        insertData[col.key] = newExtra[col.key] === true;
      } else if (col.type === "number") {
        const val = newExtra[col.key];
        insertData[col.key] = val === "" || val === undefined ? null : parseFloat(val);
      } else {
        const val = newExtra[col.key];
        insertData[col.key] = val === "" || val === undefined ? null : val;
      }
    });
    try {
      const selectReturnCols = extraCols.length > 0
        ? `id, ${column}, sort_order, ${extraCols.map((c) => c.key).join(", ")}`
        : `id, ${column}, sort_order`;
      const { data, error: err } = await supabase
        .from(def.table)
        .insert(insertData)
        .select(selectReturnCols)
        .single();
      if (err) throw err;
      const novo: Registro = {
        id: data.id,
        nome: data[column] || "",
        sort_order: data.sort_order ?? 0,
      };
      extraCols.forEach((col) => {
        novo[col.key] = data[col.key];
      });
      setRegistros((prev) => [...prev, novo]);
      setAdding(false);
      setNewNome("");
      setNewExtra({});
    } catch (e: any) {
      alert(e?.message || "Erro ao adicionar.");
    } finally {
      setSaving(false);
    }
  };

  const moveUp = async (idx: number) => {
    if (idx <= 0) return;
    const a = registros[idx - 1];
    const b = registros[idx];
    const updated = [...registros];
    updated[idx - 1] = { ...a, sort_order: b.sort_order };
    updated[idx] = { ...b, sort_order: a.sort_order };
    setRegistros(updated);
    try {
      await supabase.from(def.table).update({ sort_order: b.sort_order, updated_at: new Date().toISOString() }).eq("id", a.id);
      await supabase.from(def.table).update({ sort_order: a.sort_order, updated_at: new Date().toISOString() }).eq("id", b.id);
    } catch {
      carregar();
    }
  };

  const moveDown = async (idx: number) => {
    if (idx >= registros.length - 1) return;
    const a = registros[idx];
    const b = registros[idx + 1];
    const updated = [...registros];
    updated[idx] = { ...a, sort_order: b.sort_order };
    updated[idx + 1] = { ...b, sort_order: a.sort_order };
    setRegistros(updated);
    try {
      await supabase.from(def.table).update({ sort_order: b.sort_order, updated_at: new Date().toISOString() }).eq("id", a.id);
      await supabase.from(def.table).update({ sort_order: a.sort_order, updated_at: new Date().toISOString() }).eq("id", b.id);
    } catch {
      carregar();
    }
  };

  const getDisplayValue = (r: Registro, col: ExtraColumn) => {
    const val = r[col.key];
    if (col.type === "checkbox") return val ? "Sim" : "Não";
    if (col.type === "number") {
      if (val === null || val === undefined) return "—";
      return `€ ${parseFloat(val).toFixed(2)}`;
    }
    if (col.type === "select") {
      const opts = selectOptions[col.key] || [];
      const found = opts.find((o) => o.id === val);
      return found ? found.nome : "—";
    }
    return val || "—";
  };

  const renderExtraInput = (
    col: ExtraColumn,
    value: any,
    onChange: (key: string, val: any) => void,
  ) => {
    if (col.type === "checkbox") {
      return (
        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(col.key, e.target.checked)}
            className="w-4 h-4 rounded border-background-300/60 text-primary-500 focus:ring-primary-400 cursor-pointer"
          />
            </label>
      );
    }
    if (col.type === "number") {
      return (
        <input
          type="number"
          step="0.01"
          min="0"
          value={value ?? ""}
          onChange={(e) => onChange(col.key, e.target.value)}
          placeholder="0.00"
          className="w-full px-2 py-1.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
        />
      );
    }
    if (col.type === "select") {
      const opts = selectOptions[col.key] || [];
      return (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(col.key, e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-2 py-1.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:border-primary-400 transition-colors cursor-pointer"
        >
          <option value="">—</option>
          {opts.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.nome}</option>
          ))}
        </select>
      );
    }
    return null;
  };

  const extraWidthClass = extraCols.length === 3 ? "w-28" : extraCols.length === 2 ? "w-32" : "w-36";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground-950">{def.label}</h2>
          <p className="text-sm text-foreground-600 mt-0.5">
            {registros.length} registo{registros.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={startAdd}
          disabled={adding}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
        >
          <i className="ri-add-line w-4 h-4 flex items-center justify-center" />
          Novo
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
      ) : (
        <div className="rounded-xl bg-background-100 border border-background-200/70 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-background-200/60">
                <th className="text-left px-4 py-3 font-medium text-foreground-600 w-12">#</th>
                <th className="text-left px-4 py-3 font-medium text-foreground-600">Nome</th>
                {extraCols.map((col) => (
                  <th key={col.key} className={`text-left px-3 py-3 font-medium text-foreground-600 ${extraWidthClass}`}>
                    {col.label}
                  </th>
                ))}
                <th className="text-center px-4 py-3 font-medium text-foreground-600 w-24">Ordem</th>
                <th className="text-right px-4 py-3 font-medium text-foreground-600 w-32">Ações</th>
              </tr>
            </thead>
            <tbody>
              {adding && (
                <tr className="border-b border-background-200/40 bg-primary-50/40">
                  <td className="px-4 py-3 text-foreground-400">—</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={newNome}
                      onChange={(e) => setNewNome(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveAdd();
                        if (e.key === "Escape") cancelAdd();
                      }}
                      placeholder="Nome do novo registo"
                      autoFocus
                      className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </td>
                  {extraCols.map((col) => (
                    <td key={col.key} className="px-3 py-3">
                      {renderExtraInput(col, newExtra[col.key], (key, val) =>
                        setNewExtra((prev) => ({ ...prev, [key]: val }))
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center text-foreground-400">—</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={saveAdd}
                        disabled={saving || !newNome.trim()}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-500 hover:bg-primary-600 text-background-50 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                        title="Guardar"
                      >
                        <i className="ri-check-line w-4 h-4 flex items-center justify-center" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelAdd}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-background-200/60 hover:bg-background-300/60 text-foreground-600 transition-colors cursor-pointer whitespace-nowrap"
                        title="Cancelar"
                      >
                        <i className="ri-close-line w-4 h-4 flex items-center justify-center" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {registros.length === 0 && !adding && (
                <tr>
                  <td colSpan={4 + extraCols.length} className="px-4 py-12 text-center text-foreground-400">
                    Nenhum registo encontrado.
                  </td>
                </tr>
              )}

              {registros.map((r, idx) => {
                const isEditing = editingId === r.id;
                return (
                  <tr
                    key={r.id}
                    className="border-b border-background-200/40 hover:bg-background-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-foreground-500 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editNome}
                          onChange={(e) => setEditNome(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(r.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          autoFocus
                          className="w-full px-3 py-2 rounded-lg border border-primary-400 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:border-primary-500 transition-colors"
                        />
                      ) : (
                        <span className="text-foreground-800 font-medium">{r.nome}</span>
                      )}
                    </td>
                    {extraCols.map((col) => (
                      <td key={col.key} className="px-3 py-3">
                        {isEditing
                          ? renderExtraInput(col, editExtra[col.key], (key, val) =>
                              setEditExtra((prev) => ({ ...prev, [key]: val }))
                            )
                          : col.type === "checkbox"
                            ? (
                              <input
                                type="checkbox"
                                checked={!!r[col.key]}
                                disabled
                                className="w-4 h-4 rounded border-background-300/60 text-primary-500 cursor-not-allowed"
                              />
                            )
                            : (
                              <span className="text-foreground-700 text-sm">
                                {getDisplayValue(r, col)}
                              </span>
                            )
                        }
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveUp(idx)}
                          disabled={idx === 0}
                          className="w-6 h-6 flex items-center justify-center rounded text-foreground-400 hover:text-foreground-600 hover:bg-background-200/60 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-30"
                          title="Subir"
                        >
                          <i className="ri-arrow-up-s-line w-4 h-4 flex items-center justify-center" />
                        </button>
                        <span className="w-8 text-center text-xs text-foreground-500 font-mono">
                          {r.sort_order}
                        </span>
                        <button
                          type="button"
                          onClick={() => moveDown(idx)}
                          disabled={idx === registros.length - 1}
                          className="w-6 h-6 flex items-center justify-center rounded text-foreground-400 hover:text-foreground-600 hover:bg-background-200/60 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-30"
                          title="Descer"
                        >
                          <i className="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEdit(r.id)}
                              disabled={saving || !editNome.trim()}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-500 hover:bg-primary-600 text-background-50 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                              title="Guardar"
                            >
                              <i className="ri-check-line w-4 h-4 flex items-center justify-center" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-background-200/60 hover:bg-background-300/60 text-foreground-600 transition-colors cursor-pointer whitespace-nowrap"
                              title="Cancelar"
                            >
                              <i className="ri-close-line w-4 h-4 flex items-center justify-center" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(r)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-200/60 text-foreground-500 hover:text-foreground-700 transition-colors cursor-pointer whitespace-nowrap"
                              title="Editar"
                            >
                              <i className="ri-edit-line w-4 h-4 flex items-center justify-center" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(r.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-foreground-400 hover:text-red-500 transition-colors cursor-pointer whitespace-nowrap"
                              title="Eliminar"
                            >
                              <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Página principal                                                   */
/* ------------------------------------------------------------------ */
export default function AdminCadastrosPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "familia";
  const activeDef = cadastrosDefs.find((d) => d.key === activeTab) || cadastrosDefs[0];

  const selectTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  return (
    <div className="min-h-[100dvh] flex bg-background-50">
      <AdminSidebar activeHref="/admin/cadastros" title="Cadastros" />

      {/* Main content */}
      <main className="flex-1 lg:pt-0 pt-14">
        <div className="px-4 md:px-8 py-6 md:py-8">
          <div className="mb-8">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">
              Cadastros
            </h1>
            <p className="mt-1 text-sm text-foreground-600">
              Gerir as listas de valores usadas em todo o sistema
            </p>
          </div>

          {/* Tabs horizontais */}
          <div className="flex flex-wrap gap-1 mb-8 p-1 bg-background-100 rounded-full">
            {cadastrosDefs.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => selectTab(c.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === c.key
                    ? "bg-background-50 text-foreground-950 shadow-sm"
                    : "text-foreground-600 hover:text-foreground-800"
                }`}
              >
                <i className={`${c.icon} w-4 h-4 flex items-center justify-center`} />
                {c.label}
              </button>
            ))}
          </div>

          {/* Conteúdo do tab ativo */}
          {activeTab === "template-proposta" ? (
            <TemplateProposta />
          ) : (
            <CadastroTable key={activeTab} def={activeDef} />
          )}
        </div>
      </main>
    </div>
  );
}