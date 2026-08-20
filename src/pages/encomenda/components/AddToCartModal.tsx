import { useState, useMemo } from "react";
import type { Produto } from "@/mocks/catalogo";
import type { AddToCartPayload } from "../hooks/useCart";

interface AddToCartModalProps {
  produto: Produto;
  onConfirm: (payload: AddToCartPayload) => void;
  onClose: () => void;
}

const opcoesAlergias = [
  "Glúten",
  "Lactose",
  "Ovo",
  "Frutos de casca rija",
  "Amendoim",
  "Soja",
  "Sem restrições",
];

export default function AddToCartModal({ produto, onConfirm, onClose }: AddToCartModalProps) {
  const [variacao, setVariacao] = useState(
    produto.variacoes.length > 0 ? produto.variacoes[0].nome : "",
  );
  const [quantidade, setQuantidade] = useState(1);
  const [mensagem, setMensagem] = useState("");
  const [alergias, setAlergias] = useState<string[]>([]);
  const [detalhesAberto, setDetalhesAberto] = useState(false);

  const variacaoSelecionada = useMemo(
    () => produto.variacoes.find((v) => v.nome === variacao) || null,
    [produto, variacao],
  );

  const temDetalhes = !!(
    produto.descricaoLonga ||
    (produto.ingredientes && produto.ingredientes.length > 0) ||
    produto.conservacao ||
    produto.validade
  );

  const toggleAlergia = (a: string) => {
    if (a === "Sem restrições") {
      setAlergias(["Sem restrições"]);
    } else {
      setAlergias((prev) => {
        const novas = prev.filter((x) => x !== "Sem restrições");
        if (novas.includes(a)) return novas.filter((x) => x !== a);
        return [...novas, a];
      });
    }
  };

  const handleConfirm = () => {
    if (!variacaoSelecionada && produto.variacoes.length > 0) return;
    onConfirm({
      produtoId: produto.id,
      produtoNome: produto.nome,
      produtoImagem: produto.imagem,
      variacao: variacaoSelecionada?.nome || "Tamanho único",
      variacaoPreco: variacaoSelecionada?.preco || produto.preco || "Sob consulta",
      variacaoPrecoNumero: variacaoSelecionada?.precoNumero ?? produto.precoNumero,
      quantidade,
      mensagem,
      alergias,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-background-50 rounded-2xl border border-background-200/70 shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-up">
        <div className="sticky top-0 bg-background-50 z-10 flex items-center justify-between p-5 border-b border-background-100">
          <h3 className="font-heading text-lg font-bold text-foreground-950">Adicionar ao pedido</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-background-100 text-foreground-600 hover:bg-background-200 transition-colors cursor-pointer"
          >
            <i className="ri-close-line w-4 h-4 flex items-center justify-center" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-background-100 border border-background-200/70">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-heading text-base font-semibold text-foreground-900">{produto.nome}</h4>
              <p className="text-xs text-foreground-500 mt-0.5 line-clamp-2">{produto.descricao}</p>
              <p className="text-xs text-foreground-400 mt-1">
                Alergéneos: {produto.alergeneos.join(" · ")}
              </p>
            </div>
          </div>

          {temDetalhes && (
            <div className="rounded-xl border border-background-200/70 overflow-hidden">
              <button
                type="button"
                onClick={() => setDetalhesAberto(!detalhesAberto)}
                className="w-full flex items-center justify-between px-4 py-3 bg-background-50 hover:bg-background-100 transition-colors cursor-pointer"
              >
                <span className="text-sm font-semibold text-foreground-800">Ver mais detalhes</span>
                <i
                  className={`${detalhesAberto ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} w-4 h-4 flex items-center justify-center text-foreground-500 transition-transform duration-200`}
                />
              </button>
              {detalhesAberto && (
                <div className="px-4 pb-4 space-y-4 border-t border-background-100 pt-4 animate-fade-up">
                  {produto.descricaoLonga && (
                    <div>
                      <h5 className="text-xs font-semibold text-foreground-400 uppercase tracking-wider mb-1.5">Descrição</h5>
                      <p className="text-sm text-foreground-700 leading-relaxed">{produto.descricaoLonga}</p>
                    </div>
                  )}

                  {produto.ingredientes && produto.ingredientes.length > 0 && (
                    <div>
                      <h5 className="text-xs font-semibold text-foreground-400 uppercase tracking-wider mb-1.5">Ingredientes</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {produto.ingredientes.map((ing) => (
                          <span
                            key={ing}
                            className="px-2.5 py-1 rounded-full bg-background-100 text-foreground-600 text-xs whitespace-nowrap"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {produto.conservacao && (
                    <div>
                      <h5 className="text-xs font-semibold text-foreground-400 uppercase tracking-wider mb-1.5">Conservação</h5>
                      <p className="text-sm text-foreground-700">{produto.conservacao}</p>
                    </div>
                  )}

                  {produto.validade && (
                    <div>
                      <h5 className="text-xs font-semibold text-foreground-400 uppercase tracking-wider mb-1.5">Validade</h5>
                      <p className="text-sm text-foreground-700">{produto.validade}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {produto.variacoes.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-foreground-800 mb-3">
                Tamanho / Formato
              </label>
              <div className="space-y-2">
                {produto.variacoes.map((v) => (
                  <label
                    key={v.nome}
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${
                      variacao === v.nome
                        ? "border-primary-500 bg-primary-50/50"
                        : "border-background-200 bg-background-50 hover:border-background-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="modal_variacao"
                        value={v.nome}
                        checked={variacao === v.nome}
                        onChange={() => setVariacao(v.nome)}
                        className="w-4 h-4 accent-primary-500"
                      />
                      <span className="text-sm font-medium text-foreground-800">{v.nome}</span>
                    </div>
                    <span className="text-sm font-bold text-primary-600 whitespace-nowrap">{v.preco}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="modal_quantidade" className="block text-sm font-semibold text-foreground-800 mb-2">
              Quantidade
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background-100 text-foreground-700 hover:bg-background-200 transition-colors cursor-pointer"
              >
                <i className="ri-subtract-line w-4 h-4 flex items-center justify-center" />
              </button>
              <span className="w-14 text-center text-lg font-semibold text-foreground-950">{quantidade}</span>
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.min(50, q + 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background-100 text-foreground-700 hover:bg-background-200 transition-colors cursor-pointer"
              >
                <i className="ri-add-line w-4 h-4 flex items-center justify-center" />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="modal_mensagem" className="block text-sm font-semibold text-foreground-800 mb-2">
              Mensagem especial (opcional)
            </label>
            <textarea
              id="modal_mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              maxLength={200}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors resize-none"
              placeholder='Ex: "Parabéns Maria! 🎂"'
            />
            <p className="text-xs text-foreground-400 mt-1">{mensagem.length}/200</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground-800 mb-3">
              Alergias / Restrições
            </label>
            <div className="flex flex-wrap gap-2">
              {opcoesAlergias.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAlergia(a)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                    alergias.includes(a)
                      ? "bg-accent-500 text-background-50"
                      : "bg-background-100 text-foreground-600 hover:bg-background-200"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-background-100">
            <span className="text-sm text-foreground-600">
              {variacaoSelecionada
                ? `${variacaoSelecionada.preco} × ${quantidade}`
                : produto.preco
                  ? `${produto.preco} × ${quantidade}`
                  : "Preço sob consulta"}
            </span>
            {variacaoSelecionada?.precoNumero != null && (
              <span className="font-heading text-lg font-bold text-primary-600">
                {(variacaoSelecionada.precoNumero * quantidade).toFixed(2).replace(".", ",")} €
              </span>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-background-50 border-t border-background-100 p-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-full bg-background-100 text-foreground-600 text-sm font-semibold hover:bg-background-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 px-5 py-3 rounded-full bg-primary-500 text-background-50 text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
          >
            <i className="ri-shopping-bag-3-line w-4 h-4 flex items-center justify-center" />
            Adicionar ao pedido
          </button>
        </div>
      </div>
    </div>
  );
}