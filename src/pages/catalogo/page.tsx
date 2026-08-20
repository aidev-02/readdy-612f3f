import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import CatalogoHero from "./components/CatalogoHero";
import Filtros from "./components/Filtros";
import GridProdutos from "./components/GridProdutos";
import type { Produto } from "@/mocks/catalogo";

const dicasDoChefOpcoes = [
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

function mapDbToProduto(row: any): Produto {
  const variacoes = Array.isArray(row.variacoes)
    ? row.variacoes.map((v: any) => ({
        nome: v.nome || "",
        preco: v.preco || "",
        precoNumero: Number(v.precoNumero) || 0,
      }))
    : [];

  const hasPrice = row.price != null;

  return {
    id: String(row.id),
    slug: row.slug || "",
    nome: row.name || "",
    familia: row.familia || "",
    familiaSlug: row.familia_slug || "",
    descricao: row.description || "",
    descricaoLonga: row.descricao_longa || undefined,
    formato: row.formato || "",
    preco: hasPrice ? `${Number(row.price).toFixed(2).replace(".", ",")} €` : null,
    precoNumero: hasPrice ? Number(row.price) : null,
    tag: row.tag || "",
    dicaChef: row.dica_chef || row.tag || "",
    imagem: row.image_url || "",
    imagemThumb: row.imagem_thumb || row.image_url || "",
    imageFit: row.image_fit || "cover",
    imagePosition: row.image_position || "center",
    imageScale: row.image_scale != null ? Number(row.image_scale) : 1.0,
    alergeneos: Array.isArray(row.alergeneos) ? row.alergeneos : [],
    ingredientes: Array.isArray(row.ingredientes) ? row.ingredientes : undefined,
    conservacao: row.conservacao || undefined,
    validade: row.validade || undefined,
    antecedencia: row.antecedencia || "",
    disponibilidade: row.disponibilidade || "",
    estado: row.estado || "publicado",
    b2b: row.b2b === true,
    assinaturaChef: row.assinatura_chef === true,
    categoriasB2B: Array.isArray(row.categories) ? row.categories : undefined,
    variacoes,
  };
}

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const familiaParam = searchParams.get("familia") ?? "todas";
  const dicaParam = searchParams.get("dica") ?? "todas";
  const [filtro, setFiltro] = useState(familiaParam);
  const [dicaFiltro, setDicaFiltro] = useState(dicaParam);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("b2b_gallery_products")
        .select("*")
        .eq("estado", "publicado")
        .not("familia_slug", "is", null)
        .order("sort_order", { ascending: true });

      if (fetchError) throw fetchError;
      const mapped = (data || []).map(mapDbToProduto);
      setProdutos(mapped);
    } catch (err: any) {
      setError("Erro ao carregar o catálogo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) {
        fetchProducts();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchProducts]);

  useEffect(() => {
    setFiltro(familiaParam);
  }, [familiaParam]);

  useEffect(() => {
    setDicaFiltro(dicaParam);
  }, [dicaParam]);

  const handleFiltroChange = (slug: string) => {
    setFiltro(slug);
    const params: Record<string, string> = {};
    if (slug !== "todas") params.familia = slug;
    if (dicaFiltro !== "todas") params.dica = dicaFiltro;
    setSearchParams(params);
  };

  const handleDicaChange = (slug: string) => {
    setDicaFiltro(slug);
    const params: Record<string, string> = {};
    if (filtro !== "todas") params.familia = filtro;
    if (slug !== "todas") params.dica = slug;
    setSearchParams(params);
  };

  const filtrados = useMemo(() => {
    let result = produtos;
    if (filtro !== "todas") {
      result = result.filter((p) => p.familiaSlug === filtro);
    }
    if (dicaFiltro !== "todas") {
      result = result.filter((p) => p.dicaChef.toUpperCase() === dicaFiltro);
    }
    return result;
  }, [filtro, dicaFiltro, produtos]);

  const contagens = useMemo(() => {
    const map: Record<string, number> = { todas: produtos.length };
    const slugs = [
      "cheesecakes", "cremeux", "troncos", "ovos-pascoa",
      "bolos-eventos", "paves-tartes", "profissionais",
    ];
    slugs.forEach((s) => {
      map[s] = produtos.filter((p) => p.familiaSlug === s).length;
    });
    return map;
  }, [produtos]);

  const dicas = useMemo(() => {
    return dicasDoChefOpcoes
      .map((dica) => ({
        slug: dica,
        nome: dica.charAt(0).toUpperCase() + dica.slice(1).toLowerCase(),
        count: produtos.filter((p) => p.dicaChef.toUpperCase() === dica).length,
      }))
      .filter((d) => d.count > 0);
  }, [produtos]);

  const dicasComTodas = useMemo(() => {
    const total = dicas.reduce((sum, d) => sum + d.count, 0);
    return [
      { slug: "todas", nome: "Todas", count: total },
      ...dicas,
    ];
  }, [dicas]);

  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <Header />
      <CatalogoHero />
      <Filtros
        ativo={filtro}
        onChange={handleFiltroChange}
        contagens={contagens}
        dicaAtivo={dicaFiltro}
        onDicaChange={handleDicaChange}
        dicas={dicasComTodas}
      />
      <GridProdutos filtrados={filtrados} filtro={filtro} loading={loading} error={error} />
      <Footer />
    </main>
  );
}