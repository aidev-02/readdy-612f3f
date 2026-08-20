export default function Degustacao() {
  return (
    <section id="degustacao" className="bg-secondary-100/50 py-20 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-600 mb-4">
              <span className="w-8 h-px bg-primary-400" />
              Degustação e seleção
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight mb-5">
              Conheça os produtos antes de definir a parceria
            </h2>
            <p className="text-base text-foreground-600 leading-relaxed mb-5">
              A Manger.pt pode organizar uma apresentação ou prova de sobremesas previamente selecionadas.
            </p>
            <p className="text-base text-foreground-600 leading-relaxed mb-6">
              A experiência permite avaliar sabor, textura, apresentação, adequação ao público, facilidade de serviço, potencial de integração na carta e relação entre custo e preço de venda. Com base no feedback, a seleção pode ser ajustada antes do início do fornecimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#formulario-comercial"
                className="px-6 py-3.5 rounded-full bg-primary-500 text-background-50 text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-2 justify-center"
              >
                <i className="ri-calendar-event-line w-4 h-4 flex items-center justify-center" />
                Agendar uma degustação
              </a>
              <a
                href="https://wa.me/351000000000"
                rel="nofollow"
                className="px-6 py-3.5 rounded-full border-2 border-primary-300/60 text-primary-700 text-sm font-semibold hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-2 justify-center"
              >
                <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center" />
                Falar com a Manger.pt
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden h-48 md:h-64">
              <img
                src="https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/c230d6e5-92d9-4d96-bc8d-97f5664e6171_compressed_Mousse.webp"
                alt="Mousse de chocolate para degustação"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="rounded-2xl overflow-hidden h-48 md:h-64 mt-8">
              <img
                src="https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/764097e5-4c69-4f20-8924-d9c716f5d365_compressed_PUDIM-COM-MORANGO-E-AMORAS.webp"
                alt="Pudim com frutos vermelhos para degustação"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}