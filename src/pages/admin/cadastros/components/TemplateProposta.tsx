import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import mammoth from "mammoth";

/* ------------------------------------------------------------------ */
/*  Mapeamentos de tabelas de cadastro                                 */
/* ------------------------------------------------------------------ */
const CADASTRO_TABLES: Record<string, string> = {
  orcamentos: "Orçamentos",
};

interface Template {
  id: number;
  nome_template: string;
  nome_tabela_cadastro: string;
  arquivo_docx: string | null;
  valido: boolean;
  created_at: string;
  updated_at: string;
}

interface TagRecord {
  id: number;
  template_id: number;
  tag_template: string;
  campo_banco: string | null;
  mascara: string | null;
}

/* ------------------------------------------------------------------ */
/*  Validação de tag (sem espaços, sem acentos)                        */
/* ------------------------------------------------------------------ */
function isValidTag(tag: string): boolean {
  return /^[a-zA-Z0-9_]+$/.test(tag);
}

function isDateColumn(colName: string | null): boolean {
  if (!colName) return false;
  return colName.includes("data") || colName.endsWith("_at");
}

/* ------------------------------------------------------------------ */
/*  Componente principal                                               */
/* ------------------------------------------------------------------ */
export default function TemplateProposta() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---- formulário novo template ---- */
  const [showForm, setShowForm] = useState(false);
  const [formNome, setFormNome] = useState("");
  const [formTabela, setFormTabela] = useState("");
  const [formFile, setFormFile] = useState<File | null>(null);
  const [formTags, setFormTags] = useState<string[]>([]);
  const [parsingFile, setParsingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- painel de tags ---- */
  const [tagsTemplateId, setTagsTemplateId] = useState<number | null>(null);
  const [tagsTemplateNome, setTagsTemplateNome] = useState("");
  const [tags, setTags] = useState<TagRecord[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagsSaveStatus, setTagsSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [tagsSaveError, setTagsSaveError] = useState("");

  /* ---- substituir ficheiro docx do template ---- */
  const [replaceTemplateId, setReplaceTemplateId] = useState<number | null>(null);
  const [replaceTemplateNome, setReplaceTemplateNome] = useState("");
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replaceNewTags, setReplaceNewTags] = useState<string[]>([]);
  const [replaceExistingTags, setReplaceExistingTags] = useState<TagRecord[]>([]);
  const [replaceParsing, setReplaceParsing] = useState(false);
  const [replaceSaving, setReplaceSaving] = useState(false);
  const [replaceError, setReplaceError] = useState("");
  const [replaceShowConfirm, setReplaceShowConfirm] = useState(false);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // compute tag comparison for the confirmation modal
  const matchedTags = replaceNewTags.filter((tag) =>
    replaceExistingTags.some((et) => et.tag_template === tag)
  );
  const newOnlyTags = replaceNewTags.filter(
    (tag) => !replaceExistingTags.some((et) => et.tag_template === tag)
  );
  const droppedTags = replaceExistingTags.filter(
    (et) => !replaceNewTags.includes(et.tag_template)
  );

  /* ---- carregar templates ---- */
  const carregarTemplates = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await supabase
        .from("admin_template_proposta")
        .select("*")
        .order("id");
      if (err) throw err;
      setTemplates((data || []) as Template[]);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar templates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarTemplates();
  }, [carregarTemplates]);

  /* ---- parsing do ficheiro .docx ---- */
  const handleFileChange = async (file: File | null) => {
    setFormFile(file);
    setFormTags([]);
    setFormError("");

    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      setFormError("Apenas ficheiros .docx são permitidos.");
      setFormFile(null);
      return;
    }

    setParsingFile(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      const matches = [...text.matchAll(/\[([^\]]+)\]/g)];
      const extracted = matches.map((m) => m[1].trim()).filter((t) => t.length > 0);
      const unique = [...new Set(extracted)];
      setFormTags(unique);

      if (unique.length === 0) {
        setFormError("Nenhuma tag [exemplo] encontrada no documento.");
      }
    } catch {
      setFormError("Erro ao ler o ficheiro .docx. Verifique se é um documento válido.");
      setFormFile(null);
    } finally {
      setParsingFile(false);
    }
  };

  /* ---- guardar novo template + tags ---- */
  const handleSaveTemplate = async () => {
    if (!formNome.trim()) {
      setFormError("O nome do template é obrigatório.");
      return;
    }
    if (!formTabela) {
      setFormError("Selecione a tabela de cadastro.");
      return;
    }
    if (!formFile) {
      setFormError("Faça upload de um ficheiro .docx.");
      return;
    }
    if (formTags.length === 0) {
      setFormError("O documento não contém tags válidas.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      let docxPath: string | null = null;

      try {
        const fileExt = formFile.name.split(".").pop() || "docx";
        const fileName = `templates-proposta/${Date.now()}_${formFile.name.replace(/\s+/g, "_").toLowerCase()}`;
        const { error: uploadErr } = await supabase.storage
          .from("public")
          .upload(fileName, formFile, {
            cacheControl: "3600",
            upsert: false,
          });
        if (!uploadErr) {
          docxPath = fileName;
        }
      } catch {
        // storage pode falhar, mas o parsing já foi feito — seguir em frente
      }

      // desmarcar todos os templates existentes da mesma tabela de cadastro
      await supabase
        .from("admin_template_proposta")
        .update({ valido: false, updated_at: new Date().toISOString() })
        .eq("nome_tabela_cadastro", formTabela);

      // inserir o novo template marcado como válido
      const { data: templateData, error: insertErr } = await supabase
        .from("admin_template_proposta")
        .insert({
          nome_template: formNome.trim(),
          nome_tabela_cadastro: formTabela,
          arquivo_docx: docxPath,
          valido: true,
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insertErr) throw insertErr;

      const templateId = templateData.id;

      const tagInserts = formTags.map((tag) => ({
        template_id: templateId,
        tag_template: tag,
        campo_banco: null,
        mascara: null,
      }));

      const { error: tagsErr } = await supabase
        .from("admin_tags_template")
        .insert(tagInserts);

      if (tagsErr) throw tagsErr;

      // limpar formulário
      setShowForm(false);
      setFormNome("");
      setFormTabela("");
      setFormFile(null);
      setFormTags([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await carregarTemplates();
    } catch (e: any) {
      setFormError(e?.message || "Erro ao guardar template.");
    } finally {
      setSaving(false);
    }
  };

  /* ---- abrir painel de tags ---- */
  const openTagsPanel = async (t: Template) => {
    setTagsTemplateId(t.id);
    setTagsTemplateNome(t.nome_template);
    setTagsLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("admin_tags_template")
        .select("*")
        .eq("template_id", t.id)
        .order("id");
      if (err) throw err;
      setTags((data || []) as TagRecord[]);
    } catch {
      setTags([]);
    } finally {
      setTagsLoading(false);
    }
  };

  const closeTagsPanel = () => {
    setTagsTemplateId(null);
    setTagsTemplateNome("");
    setTags([]);
  };

  /* ---- atualizar campo_banco de uma tag ---- */
  const updateCampoBanco = (tagId: number, campoBanco: string | null) => {
    setTags((prev) =>
      prev.map((t) => {
        if (t.id !== tagId) return t;
        // se o novo campo NAO for date, limpa a mascara
        if (!isDateColumn(campoBanco)) {
          return { ...t, campo_banco: campoBanco, mascara: null };
        }
        return { ...t, campo_banco: campoBanco };
      })
    );
  };

  /* ---- atualizar mascara de uma tag ---- */
  const updateMascara = (tagId: number, mascara: string | null) => {
    setTags((prev) =>
      prev.map((t) => (t.id === tagId ? { ...t, mascara: mascara || null } : t))
    );
  };

  /* ---- alternar valido do template (pela grid) ---- */
  const toggleTemplateValido = async (templateId: number) => {
    const currentTemplate = templates.find((t) => t.id === templateId);
    if (!currentTemplate) return;
    const tabela = currentTemplate.nome_tabela_cadastro;

    // optimistic update
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.nome_tabela_cadastro === tabela) {
          return { ...t, valido: t.id === templateId };
        }
        return t;
      })
    );

    try {
      if (currentTemplate.valido) {
        // desmarcar apenas este
        const { error: upErr } = await supabase
          .from("admin_template_proposta")
          .update({ valido: false, updated_at: new Date().toISOString() })
          .eq("id", templateId);
        if (upErr) throw upErr;
      } else {
        // desmarcar todos da mesma tabela e marcar este
        await supabase
          .from("admin_template_proposta")
          .update({ valido: false, updated_at: new Date().toISOString() })
          .eq("nome_tabela_cadastro", tabela);
        const { error: upOneErr } = await supabase
          .from("admin_template_proposta")
          .update({ valido: true, updated_at: new Date().toISOString() })
          .eq("id", templateId);
        if (upOneErr) throw upOneErr;
      }
    } catch {
      // reverter em caso de erro
      await carregarTemplates();
    }
  };

  /* ---- guardar alterações das tags ---- */
  const saveTags = async () => {
    // validar: campos date sem mascara
    const missingMask = tags.find((t) => isDateColumn(t.campo_banco) && !t.mascara?.trim());
    if (missingMask) {
      setTagsSaveStatus("error");
      setTagsSaveError(`A tag "[${missingMask.tag_template}]" está mapeada para um campo de data mas não tem máscara definida.`);
      return;
    }

    setTagsSaveStatus("saving");
    setTagsSaveError("");
    try {
      for (const t of tags) {
        const { error: upErr } = await supabase
          .from("admin_tags_template")
          .update({ campo_banco: t.campo_banco, mascara: t.mascara, updated_at: new Date().toISOString() })
          .eq("id", t.id);
        if (upErr) throw upErr;
      }
      setTagsSaveStatus("success");
      setTimeout(() => setTagsSaveStatus("idle"), 3000);
    } catch (e: any) {
      setTagsSaveStatus("error");
      setTagsSaveError(e?.message || "Erro ao guardar mapeamentos.");
    }
  };

  /* ---- eliminar template ---- */
  const deleteTemplate = async (id: number) => {
    if (!window.confirm("Tem a certeza que deseja eliminar este template? Todas as tags associadas também serão removidas.")) return;
    try {
      const { error: err } = await supabase
        .from("admin_template_proposta")
        .delete()
        .eq("id", id);
      if (err) throw err;
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (tagsTemplateId === id) closeTagsPanel();
    } catch (e: any) {
      alert(e?.message || "Erro ao eliminar.");
    }
  };

  /* ---- tabela de cadastro selecionada no painel de tags ---- */
  const activeTabela = templates.find((t) => t.id === tagsTemplateId)?.nome_tabela_cadastro || "";
  const [activeColumns, setActiveColumns] = useState<string[]>([]);
  const [columnsLoading, setColumnsLoading] = useState(false);

  useEffect(() => {
    if (!activeTabela) {
      setActiveColumns([]);
      return;
    }
    let cancelled = false;
    const fetchColumns = async () => {
      setColumnsLoading(true);
      try {
        // fonte primária: schema real da base de dados (sempre reflete todas as colunas)
        const { data: schemaData, error: schemaErr } = await supabase
          .from("information_schema.columns")
          .select("column_name")
          .eq("table_name", activeTabela)
          .eq("table_schema", "public")
          .order("ordinal_position");

        if (!schemaErr && schemaData && schemaData.length > 0) {
          if (!cancelled) {
            const cols = (schemaData as { column_name: string }[]).map((r) => r.column_name);
            // garantir que colunas geradas (ex: nro_proposta) aparecem mesmo se info_schema as omite
            setActiveColumns(cols);
          }
        } else {
          // fallback: ler a primeira linha da tabela e extrair as chaves
          const { data, error: rowErr } = await supabase
            .from(activeTabela)
            .select("*")
            .limit(1);
          if (!rowErr && data && data.length > 0) {
            if (!cancelled) {
              setActiveColumns(Object.keys(data[0]).sort());
            }
          } else {
            if (!cancelled) setActiveColumns([]);
          }
        }
      } catch {
        if (!cancelled) setActiveColumns([]);
      } finally {
        if (!cancelled) setColumnsLoading(false);
      }
    };
    fetchColumns();
    return () => { cancelled = true; };
  }, [activeTabela]);

  /* ---- extrair nome do ficheiro docx do path ---- */
  function extractDocxName(path: string | null): string {
    if (!path) return "—";
    const parts = path.split("/");
    const last = parts[parts.length - 1];
    const underscoreIndex = last.indexOf("_");
    if (underscoreIndex > 0 && underscoreIndex < last.length - 1) {
      return last.slice(underscoreIndex + 1);
    }
    return last;
  }

  /* ---- handlers para substituição de docx ---- */
  const handleClickDocxName = (t: Template) => {
    setReplaceTemplateId(t.id);
    setReplaceTemplateNome(t.nome_template);
    setReplaceFile(null);
    setReplaceNewTags([]);
    setReplaceExistingTags([]);
    setReplaceError("");
    setReplaceShowConfirm(false);
    replaceFileInputRef.current?.click();
  };

  const handleReplaceFileChange = async (file: File | null) => {
    setReplaceFile(file);
    setReplaceNewTags([]);
    setReplaceError("");
    setReplaceShowConfirm(false);

    if (!file) {
      setReplaceTemplateId(null);
      return;
    }

    if (!file.name.endsWith(".docx")) {
      setReplaceError("Apenas ficheiros .docx são permitidos.");
      setReplaceFile(null);
      setReplaceTemplateId(null);
      return;
    }

    setReplaceParsing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      const matches = [...text.matchAll(/\[([^\]]+)\]/g)];
      const extracted = matches.map((m) => m[1].trim()).filter((t) => t.length > 0);
      const unique = [...new Set(extracted)];
      setReplaceNewTags(unique);

      const { data } = await supabase
        .from("admin_tags_template")
        .select("*")
        .eq("template_id", replaceTemplateId)
        .order("id");
      setReplaceExistingTags((data || []) as TagRecord[]);

      if (unique.length === 0) {
        setReplaceError("Nenhuma tag [exemplo] encontrada no novo documento.");
        return;
      }

      setReplaceShowConfirm(true);
    } catch {
      setReplaceError("Erro ao ler o ficheiro .docx. Verifique se é um documento válido.");
      setReplaceFile(null);
      setReplaceTemplateId(null);
    } finally {
      setReplaceParsing(false);
    }
  };

  const handleConfirmReplaceDocx = async () => {
    if (!replaceFile || replaceTemplateId === null) return;

    setReplaceSaving(true);
    setReplaceError("");

    try {
      const fileExt = replaceFile.name.split(".").pop() || "docx";
      const fileName = `templates-proposta/${Date.now()}_${replaceFile.name.replace(/\s+/g, "_").toLowerCase()}`;
      const { error: uploadErr } = await supabase.storage
        .from("public")
        .upload(fileName, replaceFile, {
          cacheControl: "3600",
          upsert: false,
        });
      if (uploadErr) throw uploadErr;

      const { error: updateErr } = await supabase
        .from("admin_template_proposta")
        .update({ arquivo_docx: fileName, updated_at: new Date().toISOString() })
        .eq("id", replaceTemplateId);
      if (updateErr) throw updateErr;

      const existingMap: Record<string, { campo_banco: string | null; mascara: string | null }> = {};
      for (const t of replaceExistingTags) {
        existingMap[t.tag_template] = { campo_banco: t.campo_banco, mascara: t.mascara };
      }

      await supabase
        .from("admin_tags_template")
        .delete()
        .eq("template_id", replaceTemplateId);

      const newTagInserts = replaceNewTags.map((tag) => {
        const existing = existingMap[tag];
        return {
          template_id: replaceTemplateId,
          tag_template: tag,
          campo_banco: existing?.campo_banco || null,
          mascara: existing?.mascara || null,
        };
      });

      const { error: tagsErr } = await supabase
        .from("admin_tags_template")
        .insert(newTagInserts);
      if (tagsErr) throw tagsErr;

      setReplaceTemplateId(null);
      setReplaceFile(null);
      setReplaceNewTags([]);
      setReplaceExistingTags([]);
      setReplaceShowConfirm(false);
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = "";

      await carregarTemplates();
    } catch (e: any) {
      setReplaceError(e?.message || "Erro ao substituir ficheiro.");
    } finally {
      setReplaceSaving(false);
    }
  };

  const closeReplaceModal = () => {
    setReplaceTemplateId(null);
    setReplaceFile(null);
    setReplaceNewTags([]);
    setReplaceExistingTags([]);
    setReplaceShowConfirm(false);
    setReplaceError("");
    if (replaceFileInputRef.current) replaceFileInputRef.current.value = "";
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground-950">TemplateProposta</h2>
          <p className="text-sm text-foreground-600 mt-0.5">
            {templates.length} template{templates.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!tagsTemplateId && (
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setFormError("");
              setFormNome("");
              setFormTabela("");
              setFormFile(null);
              setFormTags([]);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line w-4 h-4 flex items-center justify-center" />
            Novo Template
          </button>
        )}
        {tagsTemplateId && (
          <button
            type="button"
            onClick={closeTagsPanel}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-100 hover:bg-background-200 text-foreground-700 text-sm font-medium border border-background-200/70 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center" />
            Voltar aos Templates
          </button>
        )}
      </div>

      {/* Painel de Tags */}
      {tagsTemplateId !== null && (
        <div>
          <div className="mb-5 p-4 rounded-xl bg-background-100 border border-background-200/70">
            <p className="text-sm text-foreground-700">
              <strong>Template:</strong> {tagsTemplateNome}
              {" · "}
              <strong>Tabela:</strong> {CADASTRO_TABLES[activeTabela] || activeTabela}
            </p>
          </div>

          {tagsLoading ? (
            <div className="flex items-center justify-center py-16">
              <i className="ri-loader-4-line animate-spin text-2xl w-6 h-6 flex items-center justify-center text-foreground-400" />
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-12 text-foreground-400 text-sm">
              Nenhuma tag encontrada para este template.
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-background-100 border border-background-200/70 overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-background-200/60">
                      <th className="text-left px-4 py-3 font-medium text-foreground-600 w-12">#</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600">Tag do Template</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600">Campo no Banco</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-600">Máscara</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.map((tag) => {
                      const isDate = isDateColumn(tag.campo_banco);
                      const mascaraRequired = isDate && !tag.mascara?.trim();
                      return (
                      <tr
                        key={tag.id}
                        className="border-b border-background-200/40 hover:bg-background-50/60 transition-colors"
                      >
                        <td className="px-4 py-3 text-foreground-500 font-mono text-xs">{tag.id}</td>
                        <td className="px-4 py-3">
                          <code className="px-2 py-1 rounded-md bg-background-200/60 text-foreground-800 text-xs font-mono">
                            [{tag.tag_template}]
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={tag.campo_banco || ""}
                            onChange={(e) =>
                              updateCampoBanco(tag.id, e.target.value || null)
                            }
                            disabled={columnsLoading}
                            className="w-full max-w-xs px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:border-primary-400 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <option value="">
                              {columnsLoading ? "A carregar colunas..." : "— Selecionar campo —"}
                            </option>
                            {activeColumns.map((col) => (
                              <option key={col} value={col}>
                                {col}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          {isDate ? (
                            <div className="flex items-start gap-2">
                              <input
                                type="text"
                                value={tag.mascara || ""}
                                onChange={(e) => updateMascara(tag.id, e.target.value)}
                                maxLength={100}
                                placeholder="DD/MM/YYYY"
                                className={`w-[280px] px-3 py-2 rounded-lg border text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none transition-colors ${
                                  mascaraRequired
                                    ? "border-amber-300 bg-amber-50 focus:border-amber-400"
                                    : "border-background-200/70 bg-background-50 focus:border-primary-400"
                                }`}
                              />
                              <div className="flex flex-wrap gap-1 pt-0.5">
                                {[
                                  "DD/MM/YYYY",
                                  "DD-mmm-AAAA",
                                  "DD/MM/YYYY HH:MM",
                                  "ddd, DD de mmmm de YYYY as HH:MM hs",
                                ].map((ex) => (
                                  <button
                                    key={ex}
                                    type="button"
                                    onClick={() => updateMascara(tag.id, ex)}
                                    className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-background-200/60 text-foreground-600 hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer whitespace-nowrap"
                                    title={`Usar "${ex}"`}
                                  >
                                    {ex}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-foreground-400 italic">
                              Apenas para datas
                            </span>
                          )}
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end items-center gap-3">
                {tagsSaveStatus === "success" && (
                  <span className="inline-flex items-center gap-1 text-sm text-green-600">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center" />
                    Guardado com sucesso!
                  </span>
                )}
                {tagsSaveStatus === "error" && tagsSaveError && (
                  <span className="inline-flex items-center gap-1 text-sm text-red-600">
                    <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center" />
                    {tagsSaveError}
                  </span>
                )}
                <button
                  type="button"
                  onClick={saveTags}
                  disabled={tagsSaveStatus === "saving"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  {tagsSaveStatus === "saving" ? (
                    <>
                      <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                      A guardar...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line w-4 h-4 flex items-center justify-center" />
                      Guardar Mapeamentos
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Formulário novo template */}
      {showForm && tagsTemplateId === null && (
        <div className="mb-8 p-6 rounded-xl bg-background-100 border border-background-200/70">
          <h3 className="font-heading text-lg font-bold text-foreground-950 mb-5">Novo Template</h3>

          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
              <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-foreground-700 mb-1.5">
                Nome do Template
              </label>
              <input
                type="text"
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                placeholder="Ex: Proposta Padrão 2026"
                className="w-full px-3 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground-700 mb-1.5">
                Tabela de Cadastro
              </label>
              <select
                value={formTabela}
                onChange={(e) => setFormTabela(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:border-primary-400 transition-colors cursor-pointer"
              >
                <option value="">— Selecionar tabela —</option>
                {Object.entries(CADASTRO_TABLES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Upload ficheiro */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground-700 mb-1.5">
              Ficheiro .docx do Template
            </label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-background-300/80 bg-background-50 hover:border-primary-400 text-sm text-foreground-600 hover:text-primary-600 transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-upload-2-line w-4 h-4 flex items-center justify-center" />
                {formFile ? formFile.name : "Selecionar ficheiro"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              {formFile && (
                <button
                  type="button"
                  onClick={() => {
                    setFormFile(null);
                    setFormTags([]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-xs text-red-500 hover:text-red-600 cursor-pointer whitespace-nowrap"
                >
                  Remover
                </button>
              )}
            </div>
            {parsingFile && (
              <p className="mt-2 text-xs text-foreground-500 flex items-center gap-1">
                <i className="ri-loader-4-line animate-spin w-3 h-3 flex items-center justify-center" />
                A ler documento...
              </p>
            )}
          </div>

          {/* Pré-visualização das tags extraídas */}
          {formTags.length > 0 && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-foreground-700 mb-2">
                Tags encontradas ({formTags.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {formTags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono ${
                      isValidTag(tag)
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    [{tag}]
                    {!isValidTag(tag) && (
                      <i
                        className="ri-error-warning-line w-3 h-3 flex items-center justify-center"
                        title="Tag com espaços ou acentos — reveja o documento"
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveTemplate}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {saving ? (
                <>
                  <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                  A guardar...
                </>
              ) : (
                <>
                  <i className="ri-check-line w-4 h-4 flex items-center justify-center" />
                  Guardar Template
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormError("");
                setFormTags([]);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background-200/60 hover:bg-background-300/60 text-foreground-600 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de templates (só mostra quando não está no painel de tags nem no formulário) */}
      {tagsTemplateId === null && !showForm && (
        <>
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
              <i className="ri-error-warning-line w-5 h-5 flex items-center justify-center text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={carregarTemplates}
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
          ) : templates.length === 0 ? (
            <div className="text-center py-16 rounded-xl bg-background-100 border border-background-200/70">
              <i className="ri-file-word-2-line text-3xl w-8 h-8 flex items-center justify-center text-foreground-300 mx-auto mb-3" />
              <p className="text-foreground-500 text-sm">Nenhum template criado.</p>
              <p className="text-foreground-400 text-xs mt-1">
                Clique em &quot;Novo Template&quot; para começar.
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-background-100 border border-background-200/70 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-background-200/60">
                    <th className="text-left px-4 py-3 font-medium text-foreground-600 w-12">#</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground-600">Nome do Template</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground-600">Tabela de Cadastro</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground-600">Nome Docx</th>
                    <th className="text-center px-4 py-3 font-medium text-foreground-600 w-28">Válido</th>
                    <th className="text-center px-4 py-3 font-medium text-foreground-600 w-16">Tags</th>
                    <th className="text-right px-4 py-3 font-medium text-foreground-600 w-36">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-background-200/40 hover:bg-background-50/60 transition-colors"
                    >
                      <td className="px-4 py-3 text-foreground-500 font-mono text-xs">{t.id}</td>
                      <td className="px-4 py-3">
                        <span className="text-foreground-800 font-medium">{t.nome_template}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-foreground-700 text-sm">
                          {CADASTRO_TABLES[t.nome_tabela_cadastro] || t.nome_tabela_cadastro}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleClickDocxName(t)}
                          className="text-foreground-700 text-xs font-mono hover:text-primary-500 hover:underline transition-colors cursor-pointer whitespace-nowrap"
                          title="Clique para substituir o ficheiro .docx"
                        >
                          {extractDocxName(t.arquivo_docx)}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={t.valido === true}
                            onChange={() => toggleTemplateValido(t.id)}
                            className="w-4 h-4 rounded border border-background-300/80 text-primary-500 focus:ring-primary-400 cursor-pointer"
                          />
                        </label>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => openTagsPanel(t)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-secondary-100 text-secondary-800 hover:bg-secondary-200 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-price-tag-3-line w-3 h-3 flex items-center justify-center" />
                          Tags
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openTagsPanel(t)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-200/60 text-foreground-500 hover:text-foreground-700 transition-colors cursor-pointer whitespace-nowrap"
                            title="Editar Tags"
                          >
                            <i className="ri-edit-line w-4 h-4 flex items-center justify-center" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTemplate(t.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-foreground-400 hover:text-red-500 transition-colors cursor-pointer whitespace-nowrap"
                            title="Eliminar"
                          >
                            <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Hidden file input para substituição de docx */}
      <input
        ref={replaceFileInputRef}
        type="file"
        accept=".docx"
        onChange={(e) => handleReplaceFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      {/* Overlay de parsing / carregamento */}
      {replaceParsing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-background-50 rounded-xl p-8 shadow-lg flex flex-col items-center gap-3 max-w-sm mx-4">
            <i className="ri-loader-4-line animate-spin text-3xl w-8 h-8 flex items-center justify-center text-primary-500" />
            <p className="text-sm text-foreground-700 font-medium">A ler novo documento .docx...</p>
            <p className="text-xs text-foreground-500">A extrair tags e a comparar com o mapeamento existente.</p>
          </div>
        </div>
      )}

      {/* Modal de confirmação da substituição */}
      {replaceShowConfirm && replaceTemplateId !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/40 overflow-y-auto">
          <div className="bg-background-50 rounded-xl shadow-lg w-full max-w-2xl mx-4 overflow-hidden">
            {/* Cabeçalho */}
            <div className="px-6 py-4 border-b border-background-200/60 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground-950">Substituir ficheiro .docx</h3>
                <p className="text-sm text-foreground-600 mt-0.5">
                  Template: <strong>{replaceTemplateNome}</strong>
                  {" · "}
                  Novo ficheiro: <strong className="text-primary-600">{replaceFile?.name}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={closeReplaceModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-200/60 text-foreground-400 hover:text-foreground-600 transition-colors cursor-pointer"
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="px-6 py-5 space-y-5">
              {/* Erro */}
              {replaceError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                  <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{replaceError}</p>
                </div>
              )}

              {/* Resumo */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-background-100 border border-background-200/60 p-3 text-center">
                  <p className="text-2xl font-bold text-foreground-950">{replaceNewTags.length}</p>
                  <p className="text-xs text-foreground-600 mt-0.5">Tags no novo docx</p>
                </div>
                <div className="rounded-lg bg-green-50 border border-green-100 p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{matchedTags.length}</p>
                  <p className="text-xs text-green-600 mt-0.5">Mapeamentos mantidos</p>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-center">
                  <p className="text-2xl font-bold text-amber-700">{droppedTags.length}</p>
                  <p className="text-xs text-amber-600 mt-0.5">Tags removidas</p>
                </div>
              </div>

              {/* Tags que mantêm mapeamento */}
              {matchedTags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground-700 mb-2 flex items-center gap-1.5">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center text-green-500" />
                    Tags com mapeamento preservado ({matchedTags.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedTags.map((tag) => {
                      const existing = replaceExistingTags.find((et) => et.tag_template === tag);
                      return (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-green-50 text-green-700 border border-green-200"
                          title={existing?.campo_banco ? `→ ${existing.campo_banco}` : "Sem mapeamento anterior"}
                        >
                          [{tag}]
                          {existing?.campo_banco && (
                            <span className="text-green-500 font-sans text-[10px] ml-0.5">
                              → {existing.campo_banco}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tags novas (sem mapeamento anterior) */}
              {newOnlyTags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground-700 mb-2 flex items-center gap-1.5">
                    <i className="ri-add-line w-4 h-4 flex items-center justify-center text-blue-500" />
                    Tags novas — sem mapeamento ({newOnlyTags.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {newOnlyTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        [{tag}]
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags removidas (já não existem no novo docx) */}
              {droppedTags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground-700 mb-2 flex items-center gap-1.5">
                    <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center text-amber-500" />
                    Tags que serão removidas ({droppedTags.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {droppedTags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-amber-50 text-amber-700 border border-amber-200 line-through"
                      >
                        [{tag.tag_template}]
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Aviso se não houver tags mantidas */}
              {replaceExistingTags.length > 0 && matchedTags.length === 0 && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                  <i className="ri-alert-line w-4 h-4 flex items-center justify-center text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    Nenhuma tag do novo documento coincide com as tags antigas. Todos os mapeamentos anteriores serão perdidos.
                  </p>
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="px-6 py-4 border-t border-background-200/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeReplaceModal}
                disabled={replaceSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background-200/60 hover:bg-background-300/60 text-foreground-600 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReplaceDocx}
                disabled={replaceSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                {replaceSaving ? (
                  <>
                    <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                    A substituir...
                  </>
                ) : (
                  <>
                    <i className="ri-refresh-line w-4 h-4 flex items-center justify-center" />
                    Confirmar Substituição
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}