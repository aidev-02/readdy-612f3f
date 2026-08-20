import { useEffect, useRef, useState } from "react";

const metrics = [
  {
    value: "10+",
    label: "Anos de experiência internacional",
    detail: "Entre Portugal, Londres e Noruega",
  },
  {
    value: "3",
    label: "Países na trajetória",
    detail: "Portugal · Reino Unido · Noruega",
  },
  {
    value: "2",
    label: "Formações no Le Cordon Bleu",
    detail: "Cozinha e Pâtisserie",
  },
  {
    value: "∞",
    label: "Paixão pela cozinha",
    detail: "Desde o primeiro dia no Algarve",
  },
];

function CredCard({
  metric,
  index,
}: {
  metric: (typeof metrics)[number];
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
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`text-center p-6 md:p-8 rounded-lg bg-background-50 border border-background-200/70 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <p className="text-4xl md:text-5xl font-heading font-700 text-secondary-500 mb-3">
        {metric.value}
      </p>
      <p className="text-sm md:text-base font-medium text-foreground-800 mb-1">
        {metric.label}
      </p>
      <p className="text-xs md:text-sm text-foreground-500">{metric.detail}</p>
    </div>
  );
}

export default function BlocoCredenciais() {
  return (
    <section className="w-full bg-background-100 texture-paper py-16 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs uppercase tracking-[0.2em] font-label text-secondary-600 mb-3">
            Credenciais
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-600 text-foreground-950 mb-4">
            Experiência que se sente em cada detalhe
          </h2>
          <p className="text-base md:text-lg text-foreground-600 max-w-2xl mx-auto leading-relaxed">
            Números que refletem uma trajetória sólida, sem exageros nem inventos. Apenas o que foi vivido e construído com rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {metrics.map((m, i) => (
            <CredCard key={m.label} metric={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}