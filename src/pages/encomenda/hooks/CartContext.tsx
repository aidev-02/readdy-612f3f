import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

export interface CartItem {
  cartId: string;
  produtoId: string;
  produtoNome: string;
  produtoImagem: string;
  variacao: string;
  variacaoPreco: string;
  variacaoPrecoNumero: number | null;
  quantidade: number;
  mensagem: string;
  alergias: string[];
}

let cartCounter = 0;
function nextCartId(): string {
  cartCounter += 1;
  return `cart-${Date.now()}-${cartCounter}`;
}

export type AddToCartPayload = Omit<CartItem, "cartId">;

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hasPricedItems: boolean;
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (cartId: string) => void;
  updateQuantidade: (cartId: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((payload: AddToCartPayload) => {
    setItems((prev) => [...prev, { ...payload, cartId: nextCartId() }]);
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const updateQuantidade = useCallback((cartId: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantidade: qty } : i)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantidade, 0),
    [items],
  );

  const subtotal = useMemo(() => {
    let total = 0;
    items.forEach((i) => {
      if (i.variacaoPrecoNumero !== null) {
        total += i.variacaoPrecoNumero * i.quantidade;
      }
    });
    return total;
  }, [items]);

  const hasPricedItems = useMemo(
    () => items.some((i) => i.variacaoPrecoNumero !== null),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotal,
      hasPricedItems,
      addItem,
      removeItem,
      updateQuantidade,
      clearCart,
    }),
    [items, itemCount, subtotal, hasPricedItems, addItem, removeItem, updateQuantidade, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used within <CartProvider>");
  }
  return ctx;
}