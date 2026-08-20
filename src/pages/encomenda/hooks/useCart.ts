import { useCartContext } from "./CartContext";
export type { CartItem, AddToCartPayload } from "./CartContext";

export function useCart() {
  return useCartContext();
}