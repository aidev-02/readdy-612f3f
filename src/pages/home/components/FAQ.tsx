import { useState } from "react";

const faqs = [
  {
    q: "Com quanta antecedência devo encomendar?",
    a: "Cheesecakes e cremeux — 48 h. Bolos de eventos personalizados — 5 dias. Troncos de Natal e outras edições sazonais — mínimo 5 dias. Cada produto indica a antecedência mínima na sua ficha.",
  },
  {
    q: "Como funciona o pagamento e o sinal?",
    a: "Depois da encomenda validada pela nossa equipa, enviamos instruções para pagamento do sinal (normalmente 30% a 50% do valor total). O restante é liquidado no levantamento ou entrega.",
  },
  {
    q: "Fazem entregas ao domicílio?",
    a: "Sim, com rota organizada por dias e zonas cobertas. Escolhes take-away na loja ou entrega — o custo depende da localização e é sempre confirmado antes.",
  },
  {
    q: "É possível pedir sobremesas para restaurantes ou hotéis?",
    a: "Claro. Temos um fluxo dedicado para clientes profissionais com preço sob consulta, encomenda recorrente e ficha de faturação. Pede o catálogo em profissionais@manger.pt.",
  },
  {
    q: "Consigo personalizar um bolo de aniversário ou evento?",
    a: "Sim — indicas tamanho, número de pessoas, sabores, mensagem no bolo e imagens de referência. Devolvemos orçamento em 24 h.",
  },
  {
    q: "Como sei se um produto contém alergéneos?",
    a: "Cada ficha lista alergéneos e ingredientes-chave. No formulário de encomenda podes ainda descrever restrições específicas — confirmamos sempre antes de produzir.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-background-50">
      <div className="w-full px-4 md:px-10 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-700 mb-4">
            <span className="w-8 h-px bg-primary-500" />
            Perguntas frequentes
          </span>
          <h4 className="font-heading text-4xl md:text-5xl text-foreground-950 font-bold leading-tight">
            <a href="#faq" className="cursor-pointer">
              Tudo o que precisas de saber antes de encomendar.
            </a>
          </h4>
          <p className="mt-4 text-base text-foreground-700 leading-relaxed">
            Não encontraste a resposta? Fala connosco no WhatsApp — respondemos rápido.
          </p>
          <a
            href="https://wa.me/351000000000"
            rel="nofollow"
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent-600 hover:bg-accent-700 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap"
          >
            <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center" />
            Falar por WhatsApp
          </a>
        </div>

        <div id="faq" className="lg:col-span-8 space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={item.q}
                className={`border rounded-2xl transition-colors ${
                  isOpen
                    ? "bg-background-100 border-primary-300"
                    : "bg-background-50 border-background-200/70 hover:border-background-300/60"
                }`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-base md:text-lg text-foreground-950 font-semibold">
                    {item.q}
                  </span>
                  <span
                    className={`w-9 h-9 flex items-center justify-center rounded-full shrink-0 transition-colors ${
                      isOpen
                        ? "bg-primary-500 text-background-50"
                        : "bg-background-100 text-foreground-700"
                    }`}
                  >
                    <i
                      className={`${
                        isOpen ? "ri-subtract-line" : "ri-add-line"
                      } w-4 h-4 flex items-center justify-center`}
                    />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm md:text-base text-foreground-700 leading-relaxed">
                    {item.a}
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