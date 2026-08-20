import { useState } from "react";
import { Link } from "react-router-dom";
import type { Produto } from "@/mocks/catalogo";

interface ProdutoInfoProps {
  produto: Produto;
}

export default function ProdutoInfo({ produto }: ProdutoInfoProps) {
  const [variacaoIdx, setVariacaoIdx] = useState(0);
  const [quantidade, setQuantidade] = useState(1);
  const [imagemAmpliada, setImagemAmpliada] = useState(false);

  const temVariacoes = produto.variacoes.length > 0;
  const temPreco = produto.preco !== null;
  const variacaoAtual = temVariacoes ? produto.variacoes[variacaoIdx] : null;
  const precoAtual = variacaoAtual
    ? { preco: variacaoAtual.preco, precoNumero: variacaoAtual.precoNumero }
    : { preco: produto.preco, precoNumero: produto.precoNumero };

  const handleEncomendar = () => {
    const params = new URLSearchParams();
    params.set("produto", produto.slug);
    if (variacaoAtual) params.set("variacao", variacaoAtual.nome);
    params.set("quantidade", String(quantidade));
    window.location.href = `/encomenda?${params.toString()}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Família + nome */}
      <div>
        <Link
          to={`/catalogo?familia=${produto.familiaSlug}`}
          className="text-xs uppercase tracking-[0.2em] font-label text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
        >
          {produto.familia}
        </Link>
        <h1 className="font-heading text-3xl md:text-4xl text-foreground-950 font-bold mt-2 leading-tight">
          {produto.nome}
        </h1>
        <p className="text-foreground-600 mt-1.5 text-sm font-label">{produto.formato}</p>
      </div>

      {/* Descrição curta */}
      <p className="text-foreground-700 leading-relaxed">{produto.descricao}</p>

      {/* Preço */}
      <div className="flex items-baseline gap-2">
        {temPreco || variacaoAtual ? (
          <>
            <span className="font-heading text-4xl text-primary-700 font-bold">
              {precoAtual.preco}
            </span>
            {produto.variacoes.length > 1 && (
              <span className="text-sm text-foreground-500 font-label">selecionado</span>
            )}
          </>
        ) : (
          <span className="font-heading text-2xl text-foreground-500 font-bold">
            Preço sob consulta
          </span>
        )}
      </div>

      {/* Variações */}
      {temVariacoes && produto.variacoes.length > 1 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground-800 font-label mb-3 uppercase tracking-wider">
            Tamanho / Formato
          </h3>
          <div className="flex flex-wrap gap-2">
            {produto.variacoes.map((v, i) => (
              <button
                key={v.nome}
                type="button"
                onClick={() => {
                  setVariacaoIdx(i);
                  setQuantidade(1);
                }}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  i === variacaoIdx
                    ? "bg-foreground-950 text-background-50"
                    : "bg-background-100 text-foreground-700 hover:bg-background-200 border border-background-200/60"
                }`}
              >
                <span>{v.nome}</span>
                <span className="ml-2 font-semibold">{v.preco}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantidade + Encomendar */}
      {temPreco || variacaoAtual ? (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center border border-background-200/70 rounded-full overflow-hidden bg-background-50">
            <button
              type="button"
              onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
              className="w-11 h-11 flex items-center justify-center hover:bg-background-100 transition-colors cursor-pointer"
              aria-label="Reduzir quantidade"
            >
              <i className="ri-subtract-line w-4 h-4 flex items-center justify-center text-foreground-700" />
            </button>
            <span className="w-12 text-center font-semibold text-foreground-900 font-heading text-lg select-none">
              {quantidade}
            </span>
            <button
              type="button"
              onClick={() => setQuantidade(quantidade + 1)}
              className="w-11 h-11 flex items-center justify-center hover:bg-background-100 transition-colors cursor-pointer"
              aria-label="Aumentar quantidade"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center text-foreground-700" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleEncomendar}
            className="flex-1 px-8 py-3.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold uppercase tracking-wider font-label transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
          >
            <i className="ri-shopping-bag-3-line w-4 h-4 flex items-center justify-center" />
            Encomendar agora
          </button>
        </div>
      ) : (
        <Link
          to="/contactos"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground-950 hover:bg-primary-500 text-background-50 text-sm font-semibold uppercase tracking-wider font-label transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-mail-send-line w-4 h-4 flex items-center justify-center" />
          Pedir orçamento
        </Link>
      )}

      {/* Info cards: antecedência, disponibilidade, conservação, validade */}
      <div className="grid grid-cols-2 gap-3">
        <InfoCard
          icon="ri-time-line"
          label="Antecedência"
          value={produto.antecedencia}
        />
        <InfoCard
          icon="ri-calendar-check-line"
          label="Disponibilidade"
          value={produto.disponibilidade}
        />
        {produto.conservacao && (
          <InfoCard
            icon="ri-temp-cold-line"
            label="Conservação"
            value={produto.conservacao}
          />
        )}
        {produto.validade && (
          <InfoCard
            icon="ri-shield-check-line"
            label="Validade"
            value={produto.validade}
          />
        )}
      </div>

      {/* Alergéneos */}
      <div>
        <h3 className="text-sm font-semibold text-foreground-800 font-label mb-3 uppercase tracking-wider flex items-center gap-1.5">
          <i className="ri-alert-line w-4 h-4 flex items-center justify-center text-primary-600" />
          Alergéneos
        </h3>
        <div className="flex flex-wrap gap-2">
          {produto.alergeneos.map((a) => (
            <span
              key={a}
              className="px-3.5 py-1.5 rounded-full bg-background-100 text-foreground-700 text-xs font-semibold border border-background-200/60 font-label"
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Ingredientes */}
      {produto.ingredientes && produto.ingredientes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground-800 font-label mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <i className="ri-file-list-3-line w-4 h-4 flex items-center justify-center text-primary-600" />
            Ingredientes
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {produto.ingredientes.map((ing) => (
              <li
                key={ing}
                className="text-sm text-foreground-600 flex items-start gap-2"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                {ing}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-background-50 border border-background-200/70">
      <div className="flex items-center gap-2 text-foreground-500 text-xs uppercase tracking-wider font-label mb-1.5">
        <i className={`${icon} w-4 h-4 flex items-center justify-center`} />
        {label}
      </div>
      <p className="text-sm text-foreground-800 font-medium leading-relaxed">{value}</p>
    </div>
  );
}