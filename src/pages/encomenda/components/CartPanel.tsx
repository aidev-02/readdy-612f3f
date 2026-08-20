import type { CartItem } from "../hooks/useCart";

interface CartPanelProps {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hasPricedItems: boolean;
  onRemoveItem: (cartId: string) => void;
  onUpdateQty: (cartId: string, qty: number) => void;
  onCheckout: () => void;
}

export default function CartPanel({
  items,
  itemCount,
  subtotal,
  hasPricedItems,
  onRemoveItem,
  onUpdateQty,
  onCheckout,
}: CartPanelProps) {
  return (
    <div className="sticky top-24 bg-background-50 rounded-2xl border border-background-200/70 overflow-hidden">
      <div className="p-5 border-b border-background-100">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-foreground-950 flex items-center gap-2">
            <i className="ri-shopping-bag-3-line w-5 h-5 flex items-center justify-center text-primary-500" />
            O teu pedido
          </h3>
          {itemCount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold whitespace-nowrap">
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </span>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-background-100 flex items-center justify-center mb-4">
            <i className="ri-cake-3-line text-2xl text-foreground-300 w-8 h-8 flex items-center justify-center" />
          </div>
          <p className="text-sm text-foreground-500">O teu pedido está vazio.</p>
          <p className="text-xs text-foreground-400 mt-1">
            Escolhe os produtos ao lado e adiciona ao pedido.
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-background-100 max-h-[420px] overflow-y-auto">
            {items.map((item) => (
              <div key={item.cartId} className="p-4 flex gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-background-100">
                  <img
                    src={item.produtoImagem}
                    alt={item.produtoNome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground-900 leading-snug truncate">
                        {item.produtoNome}
                      </p>
                      <p className="text-xs text-foreground-500 mt-0.5">{item.variacao}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.cartId)}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-foreground-400 hover:text-foreground-700 hover:bg-background-100 transition-colors cursor-pointer flex-shrink-0"
                      title="Remover"
                    >
                      <i className="ri-delete-bin-6-line w-3.5 h-3.5 flex items-center justify-center" />
                    </button>
                  </div>
                  {item.mensagem && (
                    <p className="text-xs text-foreground-400 mt-1 italic truncate">
                      &quot;{item.mensagem}&quot;
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.cartId, item.quantidade - 1)}
                        disabled={item.quantidade <= 1}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-background-100 text-foreground-600 hover:bg-background-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <i className="ri-subtract-line w-3 h-3 flex items-center justify-center" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-foreground-900">
                        {item.quantidade}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.cartId, item.quantidade + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-background-100 text-foreground-600 hover:bg-background-200 transition-colors cursor-pointer"
                      >
                        <i className="ri-add-line w-3 h-3 flex items-center justify-center" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-primary-600 whitespace-nowrap">
                      {item.variacaoPreco}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-background-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground-700">Subtotal</span>
              <span className="font-heading text-xl font-bold text-primary-600">
                {hasPricedItems
                  ? `${subtotal.toFixed(2).replace(".", ",")} €`
                  : "Sob consulta"}
              </span>
            </div>
            {!hasPricedItems && subtotal > 0 && (
              <p className="text-xs text-foreground-500">Alguns produtos têm preço sob consulta.</p>
            )}
            <button
              type="button"
              onClick={onCheckout}
              className="w-full px-5 py-3.5 rounded-full bg-primary-500 text-background-50 text-sm font-bold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              <i className="ri-lock-line w-4 h-4 flex items-center justify-center" />
              Fechar pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
}