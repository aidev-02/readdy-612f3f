import { useState, useMemo, useEffect, useCallback, useRef, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../hooks/useCart";
import { useCartContext } from "../hooks/CartContext";
import { supabase } from "@/lib/supabase";
import { saveCheckoutPending, clearCheckoutPending, type CheckoutPendingData } from "../hooks/checkoutPersistence";
import QRCodeLib from "qrcode";

interface CheckoutFormProps {
  items: CartItem[];
  subtotal: number;
  hasPricedItems: boolean;
  itemCount: number;
  onBack: () => void;
  onSuccess: (nome: string) => void;
  initialData?: CheckoutPendingData | null;
}

function gerarFaixasHorarias(abertura: string, fecho: string): string[] {
  const [aH, aM] = abertura.split(":").map(Number);
  const [fH, fM] = fecho.split(":").map(Number);
  const inicioMin = aH * 60 + aM;
  const fimMin = fH * 60 + fM;
  const faixas: string[] = [];
  for (let m = inicioMin; m + 120 <= fimMin; m += 120) {
    const slotInicio = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    const slotFim = `${String(Math.floor((m + 120) / 60)).padStart(2, "0")}:${String((m + 120) % 60).padStart(2, "0")}`;
    faixas.push(`${slotInicio} — ${slotFim}`);
  }
  return faixas;
}

const FORM_URL = "https://readdy.ai/api/form/d9f9sqfrf0c7mtq830s0";

const PAYMENT_METHODS = [
  {
    id: "multibanco",
    label: "Multibanco",
    icon: "ri-bank-line",
    description: "Receberá a referência por email para pagar num ATM.",
  },
  {
    id: "mbway",
    label: "MBWay",
    icon: "ri-smartphone-line",
    description: "Receberá a solicitação no número de telefone indicado.",
  },
  {
    id: "cartao",
    label: "Cartão de Crédito",
    icon: "ri-secure-payment-line",
    description: "Pagamento seguro por cartão de crédito ou débito.",
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: "ri-money-dollar-circle-line",
    description: "Será redirecionado para o PayPal para concluir o pagamento.",
  },
  {
    id: "transferencia",
    label: "Transferência Bancária",
    icon: "ri-exchange-line",
    description: "Receberá o IBAN por email para transferência bancária.",
  },
];

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getMaxDays(mes: number): number {
  if (mes === 2) return 29;
  if ([4, 6, 9, 11].includes(mes)) return 30;
  return 31;
}

// Mapeamento CP → cidade (partilhado com DadosOperacao)
const CP_CIDADE_MAP: Record<string, string> = {
  "1000": "Lisboa", "1100": "Lisboa", "1200": "Lisboa", "1300": "Lisboa",
  "1400": "Lisboa", "1500": "Lisboa", "1600": "Lisboa", "1700": "Lisboa",
  "1800": "Lisboa", "1900": "Lisboa", "2000": "Santarém", "2100": "Santarém",
  "2200": "Santarém", "2300": "Tomar", "2400": "Leiria",
  "2500": "Caldas da Rainha", "2600": "Vila Franca de Xira",
  "2700": "Amadora", "2800": "Almada", "2900": "Setúbal",
  "3000": "Coimbra", "3100": "Pombal", "3200": "Lousã",
  "3400": "Oliveira do Hospital", "3500": "Viseu", "3600": "Castro Daire",
  "3700": "São João da Madeira", "3800": "Aveiro", "3900": "Aveiro",
  "4000": "Porto", "4100": "Porto", "4200": "Porto", "4300": "Porto",
  "4400": "Vila Nova de Gaia", "4420": "Gondomar", "4440": "Valongo",
  "4450": "Matosinhos", "4470": "Maia", "4480": "Vila do Conde",
  "4490": "Póvoa de Varzim", "4500": "Espinho",
  "4520": "Santa Maria da Feira", "4600": "Amarante", "4700": "Braga",
  "4800": "Guimarães", "4900": "Viana do Castelo", "5000": "Vila Real",
  "5100": "Lamego", "5300": "Bragança", "5400": "Chaves",
  "6000": "Castelo Branco", "6200": "Covilhã", "6300": "Guarda",
  "7000": "Évora", "7100": "Estremoz", "7200": "Reguengos de Monsaraz",
  "7300": "Portalegre", "7500": "Santiago do Cacém",
  "7600": "Aljustrel", "7700": "Almodôvar", "7800": "Beja",
  "8000": "Faro", "8100": "Loulé", "8200": "Albufeira", "8300": "Silves",
  "8400": "Lagoa", "8500": "Portimão", "8600": "Lagos", "8700": "Olhão",
  "8800": "Tavira", "8900": "Vila Real de Santo António",
  "9000": "Funchal", "9100": "Santa Cruz", "9200": "Machico",
  "9300": "Câmara de Lobos", "9400": "Porto Santo",
};

function inferirCidade(codigoPostal: string): string {
  const prefixo = codigoPostal.replace(/\s/g, "").slice(0, 4);
  return CP_CIDADE_MAP[prefixo] || "";
}

// Fórmula de Haversine para calcular distancia entre duas coordenadas (em km)
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Coordenadas da Manger.pt (Rua Machado dos Santos, 593, 4400-209 Vila Nova de Gaia)
const MANGER_LAT = 41.1223;
const MANGER_LON = -8.5987;

export default function CheckoutForm({
  items,
  subtotal,
  hasPricedItems,
  itemCount,
  onBack,
  onSuccess,
  initialData,
}: CheckoutFormProps) {
  const navigate = useNavigate();
  const cartContext = useCartContext();
  const [nome, setNome] = useState(initialData?.nome ?? "");
  const [telefone, setTelefone] = useState(initialData?.telefone ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [nif, setNif] = useState(initialData?.nif ?? "");
  const [diaAniversario, setDiaAniversario] = useState(
    initialData?.aniversario ? initialData.aniversario.split("/")[0] : "",
  );
  const [mesAniversario, setMesAniversario] = useState(
    initialData?.aniversario ? initialData.aniversario.split("/")[1] : "",
  );
  const [aniversarioError, setAniversarioError] = useState("");
  const diaRef = useRef<HTMLSelectElement>(null);
  const [tipoEntrega, setTipoEntrega] = useState(initialData?.tipoEntrega ?? "levantamento");
  const [dataEntrega, setDataEntrega] = useState(initialData?.dataEntrega ?? "");
  const [horario, setHorario] = useState(initialData?.horario ?? "");
  const [cidade, setCidade] = useState(initialData?.cidade ?? "");
  const [codigoPostal, setCodigoPostal] = useState(initialData?.codigoPostal ?? "");
  const [morada, setMorada] = useState(initialData?.morada ?? "");
  const [notas, setNotas] = useState(initialData?.notas ?? "");
  const [aceitouTermos, setAceitouTermos] = useState(false);

  // CP lookup states
  const [cpLoading, setCpLoading] = useState(false);
  const [cpStatus, setCpStatus] = useState<"idle" | "loading" | "found" | "not_found_nearby" | "not_found_far">("idle");
  const [cpMessage, setCpMessage] = useState("");
  const [taxaEntregaValor, setTaxaEntregaValor] = useState("");
  const [isencaoTaxaValor, setIsencaoTaxaValor] = useState("");

  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [diaInativo, setDiaInativo] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"idle" | "selecting" | "qr">(
    initialData?.step === "payment" ? "selecting" : "idle",
  );
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [savingPayment, setSavingPayment] = useState(false);
  const [encomendaId, setEncomendaId] = useState<number | null>(initialData?.encomendaId ?? null);
  const [showPaymentError, setShowPaymentError] = useState("");

  // Dados bancários reais
  const [dadosBancarios, setDadosBancarios] = useState<{ entidade: string; referencia_multibanco: string; iban: string } | null>(null);

  const hoje = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  }, []);

  // Computed aniversario string
  const aniversario = diaAniversario && mesAniversario
    ? `${diaAniversario}/${mesAniversario}`
    : "";

  const handleDiaChange = (dia: string) => {
    setDiaAniversario(dia);
    setAniversarioError("");
    if (dia && mesAniversario) {
      const mes = parseInt(mesAniversario, 10);
      if (parseInt(dia, 10) > getMaxDays(mes)) {
        setAniversarioError("Dia inválido para o mês selecionado");
        setTimeout(() => diaRef.current?.focus(), 0);
      }
    }
  };

  const handleMesChange = (mes: string) => {
    setMesAniversario(mes);
    setAniversarioError("");
    if (diaAniversario && mes) {
      const m = parseInt(mes, 10);
      if (parseInt(diaAniversario, 10) > getMaxDays(m)) {
        setAniversarioError("Dia inválido para o mês selecionado");
        setTimeout(() => diaRef.current?.focus(), 0);
      }
    }
  };

  const canSubmit = useMemo(() => {
    const clienteOk = nome.trim() !== "" && telefone.trim() !== "" && email.trim() !== "";
    const entregaOk = dataEntrega !== "" && horario !== ""
      && (tipoEntrega !== "delivery" || (codigoPostal.trim() !== "" && cidade.trim() !== "" && morada.trim() !== "" && cpStatus !== "not_found_far"));
    const termosOk = tipoEntrega === "levantamento" || aceitouTermos;
    return clienteOk && entregaOk && termosOk && items.length > 0;
  }, [nome, telefone, email, dataEntrega, horario, tipoEntrega, cidade, morada, codigoPostal, aceitouTermos, items, cpStatus]);

  const fetchTimeSlots = useCallback(async () => {
    if (!dataEntrega) {
      setTimeSlots([]);
      setDiaInativo(false);
      return;
    }
    const [y, m, d] = dataEntrega.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const diaSemana = date.getDay();

    setSlotsLoading(true);
    setDiaInativo(false);
    try {
      const { data, error } = await supabase
        .from("horarios_funcionamento")
        .select("ativo, encomendas_abertura, encomendas_fecho, levantamento_abertura, levantamento_fecho")
        .eq("dia_semana", diaSemana)
        .maybeSingle();

      if (error) throw error;

      if (!data || !data.ativo) {
        setTimeSlots([]);
        setDiaInativo(true);
        return;
      }

      const abertura =
        tipoEntrega === "levantamento"
          ? data.levantamento_abertura
          : data.encomendas_abertura;
      const fecho =
        tipoEntrega === "levantamento"
          ? data.levantamento_fecho
          : data.encomendas_fecho;

      if (!abertura || !fecho) {
        setTimeSlots([]);
        setDiaInativo(true);
        return;
      }

      const faixas = gerarFaixasHorarias(abertura, fecho);
      setTimeSlots(faixas);
    } catch {
      setTimeSlots([]);
      setDiaInativo(true);
    } finally {
      setSlotsLoading(false);
    }
  }, [dataEntrega, tipoEntrega]);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  useEffect(() => {
    setHorario("");
  }, [dataEntrega, tipoEntrega]);

  // Fetch real bank data
  useEffect(() => {
    async function fetchDadosBancarios() {
      try {
        const { data, error } = await supabase
          .from("dados_bancarios")
          .select("entidade, referencia_multibanco, iban")
          .eq("id", 1)
          .maybeSingle();

        if (!error && data) {
          setDadosBancarios(data);
        }
      } catch {
        // silently fail, fallback to generic descriptions
      }
    }
    fetchDadosBancarios();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    setFormStatus("submitting");
    setFormError("");

    const formEl = e.currentTarget;
    const honeypotEl = formEl.querySelector<HTMLInputElement>('input[name="company_alt"]');
    if (honeypotEl && honeypotEl.value.trim() !== "") {
      onSuccess(nome);
      return;
    }

    try {
      const fd = new FormData(formEl);

      // Guarda os dados do checkout em sessionStorage (sem inserir na BD ainda)
      const pendingData: CheckoutPendingData = {
        step: "payment",
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim(),
        nif: nif.trim() || "",
        aniversario: aniversario.trim() || "",
        tipoEntrega,
        dataEntrega: dataEntrega || "",
        horario: horario || "",
        cidade: cidade.trim(),
        morada: morada.trim() || "",
        notas: notas.trim() || "",
        encomendaId: null,
        selectedPayment: null,
        codigoPostal: codigoPostal.trim(),
      };
      saveCheckoutPending(pendingData);

      // POST ao formulário de contacto (tracking)
      const res = await fetch(FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(fd as unknown as Record<string, string>).toString(),
      });
      const responseText = await res.text();
      let parsed: Record<string, unknown> = {};
      try {
        parsed = JSON.parse(responseText);
      } catch {
        // raw response
      }

      if (res.ok && (parsed as { code?: string }).code === "OK") {
        setPaymentStep("selecting");
        setFormStatus("idle");
      } else {
        const serverMsg =
          (parsed as { meta?: { message?: string } }).meta?.message ||
          (parsed as { message?: string }).message ||
          responseText;
        // Apesar de erro no form, guardamos os dados e mostramos pagamento
        if (typeof serverMsg === "string" && serverMsg.includes("spam")) {
          setPaymentStep("selecting");
          setFormStatus("idle");
        } else {
          setPaymentStep("selecting");
          setFormStatus("idle");
        }
      }
    } catch {
      // Mesmo com erro de rede, guardamos os dados e mostramos pagamento
      setPaymentStep("selecting");
      setFormStatus("idle");
    }
  };

  const handlePaymentSelect = async (method: string) => {
    setSelectedPayment(method);
    setSavingPayment(true);
    setShowPaymentError("");

    try {
      // Build items array for DB
      const itemsParaBD = items.map((item) => ({
        produto: item.produtoNome,
        variacao: item.variacao,
        quantidade: item.quantidade,
        preco: item.variacaoPreco,
        mensagem: item.mensagem || "",
        alergias: item.alergias,
      }));

      // Só agora insere na BD com status "Aguardando pagamento"
      const { data: encomendaData, error: dbError } = await supabase.from("encomendas").insert({
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim(),
        nif: nif.trim() || null,
        aniversario: aniversario.trim() || null,
        tipo_entrega: tipoEntrega,
        data_entrega: dataEntrega || null,
        horario: horario || null,
        cidade: cidade.trim() || null,
        morada: morada.trim() || null,
        codigo_postal: codigoPostal.trim() || null,
        notas: notas.trim() || null,
        items: itemsParaBD,
        subtotal: hasPricedItems ? subtotal : null,
        status: "Aguardando pagamento",
        metodo_pagamento: method,
      }).select("id").single();

      if (dbError) {
        // eslint-disable-next-line no-console
        console.error("Erro ao gravar encomenda:", dbError);
        setShowPaymentError("Erro ao registar o pedido. Tenta novamente.");
        setSavingPayment(false);
        return;
      }

      const novoEncomendaId = encomendaData?.id ?? null;
      setEncomendaId(novoEncomendaId);

      // Atualiza sessionStorage com o encomendaId
      const pendingData: CheckoutPendingData = {
        step: "payment",
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim(),
        nif: nif.trim() || "",
        aniversario: aniversario.trim() || "",
        tipoEntrega,
        dataEntrega: dataEntrega || "",
        horario: horario || "",
        cidade: cidade.trim(),
        morada: morada.trim() || "",
        notas: notas.trim() || "",
        encomendaId: novoEncomendaId,
        selectedPayment: method,
        codigoPostal: codigoPostal.trim(),
      };
      saveCheckoutPending(pendingData);

      // Generate QR code for pickup
      const basePath = (window as any).__BASE_PATH__ || "";
      const pathPrefix = basePath ? `/${String(basePath).replace(/^\/|\/$/g, "")}` : "";
      const qrUrl = `${window.location.origin}${pathPrefix}/levantamento?fields=nome,telemovel,email,aniversario,nif`;
      const dataUrl = await QRCodeLib.toDataURL(qrUrl, { width: 260, margin: 2, color: { dark: "#1a1a1a", light: "#ffffff" } });
      setQrCodeDataUrl(dataUrl);
      setShowQrCode(true);
      setPaymentStep("qr");
    } catch {
      setShowPaymentError("Erro ao processar. Tenta novamente.");
    } finally {
      setSavingPayment(false);
    }
  };

  const handleCancelOrder = async () => {
    // Se já existe registo na BD, apaga-o
    if (encomendaId) {
      try {
        await supabase.from("encomendas").delete().eq("id", encomendaId);
      } catch {
        // eslint-disable-next-line no-console
        console.error("Erro ao cancelar encomenda");
      }
    }

    // Limpa sessionStorage
    clearCheckoutPending();

    // Limpa o carrinho
    cartContext.clearCart();

    // Navega para a página de encomendas
    navigate("/encomenda");
  };

  const formatDataVisivel = (d: string) => {
    if (!d) return "—";
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  return (
    <div className="space-y-0">
      <form onSubmit={handleSubmit} data-readdy-form noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background-100 text-foreground-600 hover:bg-background-200 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center" />
              </button>
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">
                  Fechar pedido
                </h2>
                <p className="text-sm text-foreground-500 mt-0.5">
                  Preenche os dados para finalizares a encomenda.
                </p>
              </div>
            </div>

            {/* Customer data */}
            <section className="rounded-2xl border border-background-200/70 bg-background-50 p-6 space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h3 className="font-heading text-lg font-bold text-foreground-900">Os teus dados</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="chk_nome" className="block text-sm font-semibold text-foreground-800 mb-1.5">
                    Nome completo <span className="text-primary-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="chk_nome"
                    name="nome"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                    placeholder="O teu nome"
                  />
                </div>
                <div>
                  <label htmlFor="chk_telefone" className="block text-sm font-semibold text-foreground-800 mb-1.5">
                    Telefone <span className="text-primary-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="chk_telefone"
                    name="telefone"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                    placeholder="+351 9XX XXX XXX"
                  />
                </div>
                <div>
                  <label htmlFor="chk_email" className="block text-sm font-semibold text-foreground-800 mb-1.5">
                    Email <span className="text-primary-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="chk_email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                    placeholder="ola@exemplo.pt"
                  />
                </div>
                <div>
                  <label htmlFor="chk_nif" className="block text-sm font-semibold text-foreground-800 mb-1.5">
                    NIF (opcional)
                  </label>
                  <input
                    type="text"
                    id="chk_nif"
                    name="nif"
                    value={nif}
                    onChange={(e) => setNif(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                    placeholder="123456789"
                    maxLength={9}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-800 mb-1.5">
                    Dia/mês de aniversário (opcional)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      ref={diaRef}
                      value={diaAniversario}
                      onChange={(e) => handleDiaChange(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-background-50 border text-foreground-950 text-sm focus:outline-none focus:ring-2 transition-colors appearance-none ${
                        aniversarioError
                          ? "border-primary-500 focus:border-primary-500 focus:ring-primary-100"
                          : "border-background-200 focus:border-primary-400 focus:ring-primary-100"
                      }`}
                    >
                      <option value="">Dia</option>
                      {Array.from({ length: mesAniversario ? getMaxDays(parseInt(mesAniversario, 10)) : 31 }, (_, i) => {
                        const d = String(i + 1).padStart(2, "0");
                        return <option key={d} value={d}>{d}</option>;
                      })}
                    </select>
                    <select
                      value={mesAniversario}
                      onChange={(e) => handleMesChange(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-background-50 border text-foreground-950 text-sm focus:outline-none focus:ring-2 transition-colors appearance-none ${
                        aniversarioError
                          ? "border-primary-500 focus:border-primary-500 focus:ring-primary-100"
                          : "border-background-200 focus:border-primary-400 focus:ring-primary-100"
                      }`}
                    >
                      <option value="">Mês</option>
                      {MESES.map((nome, idx) => {
                        const val = String(idx + 1).padStart(2, "0");
                        return <option key={val} value={val}>{nome}</option>;
                      })}
                    </select>
                  </div>
                  {aniversarioError && (
                    <p className="text-xs text-primary-600 mt-1.5 flex items-center gap-1">
                      <i className="ri-error-warning-line w-3.5 h-3.5 flex items-center justify-center" />
                      {aniversarioError}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section className="rounded-2xl border border-background-200/70 bg-background-50 p-6 space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h3 className="font-heading text-lg font-bold text-foreground-900">Entrega</h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-800 mb-3">
                  Tipo de entrega <span className="text-primary-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      tipoEntrega === "levantamento"
                        ? "border-primary-500 bg-primary-50/50"
                        : "border-background-200 bg-background-50 hover:border-background-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipo_entrega"
                      value="levantamento"
                      checked={tipoEntrega === "levantamento"}
                      onChange={() => setTipoEntrega("levantamento")}
                      className="w-4 h-4 accent-primary-500"
                    />
                    <div>
                      <span className="block text-sm font-semibold text-foreground-800">Levantamento na loja</span>
                      <span className="block text-xs text-foreground-500 mt-0.5">Grátis</span>
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      tipoEntrega === "delivery"
                        ? "border-primary-500 bg-primary-50/50"
                        : "border-background-200 bg-background-50 hover:border-background-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipo_entrega"
                      value="delivery"
                      checked={tipoEntrega === "delivery"}
                      onChange={() => setTipoEntrega("delivery")}
                      className="w-4 h-4 accent-primary-500"
                    />
                    <div>
                      <span className="block text-sm font-semibold text-foreground-800">Delivery</span>
                      <span className="block text-xs text-foreground-500 mt-0.5">Taxa conforme zona</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="chk_data" className="block text-sm font-semibold text-foreground-800 mb-1.5">
                    {tipoEntrega === "levantamento" ? "Data prevista para o Levantamento" : "Data de entrega"} <span className="text-primary-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="chk_data"
                    name="data_entrega"
                    required
                    min={hoje}
                    value={dataEntrega}
                    onChange={(e) => setDataEntrega(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="chk_horario" className="block text-sm font-semibold text-foreground-800 mb-1.5">
                    {tipoEntrega === "levantamento" ? "Horário previsto" : "Horário"} <span className="text-primary-500">*</span>
                  </label>
                  <select
                    id="chk_horario"
                    name="horario"
                    required
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors appearance-none"
                  >
                    <option value="">
                      {slotsLoading
                        ? "A carregar horários..."
                        : diaInativo
                          ? "Sem atendimento neste dia"
                          : timeSlots.length === 0
                            ? "Sem horários disponíveis"
                            : "Seleciona um horário"}
                    </option>
                    {timeSlots.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {tipoEntrega === "delivery" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="chk_cp" className="block text-sm font-semibold text-foreground-800 mb-1.5">
                        Código Postal <span className="text-primary-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="chk_cp"
                        name="codigo_postal"
                        required={tipoEntrega === "delivery"}
                        value={codigoPostal}
                        onChange={async (e) => {
                          const cp = e.target.value;
                          setCodigoPostal(cp);
                          setCpStatus("idle");
                          setCpMessage("");
                          setTaxaEntregaValor("");
                          setIsencaoTaxaValor("");

                          const cpLimpo = cp.replace(/\s/g, "");
                          // Só dispara quando o CP está completo (7+ dígitos: XXXX-XXX)
                          if (cpLimpo.length >= 7) {
                            setCpLoading(true);
                            setCpStatus("loading");

                            try {
                              // 1. Chamar api.geoapi.pt para obter cidade e coordenadas
                              const geoRes = await fetch(`https://api.geoapi.pt/cp/${cpLimpo}`);
                              if (!geoRes.ok) throw new Error("CP não encontrado");
                              const geoData = await geoRes.json();

                              const cp4 = geoData.CP4 || cpLimpo.slice(0, 4);
                              const concelho: string = geoData.Concelho || "";

                              // 2. Procurar zona pelos 4 primeiros dígitos em admin_zonas_entrega
                              const { data: zona } = await supabase
                                .from("admin_zonas_entrega")
                                .select("cidade, taxa_entrega, isencao_taxa")
                                .ilike("codigo_postal", `${cp4}%`)
                                .limit(1)
                                .maybeSingle();

                              if (zona) {
                                // Zona encontrada! Preencher cidade e taxas
                                setCidade(concelho || zona.cidade);
                                setTaxaEntregaValor(zona.taxa_entrega || "");
                                setIsencaoTaxaValor(zona.isencao_taxa || "");
                                setCpStatus("found");
                              } else {
                                // Zona NÃO encontrada — verificar distancia
                                const userLat = parseFloat(geoData.centro) || 0;
                                const userLon = parseFloat(geoData.centro2) || 0;

                                // Preencher cidade com o que temos da API
                                if (concelho) setCidade(concelho);

                                if (userLat && userLon) {
                                  const dist = haversineDistance(userLat, userLon, MANGER_LAT, MANGER_LON);
                                  if (dist <= 80) {
                                    setCpStatus("not_found_nearby");
                                    setCpMessage(
                                      "Não temos sua zona cadastrada como zona de entrega, mas por estar dentro do raio de 80km de distância, podemos entregar na sua morada. Entre em contato conosco para conhecer o valor da taxa de entrega.",
                                    );
                                  } else {
                                    setCpStatus("not_found_far");
                                    setCpMessage("Não entregamos na sua morada.");
                                  }
                                } else {
                                  // Sem coordenadas, assume que está longe
                                  setCpStatus("not_found_far");
                                  setCpMessage("Não entregamos na sua morada.");
                                }
                              }
                            } catch {
                              // Fallback: mapa local CP → cidade
                              const cidadeFallback = inferirCidade(cp);
                              if (cidadeFallback) {
                                setCidade(cidadeFallback);
                                // Tentar match por prefixo na BD mesmo assim
                                try {
                                  const cp4 = cpLimpo.slice(0, 4);
                                  const { data: zona } = await supabase
                                    .from("admin_zonas_entrega")
                                    .select("cidade, taxa_entrega, isencao_taxa")
                                    .ilike("codigo_postal", `${cp4}%`)
                                    .limit(1)
                                    .maybeSingle();
                                  if (zona) {
                                    setTaxaEntregaValor(zona.taxa_entrega || "");
                                    setIsencaoTaxaValor(zona.isencao_taxa || "");
                                    setCpStatus("found");
                                  } else {
                                    setCpStatus("idle");
                                  }
                                } catch {
                                  setCpStatus("idle");
                                }
                              } else {
                                setCpStatus("idle");
                              }
                            } finally {
                              setCpLoading(false);
                            }
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                        placeholder="Ex: 4000-001"
                        maxLength={8}
                      />
                    </div>
                    <div>
                      <label htmlFor="chk_cidade" className="block text-sm font-semibold text-foreground-800 mb-1.5">
                        Cidade <span className="text-primary-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="chk_cidade"
                        name="cidade"
                        required={tipoEntrega === "delivery"}
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                        placeholder="Preenchido automaticamente"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="chk_morada" className="block text-sm font-semibold text-foreground-800 mb-1.5">
                      Morada <span className="text-primary-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="chk_morada"
                      name="morada"
                      required={tipoEntrega === "delivery"}
                      value={morada}
                      onChange={(e) => setMorada(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                      placeholder="Ex: Rua Machado dos Santos, 593 loja 1"
                    />
                  </div>

                  {/* CP Status Feedback */}
                  {cpLoading && (
                    <div className="flex items-center gap-2 py-2">
                      <i className="ri-loader-4-line w-4 h-4 flex items-center justify-center animate-spin text-primary-500" />
                      <span className="text-sm text-foreground-500">A verificar código postal...</span>
                    </div>
                  )}

                  {cpStatus === "found" && !cpLoading && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <i className="ri-check-line w-4 h-4 flex items-center justify-center text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-800">Zona de entrega encontrada</span>
                      </div>
                      {isencaoTaxaValor && (
                        <p className="text-sm text-emerald-700">
                          <strong>Isenção de taxa</strong> para pedidos acima de: <strong>{isencaoTaxaValor} €</strong>
                        </p>
                      )}
                      {taxaEntregaValor && (
                        <p className="text-sm text-emerald-700">
                          <strong>Taxa de entrega:</strong> <strong>{taxaEntregaValor}</strong>
                        </p>
                      )}
                      {!isencaoTaxaValor && !taxaEntregaValor && (
                        <p className="text-sm text-emerald-700">Entrega disponível para esta zona.</p>
                      )}
                    </div>
                  )}

                  {cpStatus === "not_found_nearby" && !cpLoading && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                      <i className="ri-information-line w-5 h-5 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800 leading-relaxed">{cpMessage}</p>
                    </div>
                  )}

                  {cpStatus === "not_found_far" && !cpLoading && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                      <i className="ri-close-circle-line w-5 h-5 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800 font-medium">{cpMessage}</p>
                    </div>
                  )}
                </>
              )}

              {tipoEntrega !== "levantamento" && (
                <div>
                  <label htmlFor="chk_notas" className="block text-sm font-semibold text-foreground-800 mb-1.5">
                    Notas adicionais (opcional)
                  </label>
                  <textarea
                    id="chk_notas"
                    name="notas"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    maxLength={500}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200 text-foreground-950 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors resize-none"
                    placeholder="Ex: Porta 3, código do prédio..."
                  />
                  <p className="text-xs text-foreground-400 mt-1">{notas.length}/500</p>
                </div>
              )}
            </section>

            {/* Terms — only for delivery */}
            {tipoEntrega !== "levantamento" && (
              <label className="flex items-start gap-3 p-4 rounded-xl bg-background-100 border border-background-200/70 cursor-pointer">
                <input
                  type="checkbox"
                  name="aceito_termos"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-primary-500"
                />
                <span className="text-sm text-foreground-600 leading-relaxed">
                  Confirmo que li e aceito as{" "}
                  <a href="/termos" className="text-primary-600 underline hover:text-primary-700">
                    condições de encomenda
                  </a>
                  , a política de antecedência mínima e a necessidade de pagamento de sinal para confirmação.
                </span>
              </label>
            )}
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-background-200/70 bg-background-50 overflow-hidden">
                <div className="p-5 border-b border-background-100">
                  <h3 className="font-heading text-lg font-bold text-foreground-950 flex items-center gap-2">
                    <i className="ri-file-list-3-line w-5 h-5 flex items-center justify-center text-primary-500" />
                    Resumo do pedido
                  </h3>
                  <p className="text-xs text-foreground-500 mt-0.5">
                    {itemCount} {itemCount === 1 ? "item" : "itens"} no pedido
                  </p>
                </div>
                <div className="divide-y divide-background-100 max-h-[360px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.cartId} className="p-4 flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-background-100">
                        <img
                          src={item.produtoImagem}
                          alt={item.produtoNome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground-900 leading-snug truncate">
                          {item.produtoNome}
                        </p>
                        <p className="text-xs text-foreground-500">{item.variacao}</p>
                        <p className="text-xs text-foreground-400">Qtd: {item.quantidade}</p>
                        {item.alergias.length > 0 && (
                          <p className="text-xs text-accent-600 mt-0.5">
                            Alergias: {item.alergias.join(", ")}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-primary-600 whitespace-nowrap">
                        {item.variacaoPreco}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-5 border-t border-background-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground-600">Subtotal</span>
                    <span className="font-heading text-lg font-bold text-primary-600">
                      {hasPricedItems
                        ? `${subtotal.toFixed(2).replace(".", ",")} €`
                        : "Sob consulta"}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-400">
                    O valor exato e instrução de sinal serão confirmados por email.
                  </p>
                </div>
              </div>

              {formStatus === "error" && formError && (
                <div className="p-4 rounded-xl bg-primary-50 border border-primary-200 text-sm text-primary-700 flex items-start gap-3">
                  <i className="ri-error-warning-line w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Step 1: Submit button */}
              {paymentStep === "idle" && (
                <button
                  type="submit"
                  disabled={!canSubmit || formStatus === "submitting"}
                  className={`w-full px-5 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap transition-all ${
                    canSubmit && formStatus !== "submitting"
                      ? "bg-primary-500 text-background-50 hover:bg-primary-600"
                      : "bg-primary-300 text-background-50/70 cursor-not-allowed"
                  }`}
                >
                  {formStatus === "submitting" ? (
                    <>
                      <i className="ri-loader-4-line w-4 h-4 flex items-center justify-center animate-spin" />
                      A enviar encomenda...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center" />
                      Confirmar encomenda
                    </>
                  )}
                </button>
              )}

              {/* Step 2: Payment method selection */}
              {paymentStep === "selecting" && (
                <div className="rounded-2xl border border-background-200/70 bg-background-50 p-5 space-y-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-accent-100 flex items-center justify-center mb-3">
                      <i className="ri-check-double-line w-6 h-6 flex items-center justify-center text-accent-600" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground-900">
                      Pedido registado!
                    </h3>
                    <p className="text-sm text-foreground-500 mt-1">
                      Escolhe o metodo de pagamento:
                    </p>
                  </div>

                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((method) => {
                      let desc = method.description;
                      if (method.id === "multibanco" && dadosBancarios?.entidade && dadosBancarios?.referencia_multibanco) {
                        desc = `Entidade: ${dadosBancarios.entidade} | Ref: ${dadosBancarios.referencia_multibanco}`;
                      } else if (method.id === "transferencia" && dadosBancarios?.iban) {
                        desc = `IBAN: ${dadosBancarios.iban}`;
                      }
                      return (
                        <button
                          key={method.id}
                          type="button"
                          disabled={savingPayment}
                          onClick={() => handlePaymentSelect(method.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left cursor-pointer transition-all whitespace-nowrap ${
                            selectedPayment === method.id
                              ? "border-primary-500 bg-primary-50/50"
                              : "border-background-200 bg-background-50 hover:border-primary-300 hover:bg-background-100/50"
                          } ${savingPayment ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <span className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selectedPayment === method.id
                              ? "bg-primary-100 text-primary-600"
                              : "bg-background-100 text-foreground-500"
                          }`}>
                            <i className={`${method.icon} w-5 h-5 flex items-center justify-center`} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-semibold text-foreground-900">
                              {method.label}
                            </span>
                            <span className="block text-xs text-foreground-500 mt-0.5">
                              {desc}
                            </span>
                          </div>
                          {savingPayment && selectedPayment === method.id ? (
                            <i className="ri-loader-4-line w-5 h-5 flex items-center justify-center animate-spin text-primary-500 flex-shrink-0" />
                          ) : (
                            <i className={`ri-arrow-right-s-line w-5 h-5 flex items-center justify-center flex-shrink-0 ${
                              selectedPayment === method.id ? "text-primary-500" : "text-foreground-300"
                            }`} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showPaymentError && (
                    <div className="p-3 rounded-xl bg-primary-50 border border-primary-200 text-sm text-primary-700 flex items-start gap-2">
                      <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5" />
                      <span>{showPaymentError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={savingPayment}
                    className="w-full mt-2 px-4 py-3 rounded-full bg-background-100 border border-background-200 text-foreground-500 text-sm font-medium hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <i className="ri-close-circle-line w-4 h-4 flex items-center justify-center" />
                    Cancelar o pedido
                  </button>
                </div>
              )}

              {/* Step 3: QR Code after payment */}
              {paymentStep === "qr" && showQrCode && qrCodeDataUrl && (
                <div className="rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50/30 p-5 text-center space-y-4">
                  <div className="text-center">
                    <h3 className="font-heading text-sm font-bold text-foreground-900">
                      Pagamento: {PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.label}
                    </h3>
                    {selectedPayment === "multibanco" && dadosBancarios?.entidade && dadosBancarios?.referencia_multibanco ? (
                      <p className="text-xs text-foreground-500 mt-0.5">
                        Entidade: <strong>{dadosBancarios.entidade}</strong> | Referencia: <strong>{dadosBancarios.referencia_multibanco}</strong>
                      </p>
                    ) : selectedPayment === "transferencia" && dadosBancarios?.iban ? (
                      <p className="text-xs text-foreground-500 mt-0.5">
                        IBAN: <strong>{dadosBancarios.iban}</strong>
                      </p>
                    ) : (
                      <p className="text-xs text-foreground-500 mt-0.5">
                        {PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.description}
                      </p>
                    )}
                  </div>
                  <div className="w-48 h-48 mx-auto rounded-xl bg-background-50 border border-background-200/70 flex items-center justify-center overflow-hidden">
                    <img
                      src={qrCodeDataUrl}
                      alt="QR-Code para levantamento"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <p className="text-sm font-medium text-foreground-700 leading-relaxed">
                    Leia esse QR-Code para gerar o codigo para levantar sua encomenda,
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      clearCheckoutPending();
                      onSuccess(nome);
                    }}
                    className="w-full px-5 py-3 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-bold cursor-pointer whitespace-nowrap transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center" />
                    Concluir
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    className="w-full mt-2 px-4 py-3 rounded-full bg-background-100 border border-background-200 text-foreground-500 text-sm font-medium hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <i className="ri-close-circle-line w-4 h-4 flex items-center justify-center" />
                    Cancelar o pedido
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Honeypot */}
        <input
          type="text"
          name="company_alt"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          readOnly
          className="form-safety-net"
        />

        {/* Hidden cart data */}
        {items.map((item, idx) => (
          <div key={item.cartId}>
            <input type="hidden" name={`item_${idx}_produto`} value={item.produtoNome} />
            <input type="hidden" name={`item_${idx}_variacao`} value={item.variacao} />
            <input type="hidden" name={`item_${idx}_quantidade`} value={String(item.quantidade)} />
            <input type="hidden" name={`item_${idx}_preco`} value={item.variacaoPreco} />
            <input type="hidden" name={`item_${idx}_mensagem`} value={item.mensagem} />
            <input type="hidden" name={`item_${idx}_alergias`} value={item.alergias.join(", ")} />
          </div>
        ))}
        <input type="hidden" name="aniversario" value={aniversario.trim()} />
        <input type="hidden" name="total_items" value={String(itemCount)} />
        <input type="hidden" name="subtotal" value={hasPricedItems ? `${subtotal.toFixed(2)} €` : "Sob consulta"} />
      </form>
    </div>
  );
}