import { Link } from "react-router-dom";
import type { Produto } from "@/mocks/catalogo";

interface ProdutosRelacionadosProps {
  produtos: Produto[];
  produtoAtual: Produto;
}

export default function ProdutosRelacionados({
  produtos,
  produtoAtual,
}: ProdutosRelacionadosProps) {
  const relacionados = produtos
    .filter(
      (p) =>
        p.familiaSlug === produtoAtual.familiaSlug &&
        p.slug !== produtoAtual.slug &&
        p.estado === "publicado",
    )
    .slice(0, 4);

  if (relacionados.length === 0) return null;

  return (
    <section className="bg-background-100">
      <div className="w-full px-4 md:px-10 py-16 md:py-20">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-700 mb-3">
            <span className="w-8 h-px bg-primary-500" />
            Da mesma família
          </span>
          <h4 className="font-heading text-3xl md:text-4xl text-foreground-950 font-bold leading-tight">
            <span>Também pode gostar.</span>
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6" data-product-shop>
          {relacionados.map((p) => (
            <article
              key={p.id}
              className="group bg-background-50 rounded-2xl overflow-hidden border border-background-200/70 hover:border-primary-300 transition-colors flex flex-col"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img
                  src={p.imagemThumb}
                  alt={p.nome}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary-500 text-primary-950 text-xs font-semibold uppercase tracking-wider font-label">
                  {p.tag}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs uppercase tracking-[0.2em] font-label text-primary-600">
                  {p.familia}
                </span>
                <h5 className="font-heading text-lg text-foreground-950 font-semibold mt-1 leading-tight">
                  {p.nome}
                </h5>
                <p className="text-sm text-foreground-600 mt-1 line-clamp-2">{p.descricao}</p>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="font-heading text-xl text-primary-700 font-bold">
                    {p.preco ?? "Sob consulta"}
                  </span>
                  <Link
                    to={`/produto/${p.slug}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-foreground-950 hover:bg-primary-500 text-background-50 text-xs font-semibold uppercase tracking-wider font-label transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Ver
                    <i className="ri-arrow-right-line w-3.5 h-3.5 flex items-center justify-center" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}