import { useState } from "react";

const faqs = [
  {
    pergunta: "Qual é o prazo mínimo para encomendar?",
    resposta:
      "Recomendamos encomendar com 24h a 48h de antecedência. Para eventos e encomendas maiores, idealmente 3 a 5 dias. Produtos sazonais e assinaturas do Chef podem ter antecedência específica — consulta o catálogo.",
  },
  {
    pergunta: "Como funciona a entrega?",
    resposta:
      "Entregamos na Grande Lisboa em horário combinado. Para outras zonas, contacta-nos. Também podes levantar no atelier sem custo adicional. As entregas são feitas em caixas térmicas para garantir a qualidade.",
  },
  {
    pergunta: "Aceitam encomendas para eventos?",
    resposta:
      "Sim! Casamentos, batizados, aniversários, eventos corporativos — fazemos sob medida. Entra em contacto connosco com a data, número de pessoas e tipo de evento para um orçamento personalizado.",
  },
  {
    pergunta: "É possível personalizar uma sobremesa?",
    resposta:
      "Claro. Aceitamos personalizações de sabor, decoração, mensagens escritas e temáticas. Algumas personalizações podem necessitar de antecedência adicional. Fala connosco da tua ideia.",
  },
  {
    pergunta: "Quais são as opções de pagamento?",
    resposta:
      "Aceitamos transferência bancária, MB WAY e pagamento no ato da entrega/levanamento. Para encomendas de valor elevado, pode ser pedido um sinal de 30% a 50% no ato da confirmação.",
  },
  {
    pergunta: "Como sei que a minha encomenda foi confirmada?",
    resposta:
      "Receberás confirmação por email ou WhatsApp com todos os detalhes: produtos, data, hora, morada e valor. Até lá, a encomenda está em validação.",
  },
];

export default function FAQEntregas() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full px-4 md:px-10 py-16 md:py-24 bg-background-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 border border-primary-200/60 text-primary-800 text-xs uppercase tracking-[0.24em] font-label whitespace-nowrap">
            <i className="ri-questionnaire-line w-3 h-3 flex items-center justify-center" />
            Perguntas frequentes
          </span>
          <h2 className="mt-5 font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight">
            Tudo sobre encomendas e entregas
          </h2>
          <p className="mt-4 text-base text-foreground-700 leading-relaxed">
            Se não encontrares a resposta que procuras, não hesites em contactar-nos diretamente.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-xl border transition-all ${
                  isOpen
                    ? "border-primary-300/50 bg-background-50"
                    : "border-background-200/70 bg-background-50 hover:border-background-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer"
                >
                  <span className="font-heading text-base md:text-lg font-semibold text-foreground-950 pr-4">
                    {faq.pergunta}
                  </span>
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full shrink-0 transition-colors ${
                      isOpen ? "bg-primary-500 text-background-50" : "bg-background-100 text-foreground-500"
                    }`}
                  >
                    <i
                      className={`${isOpen ? "ri-subtract-line" : "ri-add-line"} w-4 h-4 flex items-center justify-center`}
                    />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 md:px-6 pb-5 md:pb-6">
                    <p className="text-sm md:text-base text-foreground-700 leading-relaxed">
                      {faq.resposta}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}