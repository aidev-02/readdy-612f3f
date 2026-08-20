import { testemunhos } from "@/mocks/home";

export default function Testemunhos() {
  return (
    <section className="bg-background-100">
      <div className="w-full px-4 md:px-10 py-20 md:py-28">
        <div className="max-w-2xl mb-14">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-700 mb-4">
            <span className="w-8 h-px bg-primary-500" />
            Quem já provou
          </span>
          <h4 className="font-heading text-4xl md:text-5xl text-foreground-950 font-bold leading-tight">
            <a href="#depoimentos" className="cursor-pointer">
              Palavras de quem volta sempre.
            </a>
          </h4>
        </div>

        <div id="depoimentos" className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {testemunhos.map((t) => (
            <figure
              key={t.nome}
              className="bg-background-50 border border-background-200/70 rounded-2xl p-7 flex flex-col"
            >
              <div className="flex items-center gap-1 text-secondary-500 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className="ri-star-fill w-4 h-4 flex items-center justify-center" />
                ))}
              </div>
              <blockquote className="text-base text-foreground-800 leading-relaxed">
                “{t.texto}”
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-background-200 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.nome}
                  className="w-11 h-11 rounded-full object-cover object-top"
                />
                <div>
                  <div className="font-semibold text-foreground-950 text-sm">{t.nome}</div>
                  <div className="text-xs text-foreground-600 mt-0.5">{t.contexto}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}