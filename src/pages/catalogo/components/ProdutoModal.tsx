import { useEffect } from "react";
import type { Produto } from "@/mocks/catalogo";

interface ProdutoModalProps {
  produto: Produto;
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

export default function ProdutoModal({ produto, onClose }: ProdutoModalProps) {
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

  const temPreco = produto.preco !== null;
  const temVariacoes = produto.variacoes.length > 0;
  const imageFit = produto.imageFit || "cover";
  const imagePosition = produto.imagePosition || "center";
  const imageScaleNum = produto.imageScale != null ? Number(produto.imageScale) : 1.0;
  const descricaoLonga = produto.descricaoLonga || produto.descricao;

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
            src={produto.imagemThumb}
            alt={produto.nome}
            className="w-full h-full"
            style={{
              objectFit: imageFit as any,
              objectPosition: imagePosition,
              transform: `scale(${imageScaleNum})`,
              transformOrigin: "center center",
            }}
          />
          <span
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-label ${
              produto.b2b
                ? "bg-accent-100 text-accent-900"
                : "bg-secondary-500 text-primary-950"
            }`}
          >
            {produto.dicaChef || produto.tag}
          </span>
          <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-background-50/90 text-primary-700 text-xs font-semibold flex items-center gap-1.5">
            <i className="ri-quill-pen-line w-3.5 h-3.5 flex items-center justify-center" />
            Chef Manuel Brito
          </span>
        </div>

        <div className="px-6 md:px-8 py-6 md:py-8">
          <h2 className="font-heading text-2xl md:text-3xl text-foreground-950 font-bold text-center mb-8">
            {produto.nome}
          </h2>

          <div className="rounded-xl bg-background-100/70 p-5 md:p-6 mb-6">
            <p className="text-sm text-foreground-600 leading-relaxed">{descricaoLonga}</p>
          </div>

          <div className="space-y-0">
            <InfoLinha icon="ri-price-tag-3-line" label="Preço">
              {temPreco ? (
                <span className="font-heading text-xl text-primary-700 font-bold">{produto.preco}</span>
              ) : (
                <span className="font-heading text-lg text-foreground-500 font-bold">Sob consulta</span>
              )}
            </InfoLinha>

            <InfoLinha icon="ri-ruler-line" label="Formato">
              <span>{produto.formato}</span>
            </InfoLinha>

            {temVariacoes && (
              <InfoLinha icon="ri-stack-line" label="Variações">
                <div className="flex flex-col gap-1.5">
                  {produto.variacoes.map((v, i) => (
                    <span key={i} className="flex items-center justify-between gap-4">
                      <span className="text-foreground-700">{v.nome}</span>
                      <span className="font-heading font-bold text-primary-700 whitespace-nowrap">{v.preco}</span>
                    </span>
                  ))}
                </div>
              </InfoLinha>
            )}

            <InfoLinha icon="ri-quill-pen-line" label="Dica do Chef">
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-label bg-secondary-100 text-secondary-900">
                {produto.dicaChef || produto.tag}
              </span>
            </InfoLinha>

            <InfoLinha icon="ri-folder-line" label="Família">
              <span>{produto.familia}</span>
            </InfoLinha>

            <InfoLinha icon="ri-alert-line" label="Alergénicos">
              <div className="flex flex-wrap gap-1.5">
                {produto.alergeneos.length > 0 ? (
                  produto.alergeneos.map((a) => (
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
              {produto.ingredientes && produto.ingredientes.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {produto.ingredientes.map((ing, i) => (
                    <span key={i} className="text-foreground-600">
                      {ing}{i < produto.ingredientes!.length - 1 ? "," : ""}
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

            <InfoLinha icon="ri-checkbox-circle-line" label="Disponibilidade">
              <span className="flex items-center gap-1.5">
                {produto.disponibilidade}
              </span>
            </InfoLinha>

            <InfoLinha icon="ri-time-line" label="Prazo de entrega">
              <span>{produto.antecedencia}</span>
            </InfoLinha>

            <InfoLinha icon="ri-building-2-line" label="Categorias B2B">
              {produto.categoriasB2B && produto.categoriasB2B.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {produto.categoriasB2B.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-full bg-accent-100 text-accent-900 text-[11px] font-semibold uppercase tracking-wider font-label"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-foreground-400 italic">Não aplicável</span>
              )}
            </InfoLinha>
          </div>
        </div>
      </div>
    </div>
  );
}