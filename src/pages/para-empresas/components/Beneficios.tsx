const beneficios = [
  {
    icon: "ri-equalizer-line",
    titulo: "Qualidade consistente",
    texto: "O mesmo sabor, textura e apresentação em cada fornecimento. A produção especializada garante padrão uniforme.",
  },
  {
    icon: "ri-building-line",
    titulo: "Menos investimento interno",
    texto: "Reduza a necessidade de equipamentos, estrutura e mão de obra especializada em pastelaria.",
  },
  {
    icon: "ri-line-chart-line",
    titulo: "Maior previsibilidade",
    texto: "Melhor controlo de porções, custos, produção e disponibilidade ao longo do tempo.",
  },
  {
    icon: "ri-recycle-line",
    titulo: "Menor desperdício",
    texto: "Planeamento e formatos adaptados ao consumo real do estabelecimento.",
  },
  {
    icon: "ri-restaurant-2-line",
    titulo: "Carta mais atrativa",
    texto: "Opções clássicas, contemporâneas, sazonais ou exclusivas para enriquecer a oferta.",
  },
  {
    icon: "ri-coins-line",
    titulo: "Potencial de rentabilidade",
    texto: "Elevado valor percebido pelo cliente e possibilidade de boa margem para o estabelecimento.",
  },
];

export default function Beneficios() {
  return (
    <section className="bg-background-100 py-20 md:py-24 texture-paper">
      <div className="w-full px-4 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-600 mb-4">
            <span className="w-8 h-px bg-primary-400" />
            Benefícios
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight">
            Mais qualidade para o cliente. Menos complexidade para a sua operação.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {beneficios.map((b) => (
            <div
              key={b.titulo}
              className="p-6 rounded-xl bg-background-50 border border-background-200/70 hover:border-secondary-300/60 transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-100 text-primary-700 mb-4">
                <i className={`${b.icon} text-xl w-6 h-6 flex items-center justify-center`} />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-2">
                {b.titulo}
              </h3>
              <p className="text-sm text-foreground-600 leading-relaxed">{b.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}