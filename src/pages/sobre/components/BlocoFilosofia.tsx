import { useEffect, useRef, useState } from "react";

const cards = [
  {
    icon: "ri-seedling-line",
    title: "Ingredientes de primeira qualidade",
    text: "A qualidade começa na seleção rigorosa das matérias-primas. Cada ingrediente é escolhido com o mesmo critério que se exige nas melhores cozinhas.",
  },
  {
    icon: "ri-heart-3-line",
    title: "Sabor acima de tudo",
    text: "Cada criação deve ser equilibrada, autêntica e memorável. O sabor é o primeiro critério e o último a ser avaliado.",
  },
  {
    icon: "ri-tools-line",
    title: "Técnica e consistência",
    text: "Processos bem executados garantem qualidade em cada entrega. A técnica é a base, a consistência é o compromisso.",
  },
  {
    icon: "ri-hand-heart-line",
    title: "Produção artesanal",
    text: "Atenção aos detalhes, respeito pelo produto e cuidado em cada etapa. Não há atalhos no trabalho bem feito.",
  },
  {
    icon: "ri-fire-line",
    title: "Espírito old school",
    text: "Disciplina, rigor, presença na cozinha e compromisso com o resultado. Valores que não saem de moda.",
  },
];

function FilosofiaCard({
  card,
  index,
}: {
  card: (typeof cards)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative p-6 md:p-8 rounded-lg bg-background-50 border border-background-200/70 hover:border-secondary-300/70 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-12 h-12 rounded-full bg-secondary-100/80 flex items-center justify-center mb-5 group-hover:bg-secondary-200/80 transition-colors">
        <i className={`${card.icon} w-5 h-5 flex items-center justify-center text-secondary-600`} />
      </div>
      <h3 className="text-lg font-heading font-600 text-foreground-900 mb-3">
        {card.title}
      </h3>
      <p className="text-sm text-foreground-600 leading-relaxed">{card.text}</p>
    </div>
  );
}

export default function BlocoFilosofia() {
  return (
    <section className="w-full bg-primary-950 py-16 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs uppercase tracking-[0.2em] font-label text-secondary-400 mb-3">
            Filosofia de trabalho
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-600 text-background-50 mb-4">
            O que guia cada criação
          </h2>
          <p className="text-base md:text-lg text-background-200/70 max-w-2xl mx-auto leading-relaxed">
            Princípios nascidos na prática diária e moldados por mais de uma década de exigência profissional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {cards.slice(0, 3).map((card, i) => (
            <FilosofiaCard key={card.title} card={card} index={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 mt-5 md:mt-6 max-w-3xl mx-auto">
          {cards.slice(3).map((card, i) => (
            <FilosofiaCard key={card.title} card={card} index={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}