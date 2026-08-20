import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Produto } from "@/mocks/catalogo";
import AddToCartModal from "./AddToCartModal";
import type { AddToCartPayload } from "../hooks/useCart";

interface ProductCatalogProps {
  onAddToCart: (payload: AddToCartPayload) => void;
}

interface FamiliaInfo {
  slug: string;
  nome: string;
}

interface B2bRow {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  descricao_longa: string | null;
  image_url: string | null;
  imagem_thumb: string | null;
  price: number | null;
  formato: string | null;
  tag: string | null;
  dica_chef: string | null;
  familia: string | null;
  familia_slug: string | null;
  alergeneos: string[] | null;
  ingredientes: string[] | null;
  conservacao: string | null;
  validade: string | null;
  antecedencia: string | null;
  disponibilidade: string | null;
  estado: string;
  b2b: boolean;
  assinatura_chef: boolean;
  fora_catalogo: boolean;
  categories: string[] | null;
  variacoes: { nome: string; preco: string; precoNumero: number }[] | null;
  image_fit: string | null;
  image_position: string | null;
  image_scale: number | null;
}

function mapRowToProduto(row: B2bRow): Produto {
  const precoNumero = row.price != null ? Number(row.price) : null;
  const preco =
    precoNumero != null
      ? `${precoNumero.toFixed(2).replace(".", ",")} €`
      : null;

  return {
    id: String(row.id),
    slug: row.slug || "",
    nome: row.name,
    familia: row.familia || "Sem categoria",
    familiaSlug: row.familia_slug || "sem-categoria",
    descricao: row.description || "",
    descricaoLonga: row.descricao_longa || undefined,
    formato: row.formato || "",
    preco,
    precoNumero,
    tag: row.dica_chef || row.tag || "",
    dicaChef: row.dica_chef || undefined,
    imagem: row.image_url || "",
    imagemThumb: row.imagem_thumb || row.image_url || "",
    imageFit: row.image_fit || undefined,
    imagePosition: row.image_position || undefined,
    imageScale: row.image_scale != null ? Number(row.image_scale) : undefined,
    alergeneos: row.alergeneos || [],
    ingredientes: row.ingredientes || [],
    conservacao: row.conservacao || undefined,
    validade: row.validade || undefined,
    antecedencia: row.antecedencia || "",
    disponibilidade: row.disponibilidade || "",
    estado: (row.estado as Produto["estado"]) || "publicado",
    b2b: row.b2b || false,
    assinaturaChef: row.assinatura_chef || false,
    categoriasB2B: row.categories || [],
    variacoes: (row.variacoes || []).map((v) => ({
      nome: v.nome || "",
      preco: v.preco || "",
      precoNumero: v.precoNumero != null ? Number(v.precoNumero) : null,
    })),
  };
}

export default function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  const [familiaFiltro, setFamiliaFiltro] = useState("todas");
  const [modalProduto, setModalProduto] = useState<Produto | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchProdutos() {
      setLoading(true);
      setErro("");
      try {
        const { data, error } = await supabase
          .from("b2b_gallery_products")
          .select("*")
          .eq("estado", "publicado")
          .eq("fora_catalogo", false)
          .overlaps("categories", ["Individual", "Para partilhar", "Eventos"])
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true });

        if (error) throw error;

        if (!cancelled && data) {
          const mapped = (data as B2bRow[]).map(mapRowToProduto);
          setProdutos(mapped);
        }
      } catch (err: any) {
        if (!cancelled) {
          setErro(err?.message || "Erro ao carregar produtos.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProdutos();
    return () => {
      cancelled = true;
    };
  }, []);

  const familias: FamiliaInfo[] = useMemo(() => {
    const seen = new Map<string, FamiliaInfo>();
    produtos.forEach((p) => {
      if (p.familiaSlug && !seen.has(p.familiaSlug)) {
        seen.set(p.familiaSlug, { slug: p.familiaSlug, nome: p.familia });
      }
    });
    return Array.from(seen.values());
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    if (familiaFiltro === "todas") return produtos;
    return produtos.filter((p) => p.familiaSlug === familiaFiltro);
  }, [familiaFiltro, produtos]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-64 bg-background-200/60 rounded-lg animate-pulse mb-1" />
          <div className="h-4 w-80 bg-background-200/60 rounded animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 bg-background-200/60 rounded-full animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-background-200/70 bg-background-50 overflow-hidden"
            >
              <div className="aspect-[4/3] bg-background-200/60 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-background-200/60 rounded animate-pulse" />
                <div className="h-3 w-full bg-background-200/60 rounded animate-pulse" />
                <div className="flex items-center justify-between mt-3">
                  <div className="h-4 w-16 bg-background-200/60 rounded animate-pulse" />
                  <div className="h-9 w-40 bg-background-200/60 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-4">
            <i className="ri-error-warning-line text-2xl text-primary-500 w-8 h-8 flex items-center justify-center" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground-900 mb-2">
            Erro ao carregar produtos
          </h3>
          <p className="text-sm text-foreground-500 mb-6 max-w-md mx-auto">{erro}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full bg-primary-500 text-background-50 text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-full bg-background-100 flex items-center justify-center mb-4">
            <i className="ri-cake-3-line text-2xl text-foreground-300 w-8 h-8 flex items-center justify-center" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground-900 mb-2">
            Nenhum produto disponível
          </h3>
          <p className="text-sm text-foreground-500">
            Volta mais tarde para ver as novidades do catálogo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950 mb-1">
          Escolhe as tuas sobremesas
        </h2>
        <p className="text-foreground-600 text-sm">
          Adiciona os produtos ao pedido e depois fecha a encomenda.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFamiliaFiltro("todas")}
          className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors ${
            familiaFiltro === "todas"
              ? "bg-primary-500 text-background-50"
              : "bg-background-100 text-foreground-700 hover:bg-background-200"
          }`}
        >
          Todas
        </button>
        {familias.map((f) => (
          <button
            key={f.slug}
            type="button"
            onClick={() => setFamiliaFiltro(f.slug)}
            className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors ${
              familiaFiltro === f.slug
                ? "bg-primary-500 text-background-50"
                : "bg-background-100 text-foreground-700 hover:bg-background-200"
            }`}
          >
            {f.nome}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {produtosFiltrados.map((p: Produto) => (
          <div
            key={p.id}
            className="group rounded-xl border border-background-200/70 bg-background-50 overflow-hidden hover:border-background-300/80 transition-colors"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-background-100">
              <img
                src={p.imagem}
                alt={p.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {p.tag && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background-50/90 backdrop-blur-sm text-xs font-semibold text-foreground-800 whitespace-nowrap">
                  {p.tag}
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-heading text-sm font-semibold text-foreground-900 leading-snug line-clamp-2">
                {p.nome}
              </h3>
              <p className="text-xs text-foreground-500 mt-1 line-clamp-2">{p.descricao}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-bold text-primary-600">
                  {p.preco || "Sob consulta"}
                </span>
                <button
                  type="button"
                  onClick={() => setModalProduto(p)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-500 text-background-50 text-xs font-semibold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line w-3.5 h-3.5 flex items-center justify-center" />
                  Adicionar ao pedido
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalProduto && (
        <AddToCartModal
          produto={modalProduto}
          onConfirm={(payload) => {
            onAddToCart(payload);
            setModalProduto(null);
          }}
          onClose={() => setModalProduto(null)}
        />
      )}
    </div>
  );
}