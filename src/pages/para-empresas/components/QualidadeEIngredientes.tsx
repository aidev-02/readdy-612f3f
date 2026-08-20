export default function QualidadeEIngredientes() {
  return (
    <section className="bg-primary-950 text-background-50 py-20 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-secondary-300 mb-4">
              <span className="w-8 h-px bg-secondary-400" />
              Qualidade e consistência
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-5">
              Qualidade que se mantém em cada serviço
            </h2>
            <p className="text-base text-background-100/85 leading-relaxed mb-5">
              Um dos maiores desafios na restauração é garantir que o cliente recebe sempre a mesma experiência. Na Manger.pt, a consistência é um compromisso.
            </p>
            <p className="text-base text-background-100/85 leading-relaxed mb-6">
              Cada sobremesa é preparada para manter o mesmo perfil de sabor, a mesma textura, o mesmo padrão visual, a mesma qualidade dos ingredientes e o mesmo nível de execução.
            </p>
            <p className="text-base text-background-100/85 leading-relaxed">
              Essa regularidade permite servir com confiança, reduzir variações e proteger a reputação da marca. O cliente que regressa encontra a mesma qualidade que o fez querer repetir.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { valor: "100%", label: "Artesanal" },
              { valor: "30+", label: "Parceiros ativos" },
              { valor: "Cada", label: "Entrega igual" },
              { valor: "Rigor", label: "Na execução" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-5 rounded-xl bg-background-50/5 border border-background-50/10 text-center"
              >
                <div className="font-heading text-3xl md:text-4xl font-bold text-secondary-300 mb-1">
                  {stat.valor}
                </div>
                <div className="text-xs uppercase tracking-wider font-label text-background-200/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 pt-16 border-t border-background-50/10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden h-[340px] md:h-[420px]">
              <img
                src="https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/dd330f47-e890-4f5f-8573-ca538ed994b6_compressed_IMG-20260710-WA0024.webp"
                alt="Ingredientes premium e produção artesanal de sobremesas"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-secondary-300 mb-4">
              <span className="w-8 h-px bg-secondary-400" />
              Ingredientes premium
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-5">
              Ingredientes premium. Produção artesanal. Resultado memorável.
            </h2>
            <p className="text-base text-background-100/85 leading-relaxed mb-5">
              A qualidade começa na seleção. As nossas criações utilizam ingredientes criteriosamente selecionados, incluindo chocolates premium, natas frescas, mascarpone, cream cheese, frutos secos, frutas, pistácio e outros produtos de elevada qualidade.
            </p>
            <p className="text-base text-background-100/85 leading-relaxed">
              A produção combina técnica, experiência e atenção aos detalhes, com foco no equilíbrio entre sabor, textura e apresentação. Não procuramos apenas criar sobremesas bonitas. Procuramos criar sobremesas que valorizem toda a experiência gastronómica do seu cliente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}