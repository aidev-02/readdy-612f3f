import { useState } from "react";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import { useCart } from "./hooks/useCart";
import type { AddToCartPayload } from "./hooks/useCart";
import ProductCatalog from "./components/ProductCatalog";
import CartPanel from "./components/CartPanel";
import CheckoutForm from "./components/CheckoutForm";
import { clearCheckoutPending } from "./hooks/checkoutPersistence";

export default function Encomenda() {
  const cart = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [nomeCliente, setNomeCliente] = useState("");

  const handleAddToCart = (payload: AddToCartPayload) => {
    cart.addItem(payload);
  };

  const handleCheckoutSuccess = (nome: string) => {
    setNomeCliente(nome);
    cart.clearCart();
    setPedidoEnviado(true);
    setShowCheckout(false);
    clearCheckoutPending();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewOrder = () => {
    setPedidoEnviado(false);
    setNomeCliente("");
    cart.clearCart();
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
              <a
                href="/catalogo"
                className="px-6 py-3 rounded-full bg-background-100 border border-background-200 text-foreground-700 text-sm font-semibold hover:bg-background-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Ver catálogo
              </a>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="pt-28 md:pt-36 pb-8 px-4 md:px-10">
            <div className="max-w-[1400px] mx-auto">
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-100/80 text-secondary-800 text-xs uppercase tracking-[0.24em] font-label whitespace-nowrap mb-4">
                  <i className="ri-shopping-bag-3-line w-3 h-3 flex items-center justify-center" />
                  Encomendar
                </span>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950">
                  {showCheckout ? "Finalizar encomenda" : "Faz a tua encomenda"}
                </h1>
                {!showCheckout && (
                  <p className="text-foreground-500 text-sm mt-2 max-w-lg mx-auto">
                    Escolhe os produtos, adiciona ao pedido e depois finaliza com os teus dados de contacto e entrega.
                  </p>
                )}
              </div>
            </div>
          </section>

          {!showCheckout ? (
            <section className="pb-24 px-4 md:px-10">
              <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2">
                    <ProductCatalog onAddToCart={handleAddToCart} />
                  </div>
                  <div className="lg:col-span-1">
                    <CartPanel
                      items={cart.items}
                      itemCount={cart.itemCount}
                      subtotal={cart.subtotal}
                      hasPricedItems={cart.hasPricedItems}
                      onRemoveItem={cart.removeItem}
                      onUpdateQty={cart.updateQuantidade}
                      onCheckout={() => {
                        setShowCheckout(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="pb-24 px-4 md:px-10">
              <div className="max-w-[1400px] mx-auto">
                <CheckoutForm
                  items={cart.items}
                  subtotal={cart.subtotal}
                  hasPricedItems={cart.hasPricedItems}
                  itemCount={cart.itemCount}
                  onBack={() => {
                    clearCheckoutPending();
                    setShowCheckout(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onSuccess={handleCheckoutSuccess}
                />
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </main>
  );
}