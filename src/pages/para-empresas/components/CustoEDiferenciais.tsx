const diferenciais = [
  { label: "Consistência", texto: "Sabor, textura e apresentação sempre iguais." },
  { label: "Flexibilidade", texto: "Fornecimento adaptado à necessidade de cada parceiro." },
  { label: "Personalização", texto: "Produtos exclusivos alinhados com a identidade do estabelecimento." },
  { label: "Frescura", texto: "Frequência de entrega adequada à natureza de cada produto." },
  { label: "Escalabilidade", texto: "Fornecimento que acompanha o crescimento do negócio." },
  { label: "Apoio especializado", texto: "Experiência e orientação do Chef Manuel Brito." },
  { label: "Diferenciação", texto: "Reforço da identidade gastronómica da casa." },
  { label: "Rentabilidade", texto: "Elevado valor percebido e potencial de boa margem." },
];

export default function CustoEDiferenciais() {
  return (
    <section className="bg-background-50 py-20 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-600 mb-4">
              <span className="w-8 h-px bg-primary-400" />
              Eficiência operacional
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight mb-5">
              Alto nível sem aumentar a complexidade
            </h2>
            <p className="text-base text-foreground-600 leading-relaxed mb-5">
              Criar internamente uma pastelaria de elevado nível exige investimento em equipamento, espaço, ingredientes, formação, recrutamento e controlo de qualidade.
            </p>
            <p className="text-base text-foreground-600 leading-relaxed mb-6">
              Ao estabelecer uma parceria com a Manger.pt, o seu negócio pode aceder a uma oferta premium sem assumir toda essa estrutura.
            </p>
            <ul className="space-y-3">
              {[
                "Redução de mão de obra especializada",
                "Menor investimento em equipamento",
                "Previsibilidade de custos",
                "Menos preparação interna",
                "Operação simplificada",
                "Menor desperdício",
                "Acesso a alto nível imediatamente",
                "Ampliação da carta sem complexidade acrescida",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground-700">
                  <i className="ri-check-line text-primary-500 mt-0.5 w-4 h-4 flex items-center justify-center shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-600 mb-4">
              <span className="w-8 h-px bg-primary-400" />
              Custo-benefício
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight mb-5">
              Melhor custo-benefício para o estabelecimento
            </h2>
            <p className="text-base text-foreground-600 leading-relaxed mb-6">
              Uma sobremesa premium não deve ser apenas um custo. Deve ser uma oportunidade de aumentar valor, margem e satisfação do cliente.
            </p>
            <p className="text-base text-foreground-600 leading-relaxed mb-8">
              A Manger.pt procura equilibrar qualidade, apresentação, custo, porção, flexibilidade e condições adequadas ao volume. Para quantidades superiores ou fornecimentos regulares, podem ser negociadas condições específicas. Cada proposta considera produto, volume, frequência e logística.
            </p>

            <div className="p-6 rounded-xl bg-accent-950 text-background-50">
              <h3 className="font-heading text-xl font-semibold mb-4 text-secondary-300">
                Diferenciais para hotéis e restaurantes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {diferenciais.map((d) => (
                  <div key={d.label} className="flex items-start gap-2.5">
                    <i className="ri-star-fill text-secondary-400 mt-0.5 w-3.5 h-3.5 flex items-center justify-center shrink-0 text-[10px]" />
                    <div>
                      <span className="text-sm font-semibold text-background-50">{d.label}</span>
                      <span className="text-sm text-background-200/80 block">{d.texto}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}