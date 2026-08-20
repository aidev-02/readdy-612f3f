import { useMemo } from "react";
import ProdutoCard from "./ProdutoCard";
import type { Produto } from "@/mocks/catalogo";

interface GridProdutosProps {
  filtrados: Produto[];
  filtro: string;
  loading?: boolean;
  error?: string;
}

export default function GridProdutos({ filtrados, filtro, loading, error }: GridProdutosProps) {
  const nomeFamilia = useMemo(() => {
    if (filtro === "todas") return "Todas as criações";
    const map: Record<string, string> = {
      cheesecakes: "Cheesecakes",
      cremeux: "Cremeux",
      troncos: "Troncos de Natal",
      "ovos-pascoa": "Ovos de Páscoa de Colher",
      "bolos-eventos": "Bolos & Eventos",
      "paves-tartes": "Pavés, Tartes & Entremets",
      profissionais: "Para Profissionais",
    };
    return map[filtro] ?? "";
  }, [filtro]);

  if (loading) {
    return (
      <section className="w-full px-4 md:px-10 py-8 md:py-12">
        <div className="text-center py-16">
          <i className="ri-loader-4-line animate-spin text-2xl w-6 h-6 flex items-center justify-center mx-auto text-primary-500 mb-3" />
          <p className="text-sm text-foreground-500">A carregar catálogo...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-4 md:px-10 py-8 md:py-12">
        <div className="text-center py-10">
          <p className="text-sm text-foreground-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 md:px-10 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl md:text-3xl text-foreground-950 font-bold">
          {nomeFamilia}
        </h2>
        <span className="text-sm text-foreground-600 font-label">
          {filtrados.length} {filtrados.length === 1 ? "criação" : "criações"}
        </span>
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-background-100 text-foreground-400">
            <i className="ri-search-line text-2xl w-6 h-6 flex items-center justify-center" />
          </div>
          <p className="text-foreground-600 font-medium">Nenhuma criação nesta família de momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6" data-product-shop>
          {filtrados.map((p) => (
            <ProdutoCard key={p.id} produto={p} />
          ))}
        </div>
      )}
    </section>
  );
}