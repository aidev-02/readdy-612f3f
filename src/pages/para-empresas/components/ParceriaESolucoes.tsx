const modelos = [
  { icon: "ri-calendar-check-line", titulo: "Fornecimento regular", texto: "Quantidades e entregas planeadas para operações com procura previsível." },
  { icon: "ri-shopping-cart-line", titulo: "Pedido conforme necessidade", texto: "Encomenda de acordo com o movimento real e a dinâmica da carta." },
  { icon: "ri-truck-line", titulo: "Entregas frequentes", texto: "Possibilidade de mais de uma entrega semanal para produtos frescos." },
  { icon: "ri-calendar-event-line", titulo: "Eventos e épocas especiais", texto: "Casamentos, eventos corporativos, Natal, Páscoa, verão e outras ocasiões." },
  { icon: "ri-vip-diamond-line", titulo: "Linha exclusiva", texto: "Sobremesas personalizadas e de assinatura desenvolvidas para o seu conceito." },
  { icon: "ri-stack-line", titulo: "Condições por volume", texto: "Condições diferenciadas para quantidades superiores ou fornecimento contínuo." },
];

export default function ParceriaESolucoes() {
  return (
    <section className="bg-background-50 py-20 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-600 mb-4">
              <span className="w-8 h-px bg-primary-400" />
              Modelos de parceria
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight mb-6">
              Uma solução adaptada à realidade do seu negócio
            </h2>
            <p className="text-base text-foreground-600 leading-relaxed mb-6">
              Não trabalhamos com uma fórmula rígida. Cada hotel ou restaurante tem o seu conceito, o seu volume de serviço, o seu perfil de cliente e a sua dinâmica operacional. Por isso, as condições de fornecimento são definidas caso a caso.
            </p>
            <p className="text-base text-foreground-600 leading-relaxed">
              Em operações com procura previsível, podemos estruturar um plano de fornecimento contínuo, garantindo maior estabilidade, organização e capacidade de resposta. Para necessidades pontuais ou variáveis, trabalhamos com modelos flexíveis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modelos.map((m) => (
              <div
                key={m.titulo}
                className="p-5 rounded-xl bg-background-100 border border-background-200/70 hover:border-primary-300/50 transition-colors"
              >
                <i className={`${m.icon} text-2xl text-primary-600 mb-3 w-6 h-6 flex items-center justify-center`} />
                <h3 className="font-heading text-base font-semibold text-foreground-950 mb-1.5">
                  {m.titulo}
                </h3>
                <p className="text-sm text-foreground-600 leading-relaxed">{m.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 pt-16 border-t border-background-200/70">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden h-[340px] md:h-[420px]">
                <img
                  src="https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/b8815882-2d7a-4879-a588-105da86c6fd5_compressed_restaurante-3.webp"
                  alt="Sobremesa premium servida em restaurante fine dining"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-600 mb-4">
                <span className="w-8 h-px bg-primary-400" />
                Desenvolvimento da carta
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight mb-5">
                Sobremesas exclusivas para a sua carta
              </h2>
              <p className="text-base text-foreground-600 leading-relaxed mb-5">
                Mais do que fornecer produtos, a Manger.pt pode colaborar na criação de uma oferta de sobremesas alinhada com o conceito do seu estabelecimento.
              </p>
              <ul className="space-y-3">
                {[
                  "Sobremesas de assinatura do Chef Manuel Brito",
                  "Seleções adaptadas ao perfil do seu público",
                  "Formatos adequados ao tipo de serviço",
                  "Menus sazonais e temáticos",
                  "Produtos específicos para eventos",
                  "Sobremesas individuais e bolos para partilhar",
                  "Apoio na composição da carta de sobremesas",
                  "Orientação sobre apresentação e empratamento",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground-700">
                    <i className="ri-check-line text-primary-500 mt-0.5 w-4 h-4 flex items-center justify-center shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}