import { Link } from "react-router-dom";
import { destaques } from "@/mocks/home";

export default function Destaques() {
  return (
    <section className="bg-background-100">
      <div className="w-full px-4 md:px-10 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-700 mb-4">
              <span className="w-8 h-px bg-primary-500" />
              Destaques da semana
            </span>
            <h4 className="font-heading text-4xl md:text-5xl text-foreground-950 font-bold leading-tight">
              <a href="/catalogo" className="cursor-pointer">
                Escolhas do Chef.
              </a>
            </h4>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-background-50 border border-background-200 hover:bg-primary-500 hover:text-background-50 transition-colors cursor-pointer"
              aria-label="Anterior"
            >
              <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center" />
            </button>
            <button
              type="button"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-background-50 border border-background-200 hover:bg-primary-500 hover:text-background-50 transition-colors cursor-pointer"
              aria-label="Próximo"
            >
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6" data-product-shop>
          {destaques.map((p) => (
            <article
              key={p.id}
              className="group bg-background-50 rounded-2xl overflow-hidden border border-background-200/70 hover:border-primary-300 transition-colors"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img
                  src={p.imagem}
                  alt={p.nome}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary-500 text-primary-950 text-xs font-semibold uppercase tracking-wider font-label">
                  {p.tag}
                </span>
                <button
                  type="button"
                  className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-background-50/90 text-foreground-800 hover:bg-primary-500 hover:text-background-50 transition-colors cursor-pointer"
                  aria-label="Guardar"
                >
                  <i className="ri-heart-line w-4 h-4 flex items-center justify-center" />
                </button>
              </div>
              <div className="p-5">
                <span className="text-xs uppercase tracking-[0.2em] font-label text-primary-600">
                  {p.familia}
                </span>
                <h5 className="font-heading text-xl text-foreground-950 font-semibold mt-1.5 leading-tight">
                  {p.nome}
                </h5>
                <p className="text-sm text-foreground-600 mt-1">{p.formato}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-heading text-2xl text-primary-700 font-bold">
                    {p.preco}
                  </span>
                  <Link
                    to={`/produto/${p.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground-950 hover:bg-primary-500 text-background-50 text-xs font-semibold uppercase tracking-wider font-label transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Encomendar
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