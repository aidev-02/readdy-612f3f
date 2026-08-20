const familiasCatalogo = [
  { slug: "todas", nome: "Todas as famílias" },
  { slug: "cheesecakes", nome: "Cheesecakes" },
  { slug: "cremeux", nome: "Cremeux" },
  { slug: "troncos", nome: "Troncos de Natal" },
  { slug: "ovos-pascoa", nome: "Ovos de Páscoa de Colher" },
  { slug: "bolos-eventos", nome: "Bolos & Eventos" },
  { slug: "paves-tartes", nome: "Pavés, Tartes & Entremets" },
  { slug: "profissionais", nome: "Para Profissionais" },
];

interface DicaOption {
  slug: string;
  nome: string;
  count: number;
}

interface FiltrosProps {
  ativo: string;
  onChange: (slug: string) => void;
  contagens: Record<string, number>;
  dicaAtivo: string;
  onDicaChange: (slug: string) => void;
  dicas: DicaOption[];
}

export default function Filtros({ ativo, onChange, contagens, dicaAtivo, onDicaChange, dicas }: FiltrosProps) {
  return (
    <div className="w-full px-4 md:px-10 pt-10 pb-2">
      <div className="flex flex-col gap-4">
        {/* Família filters */}
        <div className="flex flex-wrap gap-2">
          {familiasCatalogo.map((f) => {
            const selecionado = ativo === f.slug;
            const count = contagens[f.slug] ?? 0;
            return (
              <button
                key={f.slug}
                type="button"
                onClick={() => onChange(f.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selecionado
                    ? "bg-primary-500 text-background-50"
                    : "bg-background-100 text-foreground-700 hover:bg-background-200 border border-background-200/70"
                }`}
              >
                {f.nome}
                <span
                  className={`ml-1.5 text-xs ${
                    selecionado ? "text-background-100/80" : "text-foreground-500"
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Dica do Chef filters */}
        {dicas.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-label text-foreground-500 mr-1 whitespace-nowrap">
              <i className="ri-award-line w-3.5 h-3.5 inline-flex items-center justify-center mr-1" />
              Dica do Chef:
            </span>
            {dicas.map((d) => {
              const selecionado = dicaAtivo === d.slug;
              return (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => onDicaChange(d.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selecionado
                      ? "bg-accent-500 text-background-50"
                      : "bg-background-100 text-foreground-700 hover:bg-background-200 border border-background-200/70"
                  }`}
                >
                  {d.nome}
                  <span
                    className={`ml-1 text-[10px] ${
                      selecionado ? "text-background-100/80" : "text-foreground-500"
                    }`}
                  >
                    ({d.count})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}