import { useState, useEffect, useRef, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

interface GalleryProduct {
  id: number;
  name: string;
  description: string;
  image_url: string;
  familia?: string;
  formato?: string;
}

interface Tamanho {
  id: number;
  nome: string;
}

interface Formato {
  id: number;
  nome: string;
}

interface Alergenico {
  id: number;
  nome: string;
}

interface OrcamentoModalProps {
  onClose: () => void;
  initialProduct?: {
    id: number;
    name: string;
    description?: string;
    image_url?: string;
  };
}

type TipoOrcamento = "" | "unidade" | "individual-embalagem" | "individual-servida";

interface FormData {
  tipo: TipoOrcamento;
  produtoId: number | null;
  produtoNome: string;
  produtoDesc: string;
  produtoImagem: string;
  tamanhoId: number | null;
  formato: string;
  formatoEspecifico: string;
  quantidade: number;
  mensagemEspecial: string;
  alergias: number[];
  infoAdicional: string;
  dataLimite: string;
  nome: string;
  email: string;
  codigoPais: string;
  telefone: string;
  whatsapp: boolean;
  funcaoCliente: string;
  nipNifCliente: string;
  estabelecimento: string;
}

const initialFormData: FormData = {
  tipo: "",
  produtoId: null,
  produtoNome: "",
  produtoDesc: "",
  produtoImagem: "",
  tamanhoId: null,
  formato: "",
  formatoEspecifico: "",
  quantidade: 1,
  mensagemEspecial: "",
  alergias: [],
  infoAdicional: "",
  dataLimite: "",
  nome: "",
  email: "",
  codigoPais: "+351",
  telefone: "",
  whatsapp: false,
  funcaoCliente: "",
  nipNifCliente: "",
  estabelecimento: "",
};

export default function OrcamentoModal({ onClose, initialProduct }: OrcamentoModalProps) {
  const [form, setForm] = useState<FormData>(initialFormData);
  const [produtos, setProdutos] = useState<GalleryProduct[]>([]);
  const [tamanhos, setTamanhos] = useState<Tamanho[]>([]);
  const [formatos, setFormatos] = useState<Formato[]>([]);
  const [alergenicos, setAlergenicos] = useState<Alergenico[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [erroMsg, setErroMsg] = useState("");
  const [emailError, setEmailError] = useState("");
  const [minDate, setMinDate] = useState("");
  const [produtoSearch, setProdutoSearch] = useState("");
  const [produtoDropdownOpen, setProdutoDropdownOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    const now = new Date();
    now.setDate(now.getDate() + 2);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          { data: produtosData },
          { data: tamanhosData },
          { data: formatosData },
          { data: alergenicosData },
        ] = await Promise.all([
          supabase
            .from("b2b_gallery_products")
            .select("id, name, description, image_url, familia, formato")
            .eq("estado", "publicado")
            .eq("b2b", true)
            .order("name"),
          supabase.from("admin_tamanhos").select("id, nome").order("sort_order"),
          supabase.from("admin_formatos").select("id, nome").order("sort_order"),
          supabase.from("admin_alergenicos").select("id, nome").order("sort_order"),
        ]);

        setProdutos((produtosData as GalleryProduct[]) || []);
        setTamanhos((tamanhosData as Tamanho[]) || []);
        setFormatos((formatosData as Formato[]) || []);
        setAlergenicos((alergenicosData as Alergenico[]) || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-selecionar produto quando o modal abre vindo de um card
  useEffect(() => {
    if (initialProduct && produtos.length > 0) {
      const match = produtos.find((p) => p.id === initialProduct.id);
      if (match) {
        updateForm("tipo", "unidade");
        setForm((prev) => ({
          ...prev,
          tipo: "unidade",
          produtoId: match.id,
          produtoNome: match.name,
          produtoDesc: match.description || "",
          produtoImagem: match.image_url || "",
        }));
        setProdutoSearch(match.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProduct, produtos]);

  const updateForm = (field: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const produtoRef = useRef<HTMLDivElement>(null);

  const filteredProdutos = produtos.filter((p) =>
    p.name.toLowerCase().includes(produtoSearch.toLowerCase())
  );

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);
    return `${before}<strong class="text-primary-600">${match}</strong>${after}`;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (produtoRef.current && !produtoRef.current.contains(e.target as Node)) {
        setProdutoDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProdutoSelect = (produtoId: number) => {
    const produto = produtos.find((p) => p.id === produtoId);
    if (produto) {
      setForm((prev) => ({
        ...prev,
        produtoId,
        produtoNome: produto.name,
        produtoDesc: produto.description || "",
        produtoImagem: produto.image_url || "",
      }));
      setProdutoSearch(produto.name);
      setProdutoDropdownOpen(false);
    }
  };

  const toggleAlergia = (id: number) => {
    setForm((prev) => ({
      ...prev,
      alergias: prev.alergias.includes(id)
        ? prev.alergias.filter((a) => a !== id)
        : [...prev.alergias, id],
    }));
  };

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("");
      return true;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = re.test(email);
    setEmailError(valid ? "" : "Formato de e-mail inválido");
    return valid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.tipo === "unidade" && !form.produtoId) {
      setErroMsg("Por favor, selecione um produto.");
      return;
    }

    if (form.tipo === "unidade" && !form.formato && !form.formatoEspecifico.trim()) {
      setErroMsg("Por favor, selecione um formato ou indique um formato específico.");
      return;
    }

    if (form.tipo === "unidade" && !form.dataLimite) {
      setErroMsg("Por favor, indique a data limite para receber o orçamento.");
      return;
    }

    if (!validateEmail(form.email)) return;

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    const honeypot = (formData.get("phone_alt") as string || "").trim();
    if (honeypot) {
      setStatus("success");
      setForm(initialFormData);
      return;
    }

    formData.delete("phone_alt");

    const tamanhoSelecionado = tamanhos.find((t) => t.id === form.tamanhoId);
    const alergiasNomes = alergenicos
      .filter((a) => form.alergias.includes(a.id))
      .map((a) => a.nome);

    setSubmitting(true);
    setErroMsg("");

    try {
      const { error: insertError } = await supabase.from("orcamentos").insert({
        tipo_orcamento: "Unidade para 2 ou mais pessoas",
        produto_id: form.produtoId,
        produto_nome: form.produtoNome,
        produto_descricao: form.produtoDesc,
        produto_imagem: form.produtoImagem,
        tamanho_id: form.tamanhoId,
        tamanho_nome: tamanhoSelecionado?.nome || null,
        formato: form.formato || null,
        formato_especifico: form.formatoEspecifico || null,
        quantidade: form.quantidade,
        mensagem_especial: form.mensagemEspecial || null,
        alergias_restricoes: alergiasNomes.length > 0 ? alergiasNomes.join(", ") : null,
        informacoes_adicionais: form.infoAdicional || null,
        data_limite: form.dataLimite || null,
        nome_destinatario: form.nome,
        email: form.email,
        telemovel: `${form.codigoPais} ${form.telefone}`,
        possui_whatsapp: form.whatsapp,
        funcao_cliente: form.funcaoCliente || null,
        nip_nif_cliente: form.nipNifCliente || null,
        estabelecimento: form.estabelecimento || null,
      });

      if (insertError) throw insertError;

      setStatus("success");
      setForm(initialFormData);
      setProdutoSearch("");
    } catch (err: any) {
      setStatus("error");
      setErroMsg(err?.message || "Ocorreu um erro ao enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const produtoSelecionado = produtos.find((p) => p.id === form.produtoId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center py-6 px-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl bg-background-50 rounded-2xl overflow-hidden z-10">
        {/* Cabeçalho */}
        <div className="sticky top-0 z-10 bg-background-50 border-b border-background-200/70 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground-950">
              Pedir Orçamento
            </h2>
            <p className="text-sm text-foreground-600 mt-0.5">
              Preencha o formulário e receberá uma proposta personalizada
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

        {/* Corpo */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {status === "success" ? (
            <div className="p-8 rounded-2xl bg-accent-100 border border-accent-200 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-accent-500 text-background-50 mx-auto mb-4">
                <i className="ri-check-line text-2xl w-7 h-7 flex items-center justify-center" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground-950 mb-2">
                Pedido enviado com sucesso
              </h3>
              <p className="text-sm text-foreground-600 leading-relaxed">
                Recebemos o seu pedido de orçamento. A nossa equipa entrará em contacto em breve com uma proposta personalizada.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                Fechar
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-16">
              <i className="ri-loader-4-line animate-spin text-2xl w-6 h-6 flex items-center justify-center text-primary-500" />
              <span className="ml-3 text-sm text-foreground-500">A carregar...</span>
            </div>
          ) : (
            <form
              id="form-orcamento-b2b"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Tipo de Orçamento */}
              <fieldset>
                <legend className="text-sm font-semibold text-foreground-900 mb-3">
                  Tipo de Orçamento <span className="text-primary-500">*</span>
                </legend>
                <div className="space-y-2.5">
                  {[
                    { value: "unidade", label: "Unidade para 2 ou mais pessoas" },
                    { value: "individual-embalagem", label: "Porções individuais (em embalagem)", disabled: true },
                    { value: "individual-servida", label: "Porções individuais servidas em pratos", disabled: true },
                  ].map((op) => (
                    <label
                      key={op.value}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                        op.disabled
                          ? "opacity-50 cursor-not-allowed border-background-200/60 bg-background-100/50"
                          : form.tipo === op.value
                          ? "border-primary-400 bg-primary-50/50"
                          : "border-background-200/70 bg-background-50 hover:border-background-300/70"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipo_orcamento_radio"
                        value={op.value}
                        checked={form.tipo === op.value}
                        onChange={() => updateForm("tipo", op.value as TipoOrcamento)}
                        disabled={op.disabled}
                        className="w-4 h-4 text-primary-500 focus:ring-primary-300"
                      />
                      <span className="text-sm text-foreground-800">{op.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {form.tipo === "unidade" && (
                <>
                  {/* Produto - Pesquisável */}
                  <div ref={produtoRef} className="relative">
                    <label className="text-sm font-semibold text-foreground-900 mb-3 block">
                      Produto <span className="text-primary-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="produto_search"
                        value={produtoSearch}
                        onChange={(e) => {
                          setProdutoSearch(e.target.value);
                          setProdutoDropdownOpen(true);
                          if (e.target.value === "") {
                            setForm((prev) => ({
                              ...prev,
                              produtoId: null,
                              produtoNome: "",
                              produtoDesc: "",
                              produtoImagem: "",
                            }));
                          }
                        }}
                        onFocus={() => setProdutoDropdownOpen(true)}
                        placeholder="Digite para pesquisar produto..."
                        autoComplete="off"
                        required
                        className="w-full px-4 py-3 pr-10 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {produtoDropdownOpen ? (
                          <i className="ri-arrow-up-s-line text-foreground-400 w-4 h-4 flex items-center justify-center" />
                        ) : (
                          <i className="ri-arrow-down-s-line text-foreground-400 w-4 h-4 flex items-center justify-center" />
                        )}
                      </div>
                    </div>
                    <input type="hidden" name="produto_id" value={form.produtoId || ""} />

                    {produtoDropdownOpen && filteredProdutos.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border border-background-200/70 bg-background-50 shadow-lg">
                        {filteredProdutos.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleProdutoSelect(p.id)}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors cursor-pointer whitespace-normal hover:bg-background-100 ${
                              form.produtoId === p.id
                                ? "bg-primary-50/60 text-primary-700 font-medium"
                                : "text-foreground-800"
                            }`}
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(p.name, produtoSearch),
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {produtoDropdownOpen && produtoSearch && filteredProdutos.length === 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1 rounded-xl border border-background-200/70 bg-background-50 shadow-lg px-4 py-4 text-sm text-foreground-500 text-center">
                        Nenhum produto encontrado
                      </div>
                    )}
                  </div>

                  {/* Preview do produto selecionado */}
                  {produtoSelecionado && (
                    <div className="flex gap-4 p-4 rounded-xl bg-background-100/70 border border-background-200/60">
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-background-200/60">
                        {produtoSelecionado.image_url ? (
                          <img
                            src={produtoSelecionado.image_url}
                            alt={produtoSelecionado.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <i className="ri-image-line text-lg w-5 h-5 flex items-center justify-center text-foreground-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-sm font-bold text-foreground-950">
                          {produtoSelecionado.name}
                        </h4>
                        <p className="text-xs text-foreground-600 mt-1 line-clamp-2">
                          {produtoSelecionado.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tamanho */}
                  <div>
                    <label className="text-sm font-semibold text-foreground-900 mb-3 block">
                      Tamanho <span className="text-primary-500">*</span>
                    </label>
                    <select
                      name="tamanho_id"
                      value={form.tamanhoId || ""}
                      onChange={(e) => updateForm("tamanhoId", e.target.value ? Number(e.target.value) : null)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                    >
                      <option value="">Selecionar tamanho...</option>
                      {tamanhos.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Formato */}
                  <fieldset>
                    <legend className="text-sm font-semibold text-foreground-900 mb-3">
                      Formato{!form.formato && !form.formatoEspecifico && <span className="text-primary-500">*</span>}
                    </legend>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {formatos.map((f) => (
                        <label
                          key={f.id}
                          className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border cursor-pointer transition-colors ${
                            form.formato === f.nome
                              ? "border-primary-400 bg-primary-50/50"
                              : "border-background-200/70 bg-background-50 hover:border-background-300/70"
                          }`}
                        >
                          <input
                            type="radio"
                            name="formato"
                            value={f.nome}
                            checked={form.formato === f.nome}
                            onChange={() => {
                              if (form.formato === f.nome) {
                                updateForm("formato", "");
                              } else {
                                updateForm("formato", f.nome);
                                updateForm("formatoEspecifico", "");
                              }
                            }}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium text-foreground-800">{f.nome}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Formato específico */}
                  <div>
                    <label className="text-sm font-semibold text-foreground-900 mb-3 block">
                      Formato específico
                    </label>
                    <input
                      type="text"
                      name="formato_especifico"
                      value={form.formatoEspecifico}
                      onChange={(e) => {
                        updateForm("formatoEspecifico", e.target.value);
                        if (e.target.value && form.formato) {
                          updateForm("formato", "");
                        }
                      }}
                      placeholder="Ex: Oval, Hexagonal, Número..."
                      className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                    />
                  </div>

                  {/* Quantidade */}
                  <div>
                    <label className="text-sm font-semibold text-foreground-900 mb-3 block">
                      Quantidade <span className="text-primary-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateForm("quantidade", Math.max(1, form.quantidade - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-background-200/70 bg-background-50 text-foreground-700 hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-subtract-line w-4 h-4 flex items-center justify-center" />
                      </button>
                      <span className="w-12 text-center text-lg font-semibold text-foreground-950">
                        {form.quantidade}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateForm("quantidade", form.quantidade + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-background-200/70 bg-background-50 text-foreground-700 hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-add-line w-4 h-4 flex items-center justify-center" />
                      </button>
                    </div>
                  </div>

                  {/* Mensagem especial */}
                  <div>
                    <label className="text-sm font-semibold text-foreground-900 mb-3 block">
                      Mensagem especial
                    </label>
                    <textarea
                      name="mensagem_especial"
                      value={form.mensagemEspecial}
                      onChange={(e) => updateForm("mensagemEspecial", e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder='Ex: "Feliz Aniversário, Maria! Com muito carinho da equipa do Hotel."'
                      className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 resize-none"
                    />
                    <p className="text-xs text-foreground-400 mt-1">Máximo 500 caracteres</p>
                  </div>

                  {/* Alergias / Restrições */}
                  <fieldset>
                    <legend className="text-sm font-semibold text-foreground-900 mb-3">
                      Alergias / Restrições
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {alergenicos.map((a) => (
                        <label
                          key={a.id}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition-colors ${
                            form.alergias.includes(a.id)
                              ? "border-primary-400 bg-primary-50/50"
                              : "border-background-200/70 bg-background-50 hover:border-background-300/70"
                          }`}
                        >
                          <input
                            type="checkbox"
                            name={`alergia_${a.id}`}
                            checked={form.alergias.includes(a.id)}
                            onChange={() => toggleAlergia(a.id)}
                            className="w-3.5 h-3.5 text-primary-500 focus:ring-primary-300 rounded"
                          />
                          <span className="text-xs text-foreground-700">{a.nome}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Informações Adicionais */}
                  <div>
                    <label className="text-sm font-semibold text-foreground-900 mb-3 block">
                      Informações Adicionais
                    </label>
                    <textarea
                      name="informacoes_adicionais"
                      value={form.infoAdicional}
                      onChange={(e) => updateForm("infoAdicional", e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Qualquer detalhe relevante para o seu pedido..."
                      className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 resize-none"
                    />
                    <p className="text-xs text-foreground-400 mt-1">Máximo 500 caracteres</p>
                  </div>

                  {/* Data limite */}
                  <div>
                    <label className="text-sm font-semibold text-foreground-900 mb-3 block">
                      Preciso receber o orçamento até: <span className="text-primary-500">*</span>
                    </label>
                    <div className="flex items-center gap-4 flex-wrap">
                      <input
                        type="date"
                        name="data_limite"
                        value={form.dataLimite}
                        onChange={(e) => updateForm("dataLimite", e.target.value)}
                        min={minDate}
                        required
                        className="px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                      />
                      <span className="text-xs text-foreground-500 flex items-center gap-1.5">
                        <i className="ri-time-line w-3.5 h-3.5 flex items-center justify-center" />
                        Prazo mínimo – 48 horas
                      </span>
                    </div>
                  </div>

                  {/* Separador visual */}
                  <div className="border-t border-background-200/60 pt-6">
                    <p className="text-sm font-semibold text-foreground-900 mb-4">
                      Dados de contacto
                    </p>

                    {/* Nome */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-foreground-700 mb-1.5 block">
                        Nome / Apelido <span className="text-primary-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={form.nome}
                        onChange={(e) => updateForm("nome", e.target.value)}
                        required
                        placeholder="O seu nome completo"
                        className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                      />
                    </div>

                    {/* E-mail */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-foreground-700 mb-1.5 block">
                        E-mail <span className="text-primary-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={(e) => {
                          updateForm("email", e.target.value);
                          if (emailError) validateEmail(e.target.value);
                        }}
                        onBlur={(e) => validateEmail(e.target.value)}
                        required
                        placeholder="email@exemplo.pt"
                        className={`w-full px-4 py-3 rounded-xl border bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 ${
                          emailError
                            ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                            : "border-background-200/70 focus:ring-primary-300 focus:border-primary-300"
                        }`}
                      />
                      {emailError && (
                        <p className="text-xs text-red-500 mt-1">{emailError}</p>
                      )}
                    </div>

                    {/* Telemóvel */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-foreground-700 mb-1.5 block">
                        Telemóvel <span className="text-primary-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          name="codigo_pais"
                          value={form.codigoPais}
                          onChange={(e) => updateForm("codigoPais", e.target.value)}
                          className="w-28 px-3 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                        >
                          <option value="+351">🇵🇹 +351</option>
                          <option value="+55">🇧🇷 +55</option>
                          <option value="+34">🇪🇸 +34</option>
                          <option value="+33">🇫🇷 +33</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+244">🇦🇴 +244</option>
                          <option value="+258">🇲🇿 +258</option>
                          <option value="+238">🇨🇻 +238</option>
                        </select>
                        <input
                          type="tel"
                          name="telefone"
                          value={form.telefone}
                          onChange={(e) => updateForm("telefone", e.target.value)}
                          required
                          placeholder="912 345 678"
                          className="flex-1 px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                        />
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="whatsapp"
                        checked={form.whatsapp}
                        onChange={(e) => updateForm("whatsapp", e.target.checked)}
                        className="w-4 h-4 rounded border-background-300 text-primary-500 focus:ring-primary-300"
                      />
                      <span className="text-sm text-foreground-700">
                        Possui WhatsApp?
                      </span>
                    </label>

                    {/* Função do Cliente */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-foreground-700 mb-1.5 block">
                        Função / Cargo
                      </label>
                      <input
                        type="text"
                        name="funcao_cliente"
                        value={form.funcaoCliente}
                        onChange={(e) => updateForm("funcaoCliente", e.target.value)}
                        placeholder="Ex: Chef de Cozinha, Gerente de Compras, Diretor..."
                        className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                      />
                    </div>

                    {/* NIP/NIF do Cliente */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-foreground-700 mb-1.5 block">
                        NIP / NIF
                      </label>
                      <input
                        type="text"
                        name="nip_nif_cliente"
                        value={form.nipNifCliente}
                        onChange={(e) => updateForm("nipNifCliente", e.target.value)}
                        placeholder="Número de Identificação Fiscal"
                        className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                      />
                    </div>

                    {/* Estabelecimento */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-foreground-700 mb-1.5 block">
                        Estabelecimento
                      </label>
                      <input
                        type="text"
                        name="estabelecimento"
                        value={form.estabelecimento}
                        onChange={(e) => updateForm("estabelecimento", e.target.value)}
                        placeholder="Nome do estabelecimento / empresa"
                        className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Honeypot */}
              <input
                type="text"
                name="phone_alt"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                readOnly
                className="form-safety-net"
              />

              {/* Erro */}
              {erroMsg && (
                <div className="p-4 rounded-xl bg-primary-100 border border-primary-200 text-primary-800 text-sm">
                  {erroMsg}
                </div>
              )}

              {/* Submit */}
              {form.tipo === "unidade" && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-8 py-3.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                      A enviar...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center" />
                      Enviar pedido de orçamento
                    </>
                  )}
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}