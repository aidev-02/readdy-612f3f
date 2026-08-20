export default function SolucoesSegmentos() {
  return (
    <section className="bg-background-50 py-20 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-600 mb-4">
            <span className="w-8 h-px bg-primary-400" />
            Segmentos
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight">
            Soluções pensadas para cada tipo de estabelecimento
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-background-100 border border-background-200/70">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                <i className="ri-restaurant-2-line text-xl w-6 h-6 flex items-center justify-center" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground-950">Para restaurantes</h3>
                <p className="text-xs text-foreground-500">Independentes, fine dining e de hotel</p>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Sobremesas fixas na carta ao longo do ano",
                "Sugestões sazonais que renovam a oferta",
                "Sobremesa do dia ou da semana",
                "Formatos prontos a servir ou com finalização simples",
                "Opções para delivery e takeaway",
                "Fornecimento conforme a procura real",
                "Criações exclusivas para a casa",
                "Apoio nas porções e no preço de venda",
                "Condições de recorrência vantajosas",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground-700">
                  <i className="ri-check-line text-primary-500 mt-0.5 w-4 h-4 flex items-center justify-center shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#formulario-comercial"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 text-background-50 text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              Quero melhorar a carta do meu restaurante
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
            </a>
          </div>

          <div className="p-8 rounded-2xl bg-background-100 border border-background-200/70">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                <i className="ri-hotel-line text-xl w-6 h-6 flex items-center justify-center" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground-950">Para hotéis</h3>
                <p className="text-xs text-foreground-500">Boutique, 4 e 5 estrelas, resorts e spas</p>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Restaurante do hotel com carta diferenciada",
                "Serviço de quarto (room service) com elegância",
                "Pequeno-almoço e brunch com opções premium",
                "Coffee breaks e pausas gastronómicas",
                "Casamentos e banquetes com apresentação impecável",
                "Eventos corporativos e experiências para hóspedes",
                "Salas VIP e clubes privados",
                "Épocas especiais e menus temáticos",
                "Menus personalizados por estação",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground-700">
                  <i className="ri-check-line text-accent-500 mt-0.5 w-4 h-4 flex items-center justify-center shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#formulario-comercial"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-500 text-background-50 text-sm font-semibold hover:bg-accent-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              Quero conhecer as soluções para o meu hotel
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}