import { Link } from "react-router-dom";

export default function Sazonal() {
  return (
    <section className="bg-background-50">
      <div className="w-full px-4 md:px-10 py-16 md:py-20">
        <div className="relative rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://readdy.ai/api/search-image?query=Elegant%20christmas%20yule%20log%20cake%20bache%20de%20noel%20with%20ruby%20chocolate%20glaze%20and%20gold%20leaf%20decoration%20on%20rustic%20wood%20surface%20with%20pine%20branches%20and%20warm%20candle%20light%2C%20cinematic%20holiday%20mood%2C%20warm%20cream%20and%20terracotta%20color%20palette%2C%20artisanal%20portuguese%20patisserie%20photography%2C%20soft%20focus%20background&width=2000&height=1000&seq=sazonal-natal&orientation=landscape')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-950/75 to-primary-950/30" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 md:p-16 min-h-[440px]">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-500/25 border border-secondary-400/40 text-secondary-100 text-xs uppercase tracking-[0.24em] font-label">
                <i className="ri-sparkling-2-line w-3 h-3 flex items-center justify-center" />
                Edição limitada
              </span>
              <h4 className="mt-5 font-heading text-4xl md:text-5xl font-bold text-background-50 leading-tight">
                <a href="/catalogo?familia=troncos" className="cursor-pointer">
                  Troncos de Natal 2026
                </a>
              </h4>
              <p className="mt-5 text-base md:text-lg text-background-100/90 leading-relaxed max-w-xl">
                Três criações sazonais: Ruby com frutos vermelhos, Chocolate intenso e
                Maracujá com folha dourada. Encomendas abrem a 15 de novembro, com
                mínimo de 5 dias de antecedência.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
                {[
                  { n: "15 NOV", l: "Início encomendas" },
                  { n: "5 dias", l: "Antecedência mínima" },
                  { n: "3", l: "Sabores exclusivos" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="px-3 py-3 rounded-xl bg-background-50/10 border border-background-50/15 text-center"
                  >
                    <div className="font-heading text-lg text-secondary-300 font-bold">{s.n}</div>
                    <div className="text-[10px] uppercase tracking-wider font-label text-background-100/80 mt-1">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/catalogo?familia=troncos"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-secondary-500 hover:bg-secondary-400 text-primary-950 text-sm font-semibold cursor-pointer whitespace-nowrap"
              >
                Reservar tronco
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}