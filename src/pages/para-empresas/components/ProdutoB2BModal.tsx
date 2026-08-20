import { useEffect } from "react";

interface Variacao {
  nome: string;
  preco: string;
  precoNumero: number;
}

interface GalleryProduct {
  id: number;
  name: string;
  description: string;
  descricao_longa?: string;
  image_url: string;
  imagem_thumb?: string;
  price: number | null;
  categories: string[];
  sort_order: number;
  estado: string;
  b2b: boolean;
  slug?: string;
  familia?: string;
  familia_slug?: string;
  formato?: string;
  tag?: string;
  dica_chef?: string;
  alergeneos?: string[];
  ingredientes?: string[];
  conservacao?: string;
  validade?: string;
  antecedencia?: string;
  disponibilidade?: string;
  assinatura_chef?: boolean;
  variacoes?: Variacao[];
  image_fit?: string;
  image_position?: string;
  image_scale?: number;
}

interface ProdutoB2BModalProps {
  produto: GalleryProduct;
  onClose: () => void;
}

interface InfoLinhaProps {
  icon: string;
  label: string;
  children: React.ReactNode;
}

function InfoLinha({ icon, label, children }: InfoLinhaProps) {
  return (
    <div className="flex gap-4 py-3 border-b border-background-200/60 last:border-b-0">
      <div className="flex items-start gap-2.5 min-w-[180px] text-foreground-500">
        <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
          <i className={`${icon} w-4 h-4 flex items-center justify-center`} />
        </div>
        <span className="text-sm font-label font-semibold whitespace-nowrap">{label}</span>
      </div>
      <div className="flex-1 text-sm text-foreground-700">{children}</div>
    </div>
  );
}

export default function ProdutoB2BModal({ produto, onClose }: ProdutoB2BModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const variacoes = produto.variacoes || [];
  const temVariacoes = variacoes.length > 0;
  const imageFit = produto.image_fit || "cover";
  const imagePosition = produto.image_position || "center";
  const imageScaleNum = produto.image_scale != null ? Number(produto.image_scale) : 1.0;
  const descricaoLonga = produto.descricao_longa || produto.description;
  const imagemModal = produto.imagem_thumb || produto.image_url;
  const tagDisplay = produto.dica_chef || produto.tag || (produto.b2b ? "B2B" : "Assinatura do Chef");
  const alergeneos = produto.alergeneos || [];
  const ingredientes = produto.ingredientes || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center py-8 px-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative w-full max-w-3xl bg-background-50 rounded-2xl overflow-hidden z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-background-50/90 hover:bg-background-100 text-foreground-600 hover:text-foreground-950 transition-colors cursor-pointer whitespace-nowrap"
          aria-label="Fechar"
        >
          <i className="ri-close-line text-xl w-5 h-5 flex items-center justify-center" />
        </button>

        <div className="relative w-full aspect-[16/10]" onClick={(e) => e.stopPropagation()}>
          <img
            src={imagemModal}
            alt={produto.name}
            className="w-full h-full"
            style={{
              objectFit: imageFit as any,
              objectPosition: imagePosition,
              transform: `scale(${imageScaleNum})`,
              transformOrigin: "center center",
            }}
          />
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-label bg-accent-100 text-accent-900">
            {tagDisplay}
          </span>
          {produto.assinatura_chef && (
            <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-background-50/90 text-primary-700 text-xs font-semibold flex items-center gap-1.5">
              <i className="ri-quill-pen-line w-3.5 h-3.5 flex items-center justify-center" />
              Chef Manuel Brito
            </span>
          )}
        </div>

        <div className="px-6 md:px-8 py-6 md:py-8">
          <h2 className="font-heading text-2xl md:text-3xl text-foreground-950 font-bold text-center mb-8">
            {produto.name}
          </h2>

          <div className="rounded-xl bg-background-100/70 p-5 md:p-6 mb-6">
            <p className="text-sm text-foreground-600 leading-relaxed">{descricaoLonga}</p>
          </div>

          <div className="space-y-0">
            <InfoLinha icon="ri-ruler-line" label="Formato">
              <span>{produto.formato || "—"}</span>
            </InfoLinha>

            {temVariacoes && (
              <InfoLinha icon="ri-stack-line" label="Variações">
                <div className="flex flex-col gap-1.5">
                  {variacoes.map((v, i) => (
                    <span key={i} className="text-foreground-700">{v.nome}</span>
                  ))}
                </div>
              </InfoLinha>
            )}

            <InfoLinha icon="ri-quill-pen-line" label="Dica do Chef">
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-label bg-secondary-100 text-secondary-900">
                {tagDisplay}
              </span>
            </InfoLinha>

            <InfoLinha icon="ri-folder-line" label="Família">
              <span>{produto.familia || "—"}</span>
            </InfoLinha>

            <InfoLinha icon="ri-alert-line" label="Alergénicos">
              <div className="flex flex-wrap gap-1.5">
                {alergeneos.length > 0 ? (
                  alergeneos.map((a) => (
                    <span
                      key={a}
                      className="px-2 py-0.5 rounded-md bg-background-100 text-foreground-600 text-[11px] uppercase tracking-wider font-label border border-background-200/60"
                    >
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-foreground-400 italic">Não informado</span>
                )}
              </div>
            </InfoLinha>

            <InfoLinha icon="ri-list-check-3" label="Ingredientes">
              {ingredientes.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {ingredientes.map((ing, i) => (
                    <span key={i} className="text-foreground-600">
                      {ing}{i < ingredientes.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-foreground-400 italic">Não informado</span>
              )}
            </InfoLinha>

            <InfoLinha icon="ri-thermometer-line" label="Conservação">
              {produto.conservacao ? (
                <span>{produto.conservacao}</span>
              ) : (
                <span className="text-foreground-400 italic">Não informado</span>
              )}
            </InfoLinha>

            <InfoLinha icon="ri-calendar-check-line" label="Validade">
              {produto.validade ? (
                <span>{produto.validade}</span>
              ) : (
                <span className="text-foreground-400 italic">Não informado</span>
              )}
            </InfoLinha>


          </div>
        </div>
      </div>
    </div>
  );
}