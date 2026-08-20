import { useEffect, useRef, useState } from "react";

interface TimelineItem {
  location: string;
  duration: string;
  title: string;
  description: string;
  flag: string;
}

const items: TimelineItem[] = [
  {
    location: "Algarve, Portugal",
    duration: "Marco inicial",
    title: "Primeira experiência profissional",
    description:
      "Convite para trabalhar num restaurante profissional no Algarve. Foi ali que percebeu que queria fazer da cozinha a sua vida.",
    flag: "PT",
  },
  {
    location: "Londres, Reino Unido",
    duration: "Formação completa",
    title: "Le Cordon Bleu — Cozinha & Pâtisserie",
    description:
      "Formação de excelência em cozinha e pâtisserie numa das escolas mais prestigiadas do mundo.",
    flag: "GB",
  },
  {
    location: "St. Pancras, Londres",
    duration: "3 anos",
    title: "St. Pancras Renaissance Hotel",
    description:
      "Três anos num hotel emblemático de Londres, a trabalhar ao mais alto nível de exigência da hotelaria britânica.",
    flag: "GB",
  },
  {
    location: "King's Cross, Londres",
    duration: "1 ano",
    title: "Grain Store",
    description:
      "Um ano num conceito gastronómico inovador, a explorar técnicas contemporâneas e ingredientes de temporada.",
    flag: "GB",
  },
  {
    location: "Øye, Noruega",
    duration: "7 anos",
    title: "Hotel Union Øye",
    description:
      "Sete anos num hotel histórico norueguês, a desenvolver pastelaria artesanal num ambiente de excelência e natureza intocada.",
    flag: "NO",
  },
];

function flagEmoji(code: string) {
  const base = 0x1f1e6;
  return String.fromCodePoint(base + code.charCodeAt(0) - 65, base + code.charCodeAt(1) - 65);
}

function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
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
      className={`relative transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-5">
        <div className="shrink-0 w-12 h-12 rounded-full bg-secondary-100 border border-secondary-300/50 flex items-center justify-center">
          <span className="text-lg" role="img" aria-label={item.location}>
            {flagEmoji(item.flag)}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-label uppercase tracking-[0.12em] text-secondary-600">
              {item.location}
            </span>
            <span className="text-xs text-foreground-400">·</span>
            <span className="text-xs text-foreground-500">{item.duration}</span>
          </div>
          <h3 className="text-base md:text-lg font-heading font-600 text-foreground-900 mb-1.5">
            {item.title}
          </h3>
          <p className="text-sm text-foreground-600 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Timeline() {
  return (
    <section className="w-full bg-background-100 py-16 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs uppercase tracking-[0.2em] font-label text-secondary-600 mb-3">
            Experiência profissional
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-600 text-foreground-950 mb-4">
            De Portugal à Noruega
          </h2>
          <p className="text-base md:text-lg text-foreground-600 max-w-2xl mx-auto leading-relaxed">
            Mais de 10 anos de experiência internacional em cozinhas de referência, hotéis de prestígio e restaurantes de excelência.
          </p>
        </div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-secondary-300/40 hidden md:block" />

          <div className="space-y-10 md:space-y-12">
            {items.map((item, i) => (
              <TimelineCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}