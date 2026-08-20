import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";

interface GalleryProduct {
  id: number;
  name: string;
  slug: string | null;
  description: string;
  descricao_longa: string | null;
  image_url: string;
  imagem_thumb: string | null;
  image_fit: string | null;
  image_position: string | null;
  image_scale: number | null;
  price: number | null;
  formato: string | null;
  tag: string | null;
  dica_chef: string | null;
  familia: string | null;
  familia_slug: string | null;
  alergeneos: string[];
  ingredientes: string[];
  antecedencia: string | null;
  disponibilidade: string | null;
  conservacao: string | null;
  validade: string | null;
  estado: string;
  assinatura_chef: boolean;
  b2b: boolean;
  fora_catalogo: boolean;
  variacoes: { nome: string; preco: string; precoNumero: number }[];
  categories: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const FAMILIAS = [
  { nome: "Cheesecakes", slug: "cheesecakes" },
  { nome: "Cremeux", slug: "cremeux" },
  { nome: "Troncos de Natal", slug: "troncos" },
  { nome: "Ovos de Páscoa de Colher", slug: "ovos-pascoa" },
  { nome: "Bolos & Eventos", slug: "bolos-eventos" },
  { nome: "Pavés, Tartes & Entremets", slug: "paves-tartes" },
  { nome: "Para Profissionais", slug: "profissionais" },
];

const ALERGENEOS_PREDEFINIDOS = [
  "Glúten",
  "Lactose",
  "Ovo",
  "Frutos de casca rija",
  "Soja",
  "Amendoim",
  "Peixe",
  "Crustáceos",
  "Aipo",
  "Mostarda",
  "Sementes de sésamo",
  "Tremoço",
  "Moluscos",
  "Sulfitos",
];

const DISPONIBILIDADE_OPCOES = [
  "Por encomenda",
  "Encomenda recorrente",
  "Sazonal",
  "Stock diário",
];

const DICA_CHEF_OPCOES = [
  "POPULAR",
  "RECOMENDADO",
  "PREMIUM",
  "OCASIÃO ESPECIAL",
  "CLÁSSICO",
  "NOVO",
  "EDIÇÃO LIMITADA",
  "EDIÇÃO PÁSCOA",
  "EDIÇÃO NATAL",
  "SOB CONSULTA",
];

const ESTADO_OPCOES = [
  { value: "rascunho", label: "Rascunho" },
  { value: "publicado", label: "Publicado" },
  { value: "arquivado", label: "Arquivado" },
];

const TODAS_CATEGORIAS = [
  "Restaurantes",
  "Hotéis",
  "Eventos",
  "Individual",
  "Para partilhar",
  "Sazonal",
];

export default function AdminCatalogoPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<GalleryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filtroFamilia, setFiltroFamilia] = useState<string>("todas");
  const [filtroAssinaturaChef, setFiltroAssinaturaChef] = useState(false);
  const [filtroB2b, setFiltroB2b] = useState(false);
  const [filtroNenhum, setFiltroNenhum] = useState(false);
  const [filtroForaCatalogo, setFiltroForaCatalogo] = useState(false);
  const [filtroRascunho, setFiltroRascunho] = useState(false);
  const [filtroPublicado, setFiltroPublicado] = useState(false);
  const [filtroArquivado, setFiltroArquivado] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<GalleryProduct> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [novoAlergeneo, setNovoAlergeneo] = useState("");
  const [novoIngrediente, setNovoIngrediente] = useState("");
  const [novaVariacaoNome, setNovaVariacaoNome] = useState("");
  const [novaVariacaoPreco, setNovaVariacaoPreco] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [imageFit, setImageFit] = useState("cover");
  const [imagePosX, setImagePosX] = useState(50);
  const [imagePosY, setImagePosY] = useState(50);
  const [imageScale, setImageScale] = useState(1.0);

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [openColumnMenu, setOpenColumnMenu] = useState<string | null>(null);
  const columnMenuRef = useRef<HTMLDivElement | null>(null);
  const filterInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target as Node)) {
        setOpenColumnMenu(null);
      }
    };
    if (openColumnMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => filterInputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openColumnMenu]);

  useEffect(() => {
    const session = localStorage.getItem("manger_admin_session");
    if (!session) {
      navigate("/admin");
    }
  }, [navigate]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("b2b_gallery_products")
        .select("*")
        .order("sort_order", { ascending: true });

      if (fetchError) throw fetchError;
      setProducts((data as GalleryProduct[]) || []);
    } catch (err) {
      setError("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = (() => {
    let result = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchFamilia = filtroFamilia === "todas" || p.familia_slug === filtroFamilia;
      const qualquerFiltroAtivo = filtroAssinaturaChef || filtroB2b || filtroNenhum || filtroForaCatalogo;
      const matchAssinatura = filtroAssinaturaChef && p.assinatura_chef === true;
      const matchB2b = filtroB2b && p.b2b === true;
      const matchForaCatalogo = filtroForaCatalogo && p.fora_catalogo === true;
      const matchNenhum = filtroNenhum && p.assinatura_chef === false && p.b2b === false && p.fora_catalogo === false;
      const matchTag = !qualquerFiltroAtivo || matchAssinatura || matchB2b || matchForaCatalogo || matchNenhum;
      const filtroEstadoAtivo = filtroRascunho || filtroPublicado || filtroArquivado;
      const matchRascunho = filtroRascunho && p.estado === "rascunho";
      const matchPublicado = filtroPublicado && p.estado === "publicado";
      const matchArquivado = filtroArquivado && p.estado === "arquivado";
      const matchEstado = !filtroEstadoAtivo || matchRascunho || matchPublicado || matchArquivado;
      return matchSearch && matchFamilia && matchTag && matchEstado;
    });

    Object.entries(columnFilters).forEach(([col, filter]) => {
      if (!filter.trim()) return;
      const term = filter.toLowerCase().trim();
      result = result.filter((p) => {
        switch (col) {
          case "nome":
            return p.name.toLowerCase().includes(term);
          case "b2b_categoria":
            return (p.categories || []).some((c) => c.toLowerCase().includes(term));
          case "alergeneos":
            return (p.alergeneos || []).some((a) => a.toLowerCase().includes(term));
          case "dica_chef":
            return (p.dica_chef || "").toLowerCase().includes(term);
          case "estado":
            return (p.estado || "").toLowerCase().includes(term);
          default:
            return true;
        }
      });
    });

    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let valA = "";
        let valB = "";
        switch (sortColumn) {
          case "nome":
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
            break;
          case "b2b_categoria":
            valA = (a.categories || []).join(", ").toLowerCase();
            valB = (b.categories || []).join(", ").toLowerCase();
            break;
          case "alergeneos":
            valA = (a.alergeneos || []).join(", ").toLowerCase();
            valB = (b.alergeneos || []).join(", ").toLowerCase();
            break;
          case "dica_chef":
            valA = (a.dica_chef || "").toLowerCase();
            valB = (b.dica_chef || "").toLowerCase();
            break;
          case "estado":
            valA = (a.estado || "").toLowerCase();
            valB = (b.estado || "").toLowerCase();
            break;
          default:
            return 0;
        }
        return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }

    return result;
  })();

  const toggleColumnMenu = (col: string) => {
    setOpenColumnMenu((prev) => (prev === col ? null : col));
  };

  const handleColumnSort = (col: string, dir: "asc" | "desc") => {
    setSortColumn(col);
    setSortDirection(dir);
    setOpenColumnMenu(null);
  };

  const handleColumnFilter = (col: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [col]: value }));
  };

  const clearColumnFilter = (col: string) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      delete next[col];
      return next;
    });
    setSortColumn(null);
    setOpenColumnMenu(null);
  };

  const openEdit = (product: GalleryProduct) => {
    setEditingProduct({ ...product });
    setIsNew(false);
    setSaveError("");
    setNovoAlergeneo("");
    setImageFit(product.image_fit || "cover");
    const pos = (product.image_position || "center").split(/\s+/);
    setImagePosX(parseFloat(pos[0]) || 50);
    setImagePosY(parseFloat(pos[1]) || parseFloat(pos[0]) || 50);
    setImageScale(parseFloat(String(product.image_scale)) || 1.0);
  };

  const openNew = () => {
    setEditingProduct({
      name: "",
      slug: "",
      description: "",
      descricao_longa: "",
      image_url: "",
      imagem_thumb: "",
      image_fit: "cover",
      image_position: "center",
      price: null,
      formato: "",
      tag: "",
      dica_chef: "",
      familia: "",
      familia_slug: "",
      alergeneos: [],
      ingredientes: [],
      antecedencia: "",
      disponibilidade: "",
      conservacao: "",
      validade: "",
      estado: "publicado",
      assinatura_chef: false,
      b2b: false,
      fora_catalogo: false,
      variacoes: [],
      categories: [],
      sort_order: products.length + 1,
    });
    setIsNew(true);
    setSaveError("");
    setNovoAlergeneo("");
    setNovoIngrediente("");
    setNovaVariacaoNome("");
    setNovaVariacaoPreco("");
    setImageFit("cover");
    setImagePosX(50);
    setImagePosY(50);
    setImageScale(1.0);
  };

  const closeEditor = () => {
    setEditingProduct(null);
    setSaveError("");
  };

  const toggleAlergeneo = (alerg: string) => {
    if (!editingProduct) return;
    const current = editingProduct.alergeneos || [];
    const updated = current.includes(alerg)
      ? current.filter((a) => a !== alerg)
      : [...current, alerg];
    setEditingProduct({ ...editingProduct, alergeneos: updated });
  };

  const addNovoAlergeneo = () => {
    const trimmed = novoAlergeneo.trim();
    if (!trimmed || !editingProduct) return;
    const current = editingProduct.alergeneos || [];
    if (current.includes(trimmed)) {
      setNovoAlergeneo("");
      return;
    }
    setEditingProduct({ ...editingProduct, alergeneos: [...current, trimmed] });
    setNovoAlergeneo("");
  };

  const removeAlergeneo = (alerg: string) => {
    if (!editingProduct) return;
    const updated = (editingProduct.alergeneos || []).filter((a) => a !== alerg);
    setEditingProduct({ ...editingProduct, alergeneos: updated });
  };

  const addNovoIngrediente = () => {
    const trimmed = novoIngrediente.trim();
    if (!trimmed || !editingProduct) return;
    const current = editingProduct.ingredientes || [];
    if (current.includes(trimmed)) {
      setNovoIngrediente("");
      return;
    }
    setEditingProduct({ ...editingProduct, ingredientes: [...current, trimmed] });
    setNovoIngrediente("");
  };

  const removeIngrediente = (ing: string) => {
    if (!editingProduct) return;
    const updated = (editingProduct.ingredientes || []).filter((i) => i !== ing);
    setEditingProduct({ ...editingProduct, ingredientes: updated });
  };

  const toggleCategory = (cat: string) => {
    if (!editingProduct) return;
    const current = editingProduct.categories || [];
    const updated = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    setEditingProduct({ ...editingProduct, categories: updated });
  };

  const handleFamiliaChange = (familiaNome: string, familiaSlugVal: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      familia: familiaNome,
      familia_slug: familiaSlugVal,
    });
  };

  const addVariacao = () => {
    if (!editingProduct || !novaVariacaoNome.trim() || !novaVariacaoPreco.trim()) return;
    const precoNum = parseFloat(novaVariacaoPreco.replace(",", "."));
    if (isNaN(precoNum)) return;
    const variacoes = [...(editingProduct.variacoes || [])];
    variacoes.push({
      nome: novaVariacaoNome.trim(),
      preco: `${precoNum.toFixed(2).replace(".", ",")} €`,
      precoNumero: precoNum,
    });
    setEditingProduct({ ...editingProduct, variacoes });
    setNovaVariacaoNome("");
    setNovaVariacaoPreco("");
  };

  const removeVariacao = (idx: number) => {
    if (!editingProduct) return;
    const variacoes = [...(editingProduct.variacoes || [])];
    variacoes.splice(idx, 1);
    setEditingProduct({ ...editingProduct, variacoes });
  };

  const handleImageUpload = async (file: File, field: "image_url" | "imagem_thumb") => {
    if (!file || !editingProduct) return;

    const rawName = file.name;
    const dotIndex = rawName.lastIndexOf(".");
    const base = dotIndex > 0 ? rawName.substring(0, dotIndex) : rawName;
    const ext = dotIndex > 0 ? rawName.substring(dotIndex).toLowerCase() : "";

    const safeBase = base
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9._-]/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 50);

    const timestamp = Date.now();
    const fileName = `${safeBase}-${timestamp}${ext}`;
    const filePath = `produtos/${fileName}`;

    if (field === "image_url") setUploadingImage(true);
    else setUploadingThumb(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from("public")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: signedData, error: signedError } = await supabase.storage
        .from("public")
        .createSignedUrl(filePath, 31536000);

      if (signedError) throw signedError;

      setEditingProduct({ ...editingProduct, [field]: signedData.signedUrl });
    } catch (err: any) {
      setSaveError(err?.message || "Erro ao fazer upload da imagem.");
    } finally {
      if (field === "image_url") setUploadingImage(false);
      else setUploadingThumb(false);
    }
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    if (!editingProduct.name?.trim()) {
      setSaveError("O nome do produto é obrigatório.");
      return;
    }

    setSaving(true);
    setSaveError("");

    const payload = {
      name: editingProduct.name.trim(),
      slug: editingProduct.slug?.trim() || editingProduct.name.trim().toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      description: editingProduct.description?.trim() || "",
      descricao_longa: editingProduct.descricao_longa?.trim() || "",
      image_url: editingProduct.image_url?.trim() || "",
      imagem_thumb: editingProduct.imagem_thumb?.trim() || "",
      image_fit: imageFit,
      image_position: `${imagePosX}% ${imagePosY}%`,
      image_scale: imageScale,
      price: editingProduct.price ?? null,
      formato: editingProduct.formato?.trim() || "",
      tag: editingProduct.tag?.trim() || "",
      dica_chef: editingProduct.dica_chef || "",
      familia: editingProduct.familia || "",
      familia_slug: editingProduct.familia_slug || "",
      alergeneos: editingProduct.alergeneos || [],
      ingredientes: editingProduct.ingredientes || [],
      antecedencia: editingProduct.antecedencia?.trim() || "",
      disponibilidade: editingProduct.disponibilidade || "",
      conservacao: editingProduct.conservacao?.trim() || "",
      validade: editingProduct.validade?.trim() || "",
      estado: editingProduct.estado || "publicado",
      assinatura_chef: editingProduct.assinatura_chef ?? false,
      b2b: editingProduct.b2b ?? false,
      fora_catalogo: editingProduct.fora_catalogo ?? false,
      variacoes: editingProduct.variacoes || [],
      categories: editingProduct.categories || [],
      sort_order: editingProduct.sort_order || 0,
    };

    try {
      if (isNew) {
        const { error: insertError } = await supabase
          .from("b2b_gallery_products")
          .insert(payload);
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from("b2b_gallery_products")
          .update(payload)
          .eq("id", editingProduct.id!);
        if (updateError) throw updateError;
      }

      closeEditor();
      fetchProducts();
    } catch (err: any) {
      setSaveError(err?.message || "Erro ao guardar o produto.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm === null) return;
    setDeleting(true);
    try {
      const { error: delError } = await supabase
        .from("b2b_gallery_products")
        .delete()
        .eq("id", deleteConfirm);
      if (delError) throw delError;
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err: any) {
      setSaveError(err?.message || "Erro ao eliminar o produto.");
    } finally {
      setDeleting(false);
    }
  };

  const familiasCount = products.reduce((acc, p) => {
    if (p.familia_slug) {
      acc[p.familia_slug] = (acc[p.familia_slug] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-[100dvh] flex bg-background-50">
      <AdminSidebar activeHref="/admin/catalogo" title="Catálogo" />

      <main className="flex-1 lg:pt-0 pt-14">
        <div className="px-4 md:px-8 py-6 md:py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <i className="ri-cake-3-line text-xl w-5 h-5 flex items-center justify-center" />
              </div>
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">
                  Catálogo
                </h1>
                <p className="text-sm text-foreground-600">
                  Gestão de produtos do catálogo público e da página &quot;Para Empresas&quot;
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center" />
              Novo produto
            </button>
          </div>

          <div className="mb-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 w-4 h-4 flex items-center justify-center" />
              <input
                type="text"
                placeholder="Procurar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFiltroFamilia("todas")}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filtroFamilia === "todas"
                    ? "bg-primary-500 text-background-50"
                    : "bg-background-100 text-foreground-700 hover:bg-background-200 border border-background-200/70"
                }`}
              >
                Todas ({products.length})
              </button>
              {FAMILIAS.map((f) => {
                const count = familiasCount[f.slug] || 0;
                if (count === 0) return null;
                return (
                  <button
                    key={f.slug}
                    type="button"
                    onClick={() => setFiltroFamilia(f.slug)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      filtroFamilia === f.slug
                        ? "bg-primary-500 text-background-50"
                        : "bg-background-100 text-foreground-700 hover:bg-background-200 border border-background-200/70"
                    }`}
                  >
                    {f.nome} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5 flex items-center gap-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtroAssinaturaChef}
                onChange={(e) => setFiltroAssinaturaChef(e.target.checked)}
                className="w-4 h-4 rounded border-background-300 text-primary-500 focus:ring-primary-400 cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground-800">Assinatura do Chef</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtroB2b}
                onChange={(e) => setFiltroB2b(e.target.checked)}
                className="w-4 h-4 rounded border-background-300 text-primary-500 focus:ring-primary-400 cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground-800">B2B (Para Empresas)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtroNenhum}
                onChange={(e) => setFiltroNenhum(e.target.checked)}
                className="w-4 h-4 rounded border-background-300 text-primary-500 focus:ring-primary-400 cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground-800">Nenhum</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtroForaCatalogo}
                onChange={(e) => setFiltroForaCatalogo(e.target.checked)}
                className="w-4 h-4 rounded border-background-300 text-foreground-400 focus:ring-foreground-400 cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground-800">Fora do Catálogo</span>
            </label>
            <span className="w-px h-5 bg-background-200/70" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtroRascunho}
                onChange={(e) => setFiltroRascunho(e.target.checked)}
                className="w-4 h-4 rounded border-background-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground-800">Rascunho</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtroPublicado}
                onChange={(e) => setFiltroPublicado(e.target.checked)}
                className="w-4 h-4 rounded border-background-300 text-green-500 focus:ring-green-400 cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground-800">Publicado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtroArquivado}
                onChange={(e) => setFiltroArquivado(e.target.checked)}
                className="w-4 h-4 rounded border-background-300 text-foreground-400 focus:ring-foreground-400 cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground-800">Arquivado</span>
            </label>
            <span className="text-xs text-foreground-500">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading && (
            <div className="rounded-xl bg-background-100 border border-background-200/70 p-12 text-center">
              <i className="ri-loader-4-line animate-spin text-2xl w-6 h-6 flex items-center justify-center mx-auto text-primary-500 mb-3" />
              <p className="text-sm text-foreground-600">A carregar produtos...</p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl bg-background-100 border border-primary-200 p-6 text-center">
              <i className="ri-error-warning-line text-2xl w-6 h-6 flex items-center justify-center mx-auto text-primary-500 mb-3" />
              <p className="text-sm text-primary-700 mb-4">{error}</p>
              <button
                type="button"
                onClick={fetchProducts}
                className="px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="rounded-xl bg-background-100 border border-background-200/70 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-background-200/70 bg-background-200/30">
                      <th className="text-left px-4 py-3 font-medium text-foreground-700 whitespace-nowrap">#</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground-700 whitespace-nowrap">Imagem</th>
                      {[
                        { key: "nome", label: "Nome" },
                        { key: "b2b_categoria", label: "B2B Categoria" },
                        { key: "alergeneos", label: "Alergéneos" },
                        { key: "dica_chef", label: "Dica do Chef" },
                        { key: "estado", label: "Estado" },
                      ].map((col) => {
                        const isSorted = sortColumn === col.key;
                        const hasFilter = (columnFilters[col.key] || "").trim().length > 0;
                        const isOpen = openColumnMenu === col.key;
                        return (
                          <th key={col.key} className="text-left px-4 py-3 font-medium text-foreground-700 whitespace-nowrap relative">
                            <button
                              type="button"
                              onClick={() => toggleColumnMenu(col.key)}
                              className="inline-flex items-center gap-1.5 group cursor-pointer hover:text-foreground-950 transition-colors"
                            >
                              <span>{col.label}</span>
                              <span className="flex flex-col leading-none text-foreground-400">
                                <i
                                  className={`ri-arrow-up-s-line w-3 h-3 flex items-center justify-center -mb-1 transition-colors ${
                                    isSorted && sortDirection === "asc" ? "text-primary-500" : "text-foreground-400 group-hover:text-foreground-600"
                                  }`}
                                />
                                <i
                                  className={`ri-arrow-down-s-line w-3 h-3 flex items-center justify-center transition-colors ${
                                    isSorted && sortDirection === "desc" ? "text-primary-500" : "text-foreground-400 group-hover:text-foreground-600"
                                  }`}
                                />
                              </span>
                              {hasFilter && (
                                <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-accent-500 inline-block" />
                              )}
                            </button>

                            {isOpen && (
                              <div
                                ref={columnMenuRef}
                                className="absolute top-full left-0 mt-1 z-30 w-56 rounded-xl bg-background-50 border border-background-200/70 shadow-lg p-3"
                              >
                                <div className="flex items-center gap-1 mb-2">
                                  <button
                                    type="button"
                                    onClick={() => handleColumnSort(col.key, "asc")}
                                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                                      isSorted && sortDirection === "asc"
                                        ? "bg-primary-500 text-background-50"
                                        : "bg-background-100 text-foreground-700 hover:bg-background-200 border border-background-200/70"
                                    }`}
                                  >
                                    <i className="ri-sort-asc w-3 h-3 flex items-center justify-center" />
                                    A→Z
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleColumnSort(col.key, "desc")}
                                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                                      isSorted && sortDirection === "desc"
                                        ? "bg-primary-500 text-background-50"
                                        : "bg-background-100 text-foreground-700 hover:bg-background-200 border border-background-200/70"
                                    }`}
                                  >
                                    <i className="ri-sort-desc w-3 h-3 flex items-center justify-center" />
                                    Z→A
                                  </button>
                                </div>

                                <div className="relative">
                                  <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground-400 w-3.5 h-3.5 flex items-center justify-center" />
                                  <input
                                    ref={filterInputRef}
                                    type="text"
                                    value={columnFilters[col.key] || ""}
                                    onChange={(e) => handleColumnFilter(col.key, e.target.value)}
                                    placeholder="Filtrar..."
                                    className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-background-200/70 bg-background-100 text-xs text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
                                  />
                                </div>

                                {(hasFilter || isSorted) && (
                                  <button
                                    type="button"
                                    onClick={() => clearColumnFilter(col.key)}
                                    className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-primary-600 hover:bg-primary-50 cursor-pointer whitespace-nowrap transition-colors"
                                  >
                                    <i className="ri-close-circle-line w-3.5 h-3.5 flex items-center justify-center" />
                                    Limpar filtro
                                  </button>
                                )}
                              </div>
                            )}
                          </th>
                        );
                      })}
                      <th className="text-left px-4 py-3 font-medium text-foreground-700 whitespace-nowrap">Preço</th>
                      <th className="text-right px-4 py-3 font-medium text-foreground-700 whitespace-nowrap">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-background-200/50 hover:bg-background-200/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-foreground-500">{product.sort_order}</td>
                        <td className="px-4 py-3">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover border border-background-200/70"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-background-200/60 flex items-center justify-center">
                              <i className="ri-image-line text-foreground-400 w-4 h-4 flex items-center justify-center" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground-950">{product.name}</p>
                          <p className="text-xs text-foreground-500 mt-0.5 line-clamp-1">{product.description}</p>
                        </td>
                        <td className="px-4 py-3">
                          {(product.categories || []).length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[140px]">
                              {(product.categories || []).map((cat) => (
                                <span key={cat} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent-100 text-accent-800 whitespace-nowrap">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-foreground-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {(product.alergeneos || []).slice(0, 2).map((a) => (
                              <span key={a} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-background-200/60 text-foreground-600 whitespace-nowrap">
                                {a}
                              </span>
                            ))}
                            {(product.alergeneos || []).length > 2 && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-background-200/60 text-foreground-500 whitespace-nowrap">
                                +{(product.alergeneos || []).length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {product.dica_chef ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-accent-100 text-accent-800 whitespace-nowrap">
                              {product.dica_chef}
                            </span>
                          ) : (
                            <span className="text-foreground-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${
                            product.estado === "publicado" ? "bg-green-100 text-green-800" :
                            product.estado === "rascunho" ? "bg-amber-100 text-amber-800" :
                            "bg-foreground-200 text-foreground-600"
                          }`}>
                            {product.estado === "publicado" ? "Publicado" :
                             product.estado === "rascunho" ? "Rascunho" : "Arquivado"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-foreground-700 whitespace-nowrap">
                          {product.price != null
                            ? `${Number(product.price).toFixed(2).replace(".", ",")} €`
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEdit(product)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-200/60 cursor-pointer transition-colors"
                              title="Editar"
                            >
                              <i className="ri-pencil-line text-foreground-600 w-4 h-4 flex items-center justify-center" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(product.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-100 cursor-pointer transition-colors"
                              title="Eliminar"
                            >
                              <i className="ri-delete-bin-line text-primary-500 w-4 h-4 flex items-center justify-center" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-12 text-center text-foreground-500">
                          {search || filtroFamilia !== "todas" || filtroAssinaturaChef || filtroB2b || filtroNenhum || filtroForaCatalogo || filtroRascunho || filtroPublicado || filtroArquivado
                            ? "Nenhum produto encontrado."
                            : "Nenhum produto no catálogo. Clique em \"Novo produto\" para começar."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-8 pb-8">
          <div className="w-full max-w-2xl bg-background-50 rounded-2xl shadow-lg max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-background-50 z-10 p-6 border-b border-background-200/70 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground-950">
                {isNew ? "Novo produto" : "Editar produto"}
              </h2>
              <button
                type="button"
                onClick={closeEditor}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-200/60 cursor-pointer transition-colors"
              >
                <i className="ri-close-line text-lg w-5 h-5 flex items-center justify-center text-foreground-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Nome *</label>
                  <input type="text" value={editingProduct.name || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Nome do produto"
                    className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Slug (URL)</label>
                  <input type="text" value={editingProduct.slug || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    placeholder="slug-do-produto"
                    className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-800 mb-1.5">Descrição</label>
                <textarea value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3} placeholder="Descrição curta do produto"
                  className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-800 mb-1.5">Descrição longa</label>
                <textarea value={editingProduct.descricao_longa || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descricao_longa: e.target.value })}
                  rows={4} placeholder="Descrição detalhada para a página de produto..."
                  className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Imagem principal</label>
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-background-300 bg-background-100 text-sm text-foreground-500 hover:border-primary-400 hover:text-primary-600 cursor-pointer transition-colors">
                      <i className="ri-upload-cloud-2-line w-4 h-4 flex items-center justify-center shrink-0" />
                      <span className="truncate">{uploadingImage ? "A enviar..." : "Upload"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingImage}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "image_url");
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-foreground-400 shrink-0">ou URL</span>
                    <div className="flex-1 h-px bg-background-200/70" />
                  </div>
                  <input type="text" value={editingProduct.image_url || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full mt-2 px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                  {editingProduct.image_url && (
                    <img src={editingProduct.image_url} alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg border border-background-200/70" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Thumbnail</label>
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-background-300 bg-background-100 text-sm text-foreground-500 hover:border-primary-400 hover:text-primary-600 cursor-pointer transition-colors">
                      <i className="ri-upload-cloud-2-line w-4 h-4 flex items-center justify-center shrink-0" />
                      <span className="truncate">{uploadingThumb ? "A enviar..." : "Upload"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingThumb}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "imagem_thumb");
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-foreground-400 shrink-0">ou URL</span>
                    <div className="flex-1 h-px bg-background-200/70" />
                  </div>
                  <input type="text" value={editingProduct.imagem_thumb || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imagem_thumb: e.target.value })}
                    placeholder="https://..."
                    className="w-full mt-2 px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                  {editingProduct.imagem_thumb && (
                    <img src={editingProduct.imagem_thumb} alt="Preview thumbnail"
                      className="mt-2 w-full h-32 object-cover rounded-lg border border-background-200/70" />
                  )}
                </div>
              </div>

              {editingProduct.image_url && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-background-200/70 bg-background-100 p-4">
                    <p className="text-xs font-medium text-foreground-600 mb-3">Pré-visualização no catálogo (4:3)</p>
                    <div className="w-full max-w-[320px] mx-auto aspect-[4/3] overflow-hidden rounded-lg border border-background-200/70 bg-background-200/40">
                      <img
                        src={editingProduct.image_url}
                        alt="Preview catálogo"
                        style={{
                          width: '120%',
                          height: '120%',
                          maxWidth: 'none',
                          maxHeight: 'none',
                          marginLeft: '-10%',
                          marginTop: '-10%',
                          objectFit: imageFit as any,
                          objectPosition: `${imagePosX}% ${imagePosY}%`,
                          transform: `scale(${imageScale})`,
                          transformOrigin: 'center center',
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-background-200/70 bg-background-100 p-4 flex flex-col justify-center">
                    <p className="text-xs font-medium text-foreground-600 mb-3">Controlo de imagem</p>

                    <div className="grid grid-cols-1 gap-3 items-end">
                      <div>
                        <label className="block text-xs font-medium text-foreground-700 mb-1">Ajuste</label>
                        <div className="flex rounded-lg border border-background-200/70 overflow-hidden">
                          <button type="button"
                            onClick={() => setImageFit("cover")}
                            className={`flex-1 px-4 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${imageFit === "cover" ? "bg-primary-500 text-background-50" : "bg-background-100 text-foreground-700 hover:bg-background-200/60"}`}>
                            Preencher
                          </button>
                          <button type="button"
                            onClick={() => setImageFit("contain")}
                            className={`flex-1 px-4 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${imageFit === "contain" ? "bg-primary-500 text-background-50" : "bg-background-100 text-foreground-700 hover:bg-background-200/60"}`}>
                            Ajustar
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground-700 mb-1">Zoom: {imageScale.toFixed(1)}x</label>
                        <input type="range" min={0.3} max={1.7} step={0.1} value={imageScale}
                          onChange={(e) => setImageScale(parseFloat(e.target.value))}
                          className="w-full accent-primary-500 cursor-pointer" />
                        <div className="flex justify-between text-[10px] text-foreground-400 mt-0.5">
                          <span>Reduzir</span>
                          <span>1x</span>
                          <span>Ampliar</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="block text-xs font-medium text-foreground-700 mb-1">Horizontal: {imagePosX}%</label>
                        <input type="range" min={0} max={100} value={imagePosX}
                          onChange={(e) => setImagePosX(parseInt(e.target.value, 10))}
                          className="w-full accent-primary-500 cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground-700 mb-1">Vertical: {imagePosY}%</label>
                        <input type="range" min={0} max={100} value={imagePosY}
                          onChange={(e) => setImagePosY(parseInt(e.target.value, 10))}
                          className="w-full accent-primary-500 cursor-pointer" />
                      </div>
                      <div className="flex justify-end">
                        <button type="button"
                          onClick={() => { setImagePosX(50); setImagePosY(50); setImageFit("cover"); setImageScale(1.0); }}
                          className="w-full px-4 py-2 rounded-lg text-xs font-medium bg-background-100 text-foreground-700 border border-background-200/70 hover:bg-background-200/60 cursor-pointer whitespace-nowrap transition-colors">
                          <i className="ri-refresh-line w-3 h-3 inline-flex items-center justify-center mr-1" />
                          Repor
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Preço (€)</label>
                  <input type="number" step="0.01" min="0"
                    value={editingProduct.price ?? ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value === "" ? null : parseFloat(e.target.value) })}
                    placeholder="0,00"
                    className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Formato</label>
                  <input type="text" value={editingProduct.formato || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, formato: e.target.value })}
                    placeholder="Ex: 22 cm · 10 fatias"
                    className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Dica do Chef</label>
                  <select
                    value={editingProduct.dica_chef || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, dica_chef: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
                  >
                    <option value="">— Selecionar —</option>
                    {DICA_CHEF_OPCOES.map((opcao) => (
                      <option key={opcao} value={opcao}>{opcao}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-800 mb-2">Família do doce</label>
                <div className="flex flex-wrap gap-2">
                  {FAMILIAS.map((f) => {
                    const active = editingProduct.familia_slug === f.slug;
                    return (
                      <button key={f.slug} type="button"
                        onClick={() => handleFamiliaChange(f.nome, f.slug)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          active ? "bg-primary-500 text-background-50" : "bg-background-100 text-foreground-700 border border-background-200/70 hover:border-primary-300/50"
                        }`}>
                        {active && <i className="ri-check-line mr-1 w-3 h-3 inline-flex items-center justify-center" />}
                        {f.nome}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-800 mb-2">Alergênicos</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {ALERGENEOS_PREDEFINIDOS.map((alerg) => {
                    const active = (editingProduct.alergeneos || []).includes(alerg);
                    return (
                      <button key={alerg} type="button"
                        onClick={() => toggleAlergeneo(alerg)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          active ? "bg-primary-500 text-background-50" : "bg-background-100 text-foreground-700 border border-background-200/70 hover:border-primary-300/50"
                        }`}>
                        {active && <i className="ri-check-line mr-1 w-3 h-3 inline-flex items-center justify-center" />}
                        {alerg}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <i className="ri-add-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 w-4 h-4 flex items-center justify-center" />
                    <input type="text" value={novoAlergeneo}
                      onChange={(e) => setNovoAlergeneo(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNovoAlergeneo(); } }}
                      placeholder="+1 adicionar alergénio..."
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                  </div>
                  <button type="button" onClick={addNovoAlergeneo}
                    className="px-3 py-2 rounded-lg bg-secondary-500 hover:bg-secondary-600 text-background-50 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors">
                    Adicionar
                  </button>
                </div>
                {(editingProduct.alergeneos || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(editingProduct.alergeneos || []).map((a) => (
                      <span key={a} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-100 text-primary-800 text-sm font-medium">
                        {a}
                        <button type="button" onClick={() => removeAlergeneo(a)}
                          className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary-200 cursor-pointer transition-colors">
                          <i className="ri-close-line w-3 h-3 flex items-center justify-center" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-800 mb-2">Ingredientes</label>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <i className="ri-add-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 w-4 h-4 flex items-center justify-center" />
                    <input type="text" value={novoIngrediente}
                      onChange={(e) => setNovoIngrediente(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNovoIngrediente(); } }}
                      placeholder="Adicionar ingrediente..."
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                  </div>
                  <button type="button" onClick={addNovoIngrediente}
                    className="px-3 py-2 rounded-lg bg-secondary-500 hover:bg-secondary-600 text-background-50 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors">
                    Adicionar
                  </button>
                </div>
                {(editingProduct.ingredientes || []).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(editingProduct.ingredientes || []).map((ing) => (
                      <span key={ing} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary-100 text-secondary-800 text-sm font-medium">
                        {ing}
                        <button type="button" onClick={() => removeIngrediente(ing)}
                          className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-secondary-200 cursor-pointer transition-colors">
                          <i className="ri-close-line w-3 h-3 flex items-center justify-center" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Conservação</label>
                  <input type="text" value={editingProduct.conservacao || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, conservacao: e.target.value })}
                    placeholder="Ex: Conservar no frigorífico entre 2–6 °C"
                    className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Validade</label>
                  <input type="text" value={editingProduct.validade || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, validade: e.target.value })}
                    placeholder="Ex: 3 dias no frigorífico após entrega"
                    className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Prazo de entrega</label>
                  <input type="text" value={editingProduct.antecedencia || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, antecedencia: e.target.value })}
                    placeholder="Ex: 48 horas, 5 dias..."
                    className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Disponibilidade</label>
                  <div className="flex flex-wrap gap-2">
                    {DISPONIBILIDADE_OPCOES.map((disp) => {
                      const active = editingProduct.disponibilidade === disp;
                      return (
                        <button key={disp} type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, disponibilidade: disp })}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                            active ? "bg-primary-500 text-background-50" : "bg-background-100 text-foreground-700 border border-background-200/70 hover:border-primary-300/50"
                          }`}>
                          {active && <i className="ri-check-line mr-1 w-3 h-3 inline-flex items-center justify-center" />}
                          {disp}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Estado</label>
                  <div className="flex flex-wrap gap-2">
                    {ESTADO_OPCOES.map((est) => {
                      const active = editingProduct.estado === est.value;
                      return (
                        <button key={est.value} type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, estado: est.value })}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                            active ? "bg-primary-500 text-background-50" : "bg-background-100 text-foreground-700 border border-background-200/70 hover:border-primary-300/50"
                          }`}>
                          {active && <i className="ri-check-line mr-1 w-3 h-3 inline-flex items-center justify-center" />}
                          {est.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Ordem</label>
                  <input type="number" min="0"
                    value={editingProduct.sort_order ?? 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sort_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                </div>
                <div className="flex flex-col gap-3 justify-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingProduct.assinatura_chef ?? false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, assinatura_chef: e.target.checked })}
                      className="w-4 h-4 rounded border-background-300 text-primary-500 focus:ring-primary-400 cursor-pointer" />
                    <span className="text-sm text-foreground-800 font-medium">Assinatura do Chef</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingProduct.b2b ?? false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, b2b: e.target.checked })}
                      className="w-4 h-4 rounded border-background-300 text-primary-500 focus:ring-primary-400 cursor-pointer" />
                    <span className="text-sm text-foreground-800 font-medium">B2B (Para Empresas)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingProduct.fora_catalogo ?? false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fora_catalogo: e.target.checked })}
                      className="w-4 h-4 rounded border-background-300 text-foreground-400 focus:ring-foreground-400 cursor-pointer" />
                    <span className="text-sm text-foreground-800 font-medium">Fora do Catálogo</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-800 mb-2">Categorias B2B</label>
                <div className="flex flex-wrap gap-2">
                  {TODAS_CATEGORIAS.map((cat) => {
                    const active = (editingProduct.categories || []).includes(cat);
                    return (
                      <button key={cat} type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          active ? "bg-primary-500 text-background-50" : "bg-background-100 text-foreground-700 border border-background-200/70 hover:border-primary-300/50"
                        }`}>
                        {active && <i className="ri-check-line mr-1 w-3 h-3 inline-flex items-center justify-center" />}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-800 mb-2">Variações</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={novaVariacaoNome}
                    onChange={(e) => setNovaVariacaoNome(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVariacao(); } }}
                    placeholder="Nome (ex: 26 cm 12 fatias)"
                    className="flex-1 px-4 py-2 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                  <input type="text" value={novaVariacaoPreco}
                    onChange={(e) => setNovaVariacaoPreco(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVariacao(); } }}
                    placeholder="Preço (€)"
                    className="w-28 px-4 py-2 rounded-lg border border-background-200/70 bg-background-100 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all" />
                  <button type="button" onClick={addVariacao}
                    className="px-3 py-2 rounded-lg bg-secondary-500 hover:bg-secondary-600 text-background-50 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors">
                    <i className="ri-add-line w-4 h-4 flex items-center justify-center" />
                  </button>
                </div>
                {(editingProduct.variacoes || []).length > 0 && (
                  <div className="space-y-2">
                    {(editingProduct.variacoes || []).map((v, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background-100 border border-background-200/70">
                        <span className="flex-1 text-sm text-foreground-900">{v.nome}</span>
                        <span className="text-sm font-medium text-foreground-700">{v.preco}</span>
                        <button type="button" onClick={() => removeVariacao(idx)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary-100 cursor-pointer transition-colors">
                          <i className="ri-close-line text-primary-500 w-4 h-4 flex items-center justify-center" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {saveError && (
                <div className="rounded-lg bg-primary-50 border border-primary-200 p-3 flex items-start gap-2">
                  <i className="ri-error-warning-line text-primary-600 mt-0.5 w-4 h-4 flex items-center justify-center shrink-0" />
                  <p className="text-sm text-primary-800">{saveError}</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-background-50 z-10 p-6 border-t border-background-200/70 flex items-center justify-between gap-3">
              <button type="button" onClick={closeEditor}
                className="px-4 py-2.5 rounded-full text-sm font-medium text-foreground-700 hover:bg-background-200/60 cursor-pointer whitespace-nowrap transition-colors">
                Cancelar
              </button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors">
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
            </div>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm bg-background-50 rounded-2xl shadow-lg p-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mx-auto mb-4">
              <i className="ri-error-warning-line text-xl w-5 h-5 flex items-center justify-center" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground-950 text-center mb-2">Confirmar eliminação</h3>
            <p className="text-sm text-foreground-600 text-center mb-6">
              Esta ação é irreversível. O produto será removido permanentemente do catálogo.
            </p>
            {saveError && (
              <div className="rounded-lg bg-primary-50 border border-primary-200 p-3 mb-4 flex items-start gap-2">
                <p className="text-sm text-primary-800">{saveError}</p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <button type="button"
                onClick={() => { setDeleteConfirm(null); setSaveError(""); }}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-foreground-700 border border-background-200/70 hover:bg-background-200/60 cursor-pointer whitespace-nowrap transition-colors">
                Cancelar
              </button>
              <button type="button" onClick={handleDelete} disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors">
                {deleting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                    A eliminar...
                  </>
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}