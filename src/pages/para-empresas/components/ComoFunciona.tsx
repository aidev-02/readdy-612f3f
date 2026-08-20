const passos = [
  {
    numero: "01",
    titulo: "Diagnóstico inicial",
    texto: "Conhecemos o estabelecimento, o público, o volume, o posicionamento e as necessidades específicas.",
  },
  {
    numero: "02",
    titulo: "Seleção ou criação",
    texto: "Apresentamos produtos existentes ou desenvolvemos criações personalizadas para a carta.",
  },
  {
    numero: "03",
    titulo: "Degustação",
    texto: "Avaliamos sabores, formatos, apresentação e operação no contexto real do estabelecimento.",
  },
  {
    numero: "04",
    titulo: "Proposta comercial",
    texto: "Definimos preços, quantidades, frequência, condições e logística de entrega.",
  },
  {
    numero: "05",
    titulo: "Implementação",
    texto: "Iniciamos o fornecimento com orientação de armazenamento, serviço e apresentação.",
  },
  {
    numero: "06",
    titulo: "Acompanhamento",
    texto: "Acompanhamos a procura, ajustamos quantidades e evoluímos a oferta com o parceiro.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="bg-background-50 py-20 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-600 mb-4">
            <span className="w-8 h-px bg-primary-400" />
            Processo
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight">
            Da primeira conversa ao primeiro fornecimento
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {passos.map((p, i) => (
            <div
              key={p.numero}
              className="relative p-6 rounded-xl bg-background-100 border border-background-200/70 hover:border-primary-300/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-heading text-3xl font-bold text-primary-300/60">
                  {p.numero}
                </span>
                {i < passos.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2 w-6 h-px bg-background-300" />
                )}
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-2">
                {p.titulo}
              </h3>
              <p className="text-sm text-foreground-600 leading-relaxed">{p.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}