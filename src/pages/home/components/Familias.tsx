import { Link } from "react-router-dom";
import { familias } from "@/mocks/home";

export default function Familias() {
  return (
    <section id="familias" className="bg-background-50">
      <div className="w-full px-4 md:px-10 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-700 mb-4">
              <span className="w-8 h-px bg-primary-500" />
              O nosso catálogo
            </span>
            <h4 className="font-heading text-4xl md:text-5xl text-foreground-950 font-bold leading-tight">
              <a href="#familias" className="cursor-pointer">
                Famílias que contam histórias.
              </a>
            </h4>
            <p className="mt-4 text-base md:text-lg text-foreground-700 leading-relaxed">
              De cheesecakes cremosos a troncos sazonais, cada família nasce da técnica
              clássica trabalhada pelo Chef Manuel Brito e adaptada ao gosto português.
            </p>
          </div>
          <Link
            to="/catalogo"
            className="self-start md:self-end inline-flex items-center gap-2 px-6 py-3 rounded-full border border-foreground-950/15 hover:bg-foreground-950 hover:text-background-50 text-foreground-950 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            Ver catálogo completo
            <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" data-product-shop>
          {familias.map((f, idx) => (
            <Link
              key={f.id}
              to={`/catalogo?familia=${f.id}`}
              className={`group relative overflow-hidden rounded-2xl bg-background-100 border border-background-200/70 cursor-pointer transition-transform hover:-translate-y-1 duration-300 ${
                idx === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <div className={`relative w-full overflow-hidden ${idx === 0 ? "h-[520px] lg:h-[640px]" : "h-[320px]"}`}>
                <img
                  src={f.imagem}
                  alt={f.nome}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                    f.id === "ovos-pascoa" ? "object-[center_5%]" : "object-center"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-950/25 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-50/95 text-primary-700 text-xs font-semibold">
                  <i className={`${f.icon} w-3.5 h-3.5 flex items-center justify-center`} />
                  {f.count} criações
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h5 className="font-heading text-2xl md:text-3xl text-background-50 font-bold mb-2">
                    {f.nome}
                  </h5>
                  <p className="text-sm text-background-100/90 leading-relaxed max-w-md">
                    {f.descricao}
                  </p>
                  <div className="mt-4 pt-4 border-t border-background-50/20 flex items-center justify-between gap-3">
                    <span className="text-xs text-secondary-200 uppercase tracking-wider font-label">
                      {f.destaque}
                    </span>
                    <span className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary-500 text-primary-950 group-hover:bg-background-50 transition-colors">
                      <i className="ri-arrow-right-up-line w-4 h-4 flex items-center justify-center" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}