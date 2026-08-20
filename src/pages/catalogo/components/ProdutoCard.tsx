import { useState } from "react";
import { Link } from "react-router-dom";
import type { Produto } from "@/mocks/catalogo";
import ProdutoModal from "./ProdutoModal";
import OrcamentoModal from "./OrcamentoModal";

export default function ProdutoCard({ produto }: { produto: Produto }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [orcamentoAberto, setOrcamentoAberto] = useState(false);
  const temPreco = produto.preco !== null;
  const temVariacoes = produto.variacoes.length > 0;
  const imageFit = produto.imageFit || "cover";
  const imagePosition = produto.imagePosition || "center";
  const imageScaleNum = produto.imageScale != null ? Number(produto.imageScale) : 1.0;

  return (
    <>
      <article className="group bg-background-50 rounded-2xl overflow-hidden border border-background-200/70 hover:border-primary-300 transition-colors flex flex-col">
        <div
          className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer"
          onClick={() => setModalAberto(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") setModalAberto(true); }}
          aria-label={`Ver detalhes de ${produto.nome}`}
        >
          <img
            src={produto.imagemThumb}
            alt={produto.nome}
            className="group-hover:scale-105 transition-transform duration-500"
            style={{
              width: '120%',
              height: '120%',
              maxWidth: 'none',
              maxHeight: 'none',
              marginLeft: '-10%',
              marginTop: '-10%',
              objectFit: imageFit as any,
              objectPosition: imagePosition,
              transform: `scale(${imageScaleNum})`,
              transformOrigin: 'center center',
            }}
          />
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-label ${
              produto.b2b
                ? "bg-accent-100 text-accent-900"
                : "bg-secondary-500 text-primary-950"
            }`}
          >
            {produto.dicaChef || produto.tag}
          </span>
          <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background-50/90 text-primary-700 text-xs font-semibold flex items-center gap-1.5">
            <i className="ri-quill-pen-line w-3.5 h-3.5 flex items-center justify-center" />
            Chef Manuel Brito
          </span>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <span className="text-xs uppercase tracking-[0.2em] font-label text-primary-600">
            {produto.familia}
          </span>
          <h3 className="font-heading text-xl text-foreground-950 font-semibold mt-1.5 leading-tight">
            {produto.nome}
          </h3>
          <p className="text-sm text-foreground-600 mt-1 leading-relaxed line-clamp-2">
            {produto.descricao}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {produto.alergeneos.slice(0, 3).map((a) => (
              <span
                key={a}
                className="px-2 py-0.5 rounded-md bg-background-100 text-foreground-600 text-[10px] uppercase tracking-wider font-label border border-background-200/60"
              >
                {a}
              </span>
            ))}
            {produto.alergeneos.length > 3 && (
              <span className="px-2 py-0.5 rounded-md bg-background-100 text-foreground-500 text-[10px] uppercase tracking-wider font-label border border-background-200/60">
                +{produto.alergeneos.length - 3}
              </span>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-background-200/70 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              {temPreco ? (
                <>
                  <span className="font-heading text-2xl text-primary-700 font-bold">
                    {produto.preco}
                  </span>
                  {temVariacoes && produto.variacoes.length > 1 && (
                    <span className="text-[11px] text-foreground-500 font-label mt-0.5">
                      A partir de
                    </span>
                  )}
                </>
              ) : (
                <span className="font-heading text-lg text-foreground-500 font-bold">
                  Sob consulta
                </span>
              )}
            </div>
            {temPreco ? (
              <Link
                to={`/produto/${produto.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground-950 hover:bg-primary-500 text-background-50 text-xs font-semibold uppercase tracking-wider font-label transition-colors cursor-pointer whitespace-nowrap"
              >
                Encomendar
                <i className="ri-arrow-right-line w-3.5 h-3.5 flex items-center justify-center" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setOrcamentoAberto(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground-950 hover:bg-primary-500 text-background-50 text-xs font-semibold uppercase tracking-wider font-label transition-colors cursor-pointer whitespace-nowrap"
              >
                Pedir orçamento
                <i className="ri-arrow-right-line w-3.5 h-3.5 flex items-center justify-center" />
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center gap-3 text-[11px] text-foreground-500 font-label">
            <span className="flex items-center gap-1">
              <i className="ri-time-line w-3.5 h-3.5 flex items-center justify-center" />
              {produto.antecedencia}
            </span>
            <span className="flex items-center gap-1">
              <i className="ri-calendar-check-line w-3.5 h-3.5 flex items-center justify-center" />
              {produto.disponibilidade}
            </span>
          </div>
        </div>
      </article>
      {modalAberto && (
        <ProdutoModal produto={produto} onClose={() => setModalAberto(false)} />
      )}
      {orcamentoAberto && (
        <OrcamentoModal produto={produto} onClose={() => setOrcamentoAberto(false)} />
      )}
    </>
  );
}