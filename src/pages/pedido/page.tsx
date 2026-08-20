import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import { useCartContext } from "@/pages/encomenda/hooks/CartContext";
import { getCheckoutPending, clearCheckoutPending, type CheckoutPendingData } from "@/pages/encomenda/hooks/checkoutPersistence";
import CheckoutForm from "@/pages/encomenda/components/CheckoutForm";

export default function Pedido() {
  const cart = useCartContext();
  const [showCheckout, setShowCheckout] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [nomeCliente, setNomeCliente] = useState("");
  const [initialCheckoutData, setInitialCheckoutData] = useState<CheckoutPendingData | null>(null);

  // Ao montar a página, verifica se há um checkout pendente em sessionStorage
  useEffect(() => {
    const pending = getCheckoutPending();
    if (pending && pending.step === "payment" && cart.items.length > 0) {
      setInitialCheckoutData(pending);
      setShowCheckout(true);
    } else if (pending) {
      // Dados pendentes mas carrinho vazio — limpa
      clearCheckoutPending();
    }
  }, []); // só corre no mount

  const handleCheckoutSuccess = (nome: string) => {
    setNomeCliente(nome);
    cart.clearCart();
    setPedidoEnviado(true);
    setShowCheckout(false);
    setInitialCheckoutData(null);
    clearCheckoutPending();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewOrder = () => {
    setPedidoEnviado(false);
    setNomeCliente("");
    setInitialCheckoutData(null);
    clearCheckoutPending();
    cart.clearCart();
  };

  const handleBackFromCheckout = () => {
    setShowCheckout(false);
    setInitialCheckoutData(null);
    clearCheckoutPending();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <Header transparentOnTop={false} />

      {pedidoEnviado ? (
        <section className="pt-32 md:pt-40 pb-20 px-4 md:px-10">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-accent-100 flex items-center justify-center mb-6">
              <i className="ri-check-line text-3xl text-accent-600 w-8 h-8 flex items-center justify-center" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 mb-3">
              Encomenda enviada!
            </h1>
            <p className="text-foreground-600 text-sm leading-relaxed mb-8">
              Obrigado, <strong>{nomeCliente}</strong>! Recebemos a tua encomenda e vamos confirmar a disponibilidade.
              Receberás um email em breve com a confirmação e instrução de pagamento do sinal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleNewOrder}
                className="px-6 py-3 rounded-full bg-background-100 border border-background-200 text-foreground-700 text-sm font-semibold hover:bg-background-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Fazer novo pedido
              </button>
              <Link
                to="/catalogo"
                className="px-6 py-3 rounded-full bg-background-100 border border-background-200 text-foreground-700 text-sm font-semibold hover:bg-background-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Ver catálogo
              </Link>
            </div>
          </div>
        </section>
      ) : showCheckout ? (
        <section className="pt-28 md:pt-36 pb-24 px-4 md:px-10">
          <div className="max-w-[1400px] mx-auto">
            <CheckoutForm
              items={cart.items}
              subtotal={cart.subtotal}
              hasPricedItems={cart.hasPricedItems}
              itemCount={cart.itemCount}
              onBack={handleBackFromCheckout}
              onSuccess={handleCheckoutSuccess}
              initialData={initialCheckoutData}
            />
          </div>
        </section>
      ) : (
        <>
          <section className="pt-28 md:pt-36 pb-8 px-4 md:px-10">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-100/80 text-secondary-800 text-xs uppercase tracking-[0.24em] font-label whitespace-nowrap mb-3">
                    <i className="ri-shopping-bag-3-line w-3 h-3 flex items-center justify-center" />
                    O teu pedido
                  </span>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950">
                    {cart.items.length === 0
                      ? "Pedido vazio"
                      : `Reveja a sua encomenda`}
                  </h1>
                </div>
                {cart.items.length > 0 && (
                  <Link
                    to="/encomenda"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-background-100 border border-background-200 text-foreground-700 text-sm font-semibold hover:bg-background-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-add-line w-4 h-4 flex items-center justify-center" />
                    Continuar a comprar
                  </Link>
                )}
              </div>
            </div>
          </section>

          {cart.items.length === 0 ? (
            <section className="pb-24 px-4 md:px-10">
              <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 rounded-full bg-background-100 flex items-center justify-center mb-6">
                    <i className="ri-shopping-bag-3-line text-3xl text-foreground-300 w-10 h-10 flex items-center justify-center" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-foreground-800 mb-2">
                    Ainda não tens produtos no pedido
                  </h2>
                  <p className="text-sm text-foreground-500 max-w-md mb-8">
                    Navega pelo nosso catálogo e adiciona as tuas sobremesas favoritas ao pedido.
                  </p>
                  <Link
                    to="/encomenda"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary-500 text-background-50 text-sm font-bold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-cake-3-line w-4 h-4 flex items-center justify-center" />
                    Escolher sobremesas
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <section className="pb-24 px-4 md:px-10">
              <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 items-start">
                  {/* Cart items — wider column */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="rounded-2xl border border-background-200/70 bg-background-50 overflow-hidden">
                      <div className="p-5 border-b border-background-100 flex items-center justify-between">
                        <h3 className="font-heading text-base font-bold text-foreground-900 flex items-center gap-2">
                          <i className="ri-file-list-3-line w-5 h-5 flex items-center justify-center text-primary-500" />
                          Produtos no pedido
                        </h3>
                        <span className="px-2.5 py-1 rounded-full bg-background-100 text-foreground-600 text-xs font-semibold whitespace-nowrap">
                          {cart.itemCount} {cart.itemCount === 1 ? "item" : "itens"}
                        </span>
                      </div>
                      <div className="divide-y divide-background-100">
                        {cart.items.map((item) => (
                          <div
                            key={item.cartId}
                            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4"
                          >
                            {/* Image */}
                            <div className="w-full sm:w-20 h-32 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-background-100">
                              <img
                                src={item.produtoImagem}
                                alt={item.produtoNome}
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground-900 text-sm leading-snug">
                                  {item.produtoNome}
                                </p>
                                <p className="text-xs text-foreground-500 mt-1">{item.variacao}</p>
                                {item.mensagem && (
                                  <p className="text-xs text-foreground-400 mt-1.5 italic line-clamp-2">
                                    &quot;{item.mensagem}&quot;
                                  </p>
                                )}
                                {item.alergias.length > 0 && (
                                  <p className="text-xs text-accent-600 mt-1.5">
                                    Alergias: {item.alergias.join(", ")}
                                  </p>
                                )}
                              </div>
                              {/* Price + Qty + Remove */}
                              <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 flex-shrink-0">
                                <span className="text-base font-bold text-primary-600 whitespace-nowrap">
                                  {item.variacaoPreco}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        cart.updateQuantidade(item.cartId, item.quantidade - 1)
                                      }
                                      disabled={item.quantidade <= 1}
                                      className="w-7 h-7 flex items-center justify-center rounded-full bg-background-100 text-foreground-600 hover:bg-background-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                    >
                                      <i className="ri-subtract-line w-3 h-3 flex items-center justify-center" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-semibold text-foreground-900">
                                      {item.quantidade}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        cart.updateQuantidade(item.cartId, item.quantidade + 1)
                                      }
                                      className="w-7 h-7 flex items-center justify-center rounded-full bg-background-100 text-foreground-600 hover:bg-background-200 transition-colors cursor-pointer"
                                    >
                                      <i className="ri-add-line w-3 h-3 flex items-center justify-center" />
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => cart.removeItem(item.cartId)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full text-foreground-400 hover:text-primary-600 hover:bg-background-100 transition-colors cursor-pointer"
                                    title="Remover"
                                  >
                                    <i className="ri-delete-bin-6-line w-4 h-4 flex items-center justify-center" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Summary sidebar */}
                  <div className="lg:col-span-3">
                    <div className="sticky top-24 space-y-6">
                      <div className="rounded-2xl border border-background-200/70 bg-background-50 overflow-hidden">
                        <div className="p-5 border-b border-background-100">
                          <h3 className="font-heading text-lg font-bold text-foreground-950 flex items-center gap-2">
                            <i className="ri-calculator-line w-5 h-5 flex items-center justify-center text-primary-500" />
                            Resumo
                          </h3>
                        </div>
                        <div className="p-5 space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground-600">Nº de produtos</span>
                            <span className="font-semibold text-foreground-900">
                              {cart.items.length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground-600">Total de itens</span>
                            <span className="font-semibold text-foreground-900">
                              {cart.itemCount}
                            </span>
                          </div>
                          <div className="border-t border-background-100 pt-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground-700">
                                Subtotal estimado
                              </span>
                              <span className="font-heading text-xl font-bold text-primary-600">
                                {cart.hasPricedItems
                                  ? `${cart.subtotal.toFixed(2).replace(".", ",")} €`
                                  : "Sob consulta"}
                              </span>
                            </div>
                            {!cart.hasPricedItems && cart.subtotal > 0 && (
                              <p className="text-xs text-foreground-500 mt-1.5">
                                Alguns produtos têm preço sob consulta.
                              </p>
                            )}
                            <p className="text-xs text-foreground-400 mt-2">
                              O valor exato e instrução de sinal serão confirmados por email após o envio do pedido.
                            </p>
                          </div>
                        </div>
                        <div className="p-5 border-t border-background-100">
                          <button
                            type="button"
                            onClick={() => {
                              setShowCheckout(true);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="w-full px-5 py-4 rounded-full bg-primary-500 text-background-50 text-sm font-bold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                          >
                            <i className="ri-lock-line w-4 h-4 flex items-center justify-center" />
                            Finalizar pedido
                          </button>
                          <Link
                            to="/encomenda"
                            className="mt-3 w-full px-5 py-3 rounded-full bg-background-100 border border-background-200 text-foreground-600 text-sm font-medium hover:bg-background-200 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                          >
                            <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center" />
                            Voltar ao catálogo
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </main>
  );
}