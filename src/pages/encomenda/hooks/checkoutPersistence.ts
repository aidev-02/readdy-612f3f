export interface CheckoutPendingData {
  step: "payment" | "done";
  nome: string;
  telefone: string;
  email: string;
  nif: string;
  aniversario: string;
  tipoEntrega: string;
  dataEntrega: string;
  horario: string;
  cidade: string;
  morada: string;
  notas: string;
  encomendaId: number | null;
  selectedPayment: string | null;
  codigoPostal: string;
}

const CHECKOUT_KEY = "pastelaria_checkout_pending";

export function saveCheckoutPending(data: CheckoutPendingData): void {
  try {
    sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage might be full or unavailable
  }
}

export function getCheckoutPending(): CheckoutPendingData | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutPendingData;
  } catch {
    return null;
  }
}

export function clearCheckoutPending(): void {
  try {
    sessionStorage.removeItem(CHECKOUT_KEY);
  } catch {
    // ignore
  }
}