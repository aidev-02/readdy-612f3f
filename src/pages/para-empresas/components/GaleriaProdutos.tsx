import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import ProdutoB2BModal from "./ProdutoB2BModal";
import OrcamentoModal from "./OrcamentoModal";

interface Variacao {
  nome: string;
  preco: string;
  precoNumero: number;
}

interface GalleryProduct {
  id: number;
  name: string;
  description: string;
  descricao_longa?: string;
  image_url: string;
  imagem_thumb?: string;
  price: number | null;
  categories: string[];
  sort_order: number;
  estado: string;
  b2b: boolean;
  slug?: string;
  familia?: string;
  familia_slug?: string;
  formato?: string;
  tag?: string;
  dica_chef?: string;
  alergeneos?: string[];
  ingredientes?: string[];
  conservacao?: string;
  validade?: string;
  antecedencia?: string;
  disponibilidade?: string;
  assinatura_chef?: boolean;
  variacoes?: Variacao[];
  image_fit?: string;
  image_position?: string;
  image_scale?: number;
}

const filtrosGaleria = [
  "Todos",
  "Restaurantes",
  "Hotéis",
];

export default function GaleriaProdutos() {
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");
  const [produtos, setProdutos] = useState<GalleryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<GalleryProduct | null>(null);
  const [showOrcamento, setShowOrcamento] = useState(false);
  const [orcamentoProduto, setOrcamentoProduto] = useState<GalleryProduct | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data, error: fetchError } = await supabase
        .from("b2b_gallery_products")
        .select("id, name, description, descricao_longa, image_url, imagem_thumb, price, categories, sort_order, estado, b2b, slug, familia, familia_slug, formato, tag, dica_chef, alergeneos, ingredientes, conservacao, validade, antecedencia, disponibilidade, assinatura_chef, variacoes, image_fit, image_position, image_scale")
        .eq("estado", "publicado")
        .eq("b2b", true)
        .order("sort_order", { ascending: true });

      if (fetchError) {
        console.error("Erro ao buscar produtos B2B:", fetchError);
        throw fetchError;
      }
      setProdutos((data as GalleryProduct[]) || []);
    } catch (err: any) {
      console.error("Falha no fetch de produtos:", err);
      setError(err?.message || "Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Refrescar ao voltar a focar a página
  useEffect(() => {
    const handleFocus = () => fetchProducts();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchProducts]);

  const produtosB2B = produtos.filter((p) =>
    p.categories?.some((c) => c === "Restaurantes" || c === "Hotéis")
  );

  const produtosFiltrados = (
    filtroAtivo === "Todos"
      ? produtosB2B
      : produtosB2B.filter((p) => p.categories?.includes(filtroAtivo))
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="bg-background-100 py-20 md:py-24 texture-paper">
      <div className="w-full px-4 md:px-10 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-600 mb-4">
            <span className="w-8 h-px bg-primary-400" />
            Produtos disponíveis
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight mb-4">
            Criações que podem integrar a sua oferta
          </h2>
          <p className="text-base text-foreground-600">
            Cheesecakes, tiramisú, cremeux, tartes, bolos, sobremesas individuais, sazonais e criações personalizadas.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filtrosGaleria.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFiltroAtivo(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filtroAtivo === f
                  ? "bg-primary-500 text-background-50"
                  : "bg-background-50 text-foreground-700 border border-background-200/70 hover:border-primary-300/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-16">
            <i className="ri-loader-4-line animate-spin text-2xl w-6 h-6 flex items-center justify-center mx-auto text-primary-500 mb-3" />
            <p className="text-sm text-foreground-500">A carregar produtos...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-10">
            <p className="text-sm text-foreground-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {produtosFiltrados.map((p) => (
              <div
                key={p.id}
                className="group rounded-xl bg-background-50 border border-background-200/70 overflow-hidden hover:border-secondary-300/60 transition-colors flex flex-col h-full"
              >
                {/* Imagem com badges */}
                <div
                  className="relative h-56 overflow-hidden cursor-pointer flex-shrink-0"
                  onClick={() => setSelectedProduct(p)}
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                      style={{
                        objectFit: (p.image_fit || "cover") as any,
                        objectPosition: p.image_position || "center",
                        transform: `scale(${p.image_scale != null ? Number(p.image_scale) : 1.0})`,
                        transformOrigin: "center center",
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-background-200/60 flex items-center justify-center">
                      <i className="ri-image-line text-3xl w-8 h-8 flex items-center justify-center text-foreground-400" />
                    </div>
                  )}

                  {/* Badge POR ENCOMENDA — topo esquerdo */}
                  {p.price == null && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-accent-100 text-accent-800">
                      Por encomenda
                    </span>
                  )}

                  {/* Badge Chef Manuel Brito — fundo esquerdo */}
                  {p.assinatura_chef && (
                    <span className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-medium bg-background-50/90 text-foreground-800 backdrop-blur-sm flex items-center gap-1.5">
                      <i className="ri-restaurant-line w-3.5 h-3.5 flex items-center justify-center" />
                      Chef Manuel Brito
                    </span>
                  )}
                </div>

                {/* Corpo do card */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Tag categoria acima do título */}
                  {p.tag && (
                    <span className="text-xs uppercase tracking-[0.2em] text-primary-600 font-medium mb-1.5 block">
                      {p.tag}
                    </span>
                  )}

                  <h3 className="font-heading text-lg font-bold text-foreground-950 mb-2 leading-snug">
                    {p.name}
                  </h3>

                  <p className="text-sm text-foreground-600 leading-relaxed mb-3">
                    {p.description}
                  </p>

                  {/* Alergênicos — estilo outline */}
                  {p.alergeneos && p.alergeneos.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.alergeneos.map((a) => (
                        <span
                          key={a}
                          className="px-2 py-0.5 rounded border border-background-300/60 text-[11px] text-foreground-600 uppercase tracking-wide"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Linha inferior: botão — sempre no fundo direito */}
                  <div className="flex items-end justify-end pt-3 border-t border-background-200/70 mt-auto">

                    <button
                      type="button"
                      onClick={() => {
                        setOrcamentoProduto(p);
                        setShowOrcamento(true);
                      }}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-foreground-950 text-background-50 text-[11px] font-semibold uppercase tracking-wider hover:bg-foreground-800 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Pedir orçamento
                      <i className="ri-arrow-right-line w-3.5 h-3.5 flex items-center justify-center" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && produtosFiltrados.length === 0 && (
          <p className="text-center text-foreground-500 py-10">
            Nenhum produto encontrado para este filtro.
          </p>
        )}
      </div>

      {selectedProduct && (
        <ProdutoB2BModal
          produto={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showOrcamento && (
        <OrcamentoModal
          initialProduct={
            orcamentoProduto
              ? {
                  id: orcamentoProduto.id,
                  name: orcamentoProduto.name,
                  description: orcamentoProduto.description,
                  image_url: orcamentoProduto.image_url,
                }
              : undefined
          }
          onClose={() => {
            setShowOrcamento(false);
            setOrcamentoProduto(null);
          }}
        />
      )}
    </section>
  );
}