/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */
export interface EncomendaItem {
  produto: string;
  variacao: string;
  quantidade: number;
  preco: string;
  mensagem: string;
  alergias: string[];
}

export interface Encomenda {
  id: number;
  nome: string;
  telefone: string | null;
  email: string;
  nif: string | null;
  tipo_entrega: string;
  data_entrega: string | null;
  horario: string | null;
  morada: string | null;
  notas: string | null;
  items: EncomendaItem[];
  subtotal: number | null;
  status: string;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Constantes de status                                               */
/* ------------------------------------------------------------------ */
export const STATUS_OPCOES = ["pendente", "confirmada", "em_preparo", "pronta", "em_entrega", "entregue", "devolvido", "cancelada", "Aguardando pagamento"];

export const STATUS_LABEL: Record<string, string> = {
  pendente: "A levantar",
  confirmada: "Confirmada",
  em_preparo: "Em preparo",
  pronta: "Pronta",
  em_entrega: "Em entrega",
  entregue: "Entregue",
  devolvido: "Devolvido",
  cancelada: "Cancelada",
  "Aguardando pagamento": "Aguardando pagamento",
};

export const STATUS_COLOR: Record<string, string> = {
  pendente: "bg-amber-100 text-amber-800 border-amber-200",
  confirmada: "bg-emerald-100 text-emerald-800 border-emerald-200",
  em_preparo: "bg-sky-100 text-sky-800 border-sky-200",
  pronta: "bg-indigo-100 text-indigo-800 border-indigo-200",
  em_entrega: "bg-violet-100 text-violet-800 border-violet-200",
  entregue: "bg-green-100 text-green-800 border-green-200",
  devolvido: "bg-rose-100 text-rose-800 border-rose-200",
  cancelada: "bg-red-100 text-red-800 border-red-200",
  "Aguardando pagamento": "bg-orange-100 text-orange-800 border-orange-200",
};

/* ------------------------------------------------------------------ */
/*  Helpers de Prazo de Entrega                                        */
/* ------------------------------------------------------------------ */

/** Formata horas decimais em HH:mm (ex: 48 → "48:00", 0.166 → "00:10") */
export const formatPrazoHoras = (horas: number): string => {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export interface PrazoInfo {
  display: string;
  percentConsumed: number;
  vencido: boolean;
}

/** Calcula o prazo total (em horas) entre a criação da encomenda e a data de entrega */
export const calcPrazoTotalEncomenda = (createdAt: string, dataEntrega: string | null): number | null => {
  if (!createdAt || !dataEntrega) return null;
  const created = new Date(createdAt);
  const entrega = new Date(dataEntrega);
  if (isNaN(created.getTime()) || isNaN(entrega.getTime())) return null;
  const totalMs = entrega.getTime() - created.getTime();
  const totalHoras = totalMs / (1000 * 60 * 60);
  if (totalHoras <= 0) return 0;
  return totalHoras;
};

/** Calcula tempo restante (HH:mm) e % consumido até à data de entrega */
export const calcPrazoRestante = (createdAt: string, dataEntrega: string | null): PrazoInfo | null => {
  if (!createdAt || !dataEntrega) return null;
  const now = new Date();
  const created = new Date(createdAt);
  const entrega = new Date(dataEntrega);
  if (isNaN(created.getTime()) || isNaN(entrega.getTime())) return null;
  const totalMs = entrega.getTime() - created.getTime();
  const totalHoras = totalMs / (1000 * 60 * 60);
  if (totalHoras <= 0) return { display: "00:00", percentConsumed: 100, vencido: true };
  const remainingMs = entrega.getTime() - now.getTime();
  const remainingHoras = remainingMs / (1000 * 60 * 60);
  const vencido = remainingHoras < 0;
  const percentConsumed = Math.min(100, Math.round(((totalHoras - remainingHoras) / totalHoras) * 100));
  const absRemaining = Math.abs(remainingHoras);
  const h = Math.floor(absRemaining);
  const m = Math.floor((absRemaining - h) * 60);
  const sign = vencido ? "-" : "";
  return {
    display: `${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    percentConsumed,
    vencido,
  };
};

/** Devolve as classes de cor de fundo com base na % consumida */
export const prazoBgClass = (pct: number): string => {
  if (pct < 50) return "bg-emerald-500/15 text-emerald-800";
  if (pct < 75) return "bg-amber-500/15 text-amber-800";
  return "bg-red-500/15 text-red-800";
};

/* ------------------------------------------------------------------ */
/*  Helpers de formatação                                              */
/* ------------------------------------------------------------------ */
export const formatDate = (d: string | null) => {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const formatDateTime = (d: string | null) => {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const totalItems = (items: EncomendaItem[]) =>
  items.reduce((sum, i) => sum + (i.quantidade || 0), 0);