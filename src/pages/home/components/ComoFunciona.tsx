import { passos } from "@/mocks/home";

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-background-50">
      <div className="w-full px-4 md:px-10 py-20 md:py-28">
        <div className="max-w-2xl mb-14">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-700 mb-4">
            <span className="w-8 h-px bg-primary-500" />
            Como funciona
          </span>
          <h4 className="font-heading text-4xl md:text-5xl text-foreground-950 font-bold leading-tight">
            <a href="#como-funciona" className="cursor-pointer">
              Quatro passos, zero enganos.
            </a>
          </h4>
          <p className="mt-4 text-base md:text-lg text-foreground-700 leading-relaxed">
            Um fluxo simples que evita pedidos incompletos vindos de WhatsApp,
            Instagram ou telefone. Rápido no telemóvel.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {passos.map((p, idx) => (
            <div
              key={p.numero}
              className="relative bg-background-100 border border-background-200/70 rounded-2xl p-6 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-heading text-5xl text-primary-500/25 font-bold leading-none">
                  {p.numero}
                </span>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-500 text-background-50">
                  <i className={`${p.icon} text-xl w-6 h-6 flex items-center justify-center`} />
                </div>
              </div>
              <h5 className="font-heading text-xl text-foreground-950 font-semibold leading-tight">
                {p.titulo}
              </h5>
              <p className="text-sm text-foreground-700 mt-2 leading-relaxed">{p.texto}</p>
              {idx < passos.length - 1 && (
                <span className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 items-center justify-center rounded-full bg-secondary-500 text-primary-950 text-xs">
                  <i className="ri-arrow-right-s-line w-3.5 h-3.5 flex items-center justify-center" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}