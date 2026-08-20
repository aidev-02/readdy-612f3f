import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface ZonaEntrega {
  id: number;
  codigo_postal: string;
  cidade: string;
  tempo_estimado: string;
  taxa_entrega: string;
  distancia: string;
  isencao_taxa: string;
}

// Mapeamento básico de códigos postais para cidades (prefixos)
const CP_CIDADE_MAP: Record<string, string> = {
  "1000": "Lisboa",
  "1100": "Lisboa",
  "1200": "Lisboa",
  "1300": "Lisboa",
  "1400": "Lisboa",
  "1500": "Lisboa",
  "1600": "Lisboa",
  "1700": "Lisboa",
  "1800": "Lisboa",
  "1900": "Lisboa",
  "2000": "Santarém",
  "2100": "Santarém",
  "2200": "Santarém",
  "2300": "Tomar",
  "2400": "Leiria",
  "2500": "Caldas da Rainha",
  "2600": "Vila Franca de Xira",
  "2700": "Amadora",
  "2800": "Almada",
  "2900": "Setúbal",
  "3000": "Coimbra",
  "3100": "Pombal",
  "3200": "Lousã",
  "3400": "Oliveira do Hospital",
  "3500": "Viseu",
  "3600": "Castro Daire",
  "3700": "São João da Madeira",
  "3800": "Aveiro",
  "3900": "Aveiro",
  "4000": "Porto",
  "4100": "Porto",
  "4200": "Porto",
  "4300": "Porto",
  "4400": "Vila Nova de Gaia",
  "4420": "Gondomar",
  "4440": "Valongo",
  "4450": "Matosinhos",
  "4470": "Maia",
  "4480": "Vila do Conde",
  "4490": "Póvoa de Varzim",
  "4500": "Espinho",
  "4520": "Santa Maria da Feira",
  "4600": "Amarante",
  "4700": "Braga",
  "4800": "Guimarães",
  "4900": "Viana do Castelo",
  "5000": "Vila Real",
  "5100": "Lamego",
  "5300": "Bragança",
  "5400": "Chaves",
  "6000": "Castelo Branco",
  "6200": "Covilhã",
  "6300": "Guarda",
  "7000": "Évora",
  "7100": "Estremoz",
  "7200": "Reguengos de Monsaraz",
  "7300": "Portalegre",
  "7500": "Santiago do Cacém",
  "7600": "Aljustrel",
  "7700": "Almodôvar",
  "7800": "Beja",
  "8000": "Faro",
  "8100": "Loulé",
  "8200": "Albufeira",
  "8300": "Silves",
  "8400": "Lagoa",
  "8500": "Portimão",
  "8600": "Lagos",
  "8700": "Olhão",
  "8800": "Tavira",
  "8900": "Vila Real de Santo António",
  "9000": "Funchal",
  "9100": "Santa Cruz",
  "9200": "Machico",
  "9300": "Câmara de Lobos",
  "9400": "Porto Santo",
};

function inferirCidade(codigoPostal: string): string {
  const prefixo = codigoPostal.replace(/\s/g, "").slice(0, 4);
  return CP_CIDADE_MAP[prefixo] || "";
}

// Distâncias aproximadas (km) de cada cidade até à Manger.pt (Rua Machado dos Santos, 593, 4400-209 Vila Nova de Gaia)
const CIDADE_DISTANCIA_MAP: Record<string, string> = {
  "Vila Nova de Gaia": "~0 km",
  "Porto": "~5 km",
  "Matosinhos": "~12 km",
  "Maia": "~12 km",
  "Gondomar": "~15 km",
  "Valongo": "~15 km",
  "Espinho": "~20 km",
  "Santa Maria da Feira": "~20 km",
  "São João da Madeira": "~30 km",
  "Póvoa de Varzim": "~35 km",
  "Vila do Conde": "~35 km",
  "Amarante": "~60 km",
  "Aveiro": "~70 km",
  "Guimarães": "~50 km",
  "Braga": "~55 km",
  "Viana do Castelo": "~75 km",
  "Vila Real": "~100 km",
  "Lamego": "~110 km",
  "Castro Daire": "~115 km",
  "Viseu": "~120 km",
  "Coimbra": "~120 km",
  "Lousã": "~130 km",
  "Oliveira do Hospital": "~140 km",
  "Pombal": "~155 km",
  "Chaves": "~160 km",
  "Leiria": "~190 km",
  "Bragança": "~200 km",
  "Guarda": "~200 km",
  "Tomar": "~220 km",
  "Castelo Branco": "~240 km",
  "Caldas da Rainha": "~240 km",
  "Covilhã": "~260 km",
  "Santarém": "~270 km",
  "Vila Franca de Xira": "~300 km",
  "Lisboa": "~310 km",
  "Amadora": "~310 km",
  "Almada": "~315 km",
  "Setúbal": "~330 km",
  "Portalegre": "~330 km",
  "Estremoz": "~350 km",
  "Évora": "~380 km",
  "Santiago do Cacém": "~400 km",
  "Reguengos de Monsaraz": "~400 km",
  "Aljustrel": "~420 km",
  "Beja": "~440 km",
  "Almodôvar": "~450 km",
  "Silves": "~510 km",
  "Lagoa": "~515 km",
  "Albufeira": "~520 km",
  "Portimão": "~525 km",
  "Loulé": "~530 km",
  "Lagos": "~535 km",
  "Faro": "~540 km",
  "Olhão": "~545 km",
  "Tavira": "~555 km",
  "Vila Real de Santo António": "~560 km",
};

function inferirDistancia(cidade: string): string {
  if (!cidade) return "";
  return CIDADE_DISTANCIA_MAP[cidade] || "";
}

export default function DadosOperacao() {
  // Tempo de pagamento
  const [horas, setHoras] = useState("00");
  const [minutos, setMinutos] = useState("30");
  const [savingTempo, setSavingTempo] = useState(false);
  const [tempoMsg, setTempoMsg] = useState("");

  // Zonas de entrega
  const [zonas, setZonas] = useState<ZonaEntrega[]>([]);
  const [loadingZonas, setLoadingZonas] = useState(true);

  // Form nova zona
  const [newCp, setNewCp] = useState("");
  const [newCidade, setNewCidade] = useState("");
  const [newTempo, setNewTempo] = useState("");
  const [newTaxa, setNewTaxa] = useState("");
  const [newIsencao, setNewIsencao] = useState("");
  const [newDistancia, setNewDistancia] = useState("");
  const [addingZona, setAddingZona] = useState(false);
  const [zonaError, setZonaError] = useState("");

  // Edição inline
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<ZonaEntrega | null>(null);

  // Delete confirm
  const [deleteZona, setDeleteZona] = useState<ZonaEntrega | null>(null);

  const carregarTempo = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("admin_config_operacao")
        .select("valor")
        .eq("chave", "tempo_aguardando_pagamento")
        .maybeSingle();
      if (error) throw error;
      if (data?.valor) {
        const partes = data.valor.split(":");
        setHoras(partes[0] || "00");
        setMinutos(partes[1] || "00");
      }
    } catch {
      // mantém default
    }
  }, []);

  const carregarZonas = useCallback(async () => {
    setLoadingZonas(true);
    try {
      const { data, error } = await supabase
        .from("admin_zonas_entrega")
        .select("*");
      if (error) throw error;

      // Ordenar por distância de forma ascendente (extrai número da string para ordenação correta)
      const sorted = (data || []).sort((a, b) => {
        const numA = parseInt((a.distancia || "0").match(/\d+/)?.[0] || "0", 10);
        const numB = parseInt((b.distancia || "0").match(/\d+/)?.[0] || "0", 10);
        return numA - numB;
      });

      setZonas(sorted as ZonaEntrega[]);
    } catch {
      // mantém o estado atual
    } finally {
      setLoadingZonas(false);
    }
  }, []);

  useEffect(() => {
    carregarTempo();
    carregarZonas();
  }, [carregarTempo, carregarZonas]);

  // ---- Tempo de pagamento ----
  const handleSaveTempo = async () => {
    setSavingTempo(true);
    setTempoMsg("");
    const valor = `${horas.padStart(2, "0")}:${minutos.padStart(2, "0")}`;
    try {
      const { error } = await supabase
        .from("admin_config_operacao")
        .upsert({ chave: "tempo_aguardando_pagamento", valor, descricao: "Tempo que um pedido fica aguardando pagamento (HH:MM)", updated_at: new Date().toISOString() }, { onConflict: "chave" });
      if (error) throw error;
      setTempoMsg("Guardado com sucesso.");
    } catch {
      setTempoMsg("Erro ao guardar.");
    } finally {
      setSavingTempo(false);
      setTimeout(() => setTempoMsg(""), 3000);
    }
  };

  const ajustarTempo = (tipo: "h+" | "h-" | "m+" | "m-") => {
    let h = parseInt(horas, 10) || 0;
    let m = parseInt(minutos, 10) || 0;
    switch (tipo) {
      case "h+": h = Math.min(h + 1, 99); break;
      case "h-": h = Math.max(h - 1, 0); break;
      case "m+":
        m += 5;
        if (m >= 60) { m -= 60; h = Math.min(h + 1, 99); }
        break;
      case "m-":
        m -= 5;
        if (m < 0) { m += 60; h = Math.max(h - 1, 0); }
        break;
    }
    setHoras(String(h));
    setMinutos(String(m));
  };

  // ---- Zonas de entrega ----
  const handleCpChange = (val: string) => {
    setNewCp(val);
    const cidade = inferirCidade(val);
    setNewCidade(cidade);
    const distancia = inferirDistancia(cidade);
    setNewDistancia(distancia);
  };

  const handleAddZona = async () => {
    if (!newCp.trim() || !newCidade.trim()) {
      setZonaError("Código postal e cidade são obrigatórios.");
      return;
    }
    setAddingZona(true);
    setZonaError("");
    try {
      const { error } = await supabase
        .from("admin_zonas_entrega")
        .insert({
          codigo_postal: newCp.trim(),
          cidade: newCidade.trim(),
          tempo_estimado: newTempo.trim(),
          taxa_entrega: newTaxa.trim() || "0.00 €",
          isencao_taxa: newIsencao.trim(),
          distancia: newDistancia.trim(),
        });
      if (error) throw error;
      setNewCp("");
      setNewCidade("");
      setNewTempo("");
      setNewTaxa("");
      setNewIsencao("");
      setNewDistancia("");
      carregarZonas();
    } catch {
      setZonaError("Erro ao adicionar zona. Verifica se o código postal já existe.");
    } finally {
      setAddingZona(false);
    }
  };

  const startEdit = (z: ZonaEntrega) => {
    setEditingId(z.id);
    setEditValues({ ...z });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues(null);
  };

  const handleSaveEdit = async () => {
    if (!editValues || !editingId) return;
    const { error } = await supabase
      .from("admin_zonas_entrega")
      .update({
        codigo_postal: editValues.codigo_postal,
        cidade: editValues.cidade,
        tempo_estimado: editValues.tempo_estimado,
        taxa_entrega: editValues.taxa_entrega,
        isencao_taxa: editValues.isencao_taxa,
        distancia: editValues.distancia,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingId);
    if (error) return;
    setZonas((prev) => prev.map((z) => (z.id === editingId ? { ...editValues } : z)));
    cancelEdit();
  };

  const handleDeleteZona = async () => {
    if (!deleteZona) return;
    const { error } = await supabase
      .from("admin_zonas_entrega")
      .delete()
      .eq("id", deleteZona.id);
    if (error) return;
    setZonas((prev) => prev.filter((z) => z.id !== deleteZona.id));
    setDeleteZona(null);
  };

  return (
    <div className="space-y-10">
      {/* Tempo de pagamento */}
      <div>
        <h3 className="font-heading text-base font-semibold text-foreground-950 mb-4">
          Tempo aguardando pagamento
        </h3>
        <p className="text-sm text-foreground-600 mb-4">
          Define quanto tempo um pedido permanece no estado "aguardando pagamento" antes de ser cancelado automaticamente.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {/* Horas */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => ajustarTempo("h-")}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-background-300/60 hover:bg-background-200/60 transition-colors cursor-pointer"
            >
              <i className="ri-subtract-line w-4 h-4 flex items-center justify-center text-foreground-700" />
            </button>
            <div className="w-16 h-9 flex items-center justify-center rounded-lg border border-background-300/60 bg-background-50 text-sm font-semibold font-mono text-foreground-950">
              {horas.padStart(2, "0")}
            </div>
            <button
              type="button"
              onClick={() => ajustarTempo("h+")}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-background-300/60 hover:bg-background-200/60 transition-colors cursor-pointer"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center text-foreground-700" />
            </button>
          </div>

          <span className="text-lg font-bold text-foreground-500">:</span>

          {/* Minutos */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => ajustarTempo("m-")}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-background-300/60 hover:bg-background-200/60 transition-colors cursor-pointer"
            >
              <i className="ri-subtract-line w-4 h-4 flex items-center justify-center text-foreground-700" />
            </button>
            <div className="w-16 h-9 flex items-center justify-center rounded-lg border border-background-300/60 bg-background-50 text-sm font-semibold font-mono text-foreground-950">
              {minutos.padStart(2, "0")}
            </div>
            <button
              type="button"
              onClick={() => ajustarTempo("m+")}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-background-300/60 hover:bg-background-200/60 transition-colors cursor-pointer"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center text-foreground-700" />
            </button>
          </div>

          <span className="text-sm text-foreground-500 ml-1">(HH:MM)</span>

          <button
            type="button"
            onClick={handleSaveTempo}
            disabled={savingTempo}
            className="ml-4 px-5 py-2 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors"
          >
            {savingTempo ? (
              <>
                <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                A guardar...
              </>
            ) : (
              <>
                <i className="ri-save-line w-4 h-4 flex items-center justify-center" />
                Guardar
              </>
            )}
          </button>

          {tempoMsg && (
            <span className={`text-sm font-medium ${tempoMsg.includes("Erro") ? "text-red-700" : "text-emerald-700"}`}>
              {tempoMsg}
            </span>
          )}
        </div>
      </div>

      {/* Zonas de Entrega */}
      <div>
        <h3 className="font-heading text-base font-semibold text-foreground-950 mb-1">
          Zonas de Entrega
        </h3>
        <p className="text-sm text-foreground-600 mb-4">
          Gere os códigos postais, cidades, tempos estimados e taxas de entrega para a sua área de cobertura.
        </p>

        {/* Form para adicionar zona */}
        <div className="rounded-xl border border-background-200/70 bg-background-100/70 p-5 mb-5">
          <h4 className="text-sm font-semibold text-foreground-800 mb-4">Adicionar nova zona</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground-700 mb-1">Código Postal</label>
              <input
                type="text"
                value={newCp}
                onChange={(e) => handleCpChange(e.target.value)}
                placeholder="Ex: 1000-001"
                className="w-full px-3 py-2 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground-700 mb-1">Cidade (auto)</label>
              <input
                type="text"
                value={newCidade}
                onChange={(e) => setNewCidade(e.target.value)}
                placeholder="Preenchida automaticamente"
                className="w-full px-3 py-2 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-700 mb-1">Distância</label>
              <input
                type="text"
                value={newDistancia}
                onChange={(e) => setNewDistancia(e.target.value)}
                placeholder="Ex: ~15 km"
                className="w-full px-3 py-2 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground-700 mb-1">Tempo Estimado</label>
              <input
                type="text"
                value={newTempo}
                onChange={(e) => setNewTempo(e.target.value)}
                placeholder="Ex: 1 dia útil"
                className="w-full px-3 py-2 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground-700 mb-1">Isenção de taxa</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground-500 shrink-0">acima de:</span>
                <input
                  type="text"
                  value={newIsencao}
                  onChange={(e) => setNewIsencao(e.target.value)}
                  placeholder="Ex: 30.00"
                  className="w-full px-3 py-2 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
                />
                <span className="text-xs font-medium text-foreground-600 shrink-0">€</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground-700 mb-1">Taxa</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaxa}
                  onChange={(e) => setNewTaxa(e.target.value)}
                  placeholder="Ex: 5.00"
                  className="w-full px-3 py-2 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
                />
                <span className="text-xs font-medium text-foreground-600 shrink-0">€</span>
              </div>
            </div>
          </div>

          {zonaError && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
              <i className="ri-error-warning-line text-red-600 mt-0.5 w-4 h-4 flex items-center justify-center shrink-0" />
              <p className="text-sm text-red-800">{zonaError}</p>
            </div>
          )}

          <div className="mt-4">
            <button
              type="button"
              onClick={handleAddZona}
              disabled={addingZona}
              className="px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors"
            >
              {addingZona ? (
                <>
                  <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                  A adicionar...
                </>
              ) : (
                <>
                  <i className="ri-add-line w-4 h-4 flex items-center justify-center" />
                  Adicionar zona
                </>
              )}
            </button>
          </div>
        </div>

        {/* Lista de zonas */}
        {loadingZonas ? (
          <div className="flex items-center justify-center py-12">
            <i className="ri-loader-4-line animate-spin text-xl w-6 h-6 flex items-center justify-center text-foreground-400" />
          </div>
        ) : zonas.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-background-100 border border-background-200/70">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background-200/60 mx-auto mb-3">
              <i className="ri-map-pin-line text-lg w-5 h-5 flex items-center justify-center text-foreground-400" />
            </div>
            <p className="text-sm text-foreground-600">Nenhuma zona de entrega cadastrada.</p>
            <p className="text-xs text-foreground-400 mt-1">Adiciona zonas usando o formulário acima.</p>
          </div>
        ) : (
          <div className="rounded-xl bg-background-100 border border-background-200/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-background-200/60">
                    <th className="text-left px-5 py-3 font-medium text-foreground-600">Código Postal</th>
                    <th className="text-left px-5 py-3 font-medium text-foreground-600">Cidade</th>
                    <th className="text-left px-5 py-3 font-medium text-foreground-600">Distância</th>
                    <th className="text-left px-5 py-3 font-medium text-foreground-600">Tempo Estimado</th>
                    <th className="text-right px-5 py-3 font-medium text-foreground-600">Isenção de taxa</th>
                    <th className="text-right px-5 py-3 font-medium text-foreground-600">Taxa</th>
                    <th className="text-right px-5 py-3 font-medium text-foreground-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {zonas.map((z) => (
                    <tr key={z.id} className="border-b border-background-200/40 hover:bg-background-50/60 transition-colors">
                      {editingId === z.id && editValues ? (
                        <>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={editValues.codigo_postal}
                              onChange={(e) => setEditValues({ ...editValues, codigo_postal: e.target.value })}
                              className="w-full px-2 py-1.5 rounded border border-background-300/60 bg-background-50 text-xs text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400/60"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={editValues.cidade}
                              onChange={(e) => setEditValues({ ...editValues, cidade: e.target.value })}
                              className="w-full px-2 py-1.5 rounded border border-background-300/60 bg-background-50 text-xs text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400/60"
                            />
                          </td>

                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={editValues.distancia}
                              onChange={(e) => setEditValues({ ...editValues, distancia: e.target.value })}
                              className="w-full px-2 py-1.5 rounded border border-background-300/60 bg-background-50 text-xs text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400/60"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={editValues.tempo_estimado}
                              onChange={(e) => setEditValues({ ...editValues, tempo_estimado: e.target.value })}
                              className="w-full px-2 py-1.5 rounded border border-background-300/60 bg-background-50 text-xs text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400/60"
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-xs text-foreground-400 shrink-0">acima de:</span>
                              <input
                                type="text"
                                value={editValues.isencao_taxa || ""}
                                onChange={(e) => setEditValues({ ...editValues, isencao_taxa: e.target.value })}
                                className="w-20 px-2 py-1.5 rounded border border-background-300/60 bg-background-50 text-xs text-foreground-950 text-right focus:outline-none focus:ring-2 focus:ring-primary-400/60"
                              />
                              <span className="text-xs text-foreground-500 shrink-0">€</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="text"
                                value={editValues.taxa_entrega}
                                onChange={(e) => setEditValues({ ...editValues, taxa_entrega: e.target.value })}
                                className="w-20 px-2 py-1.5 rounded border border-background-300/60 bg-background-50 text-xs text-foreground-950 text-right focus:outline-none focus:ring-2 focus:ring-primary-400/60"
                              />
                              <span className="text-xs text-foreground-500 shrink-0">€</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button type="button" onClick={handleSaveEdit} className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-600 text-background-50 transition-colors cursor-pointer" title="Guardar">
                                <i className="ri-check-line w-3.5 h-3.5 flex items-center justify-center" />
                              </button>
                              <button type="button" onClick={cancelEdit} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-background-200/60 transition-colors cursor-pointer" title="Cancelar">
                                <i className="ri-close-line w-3.5 h-3.5 flex items-center justify-center text-foreground-600" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-5 py-3.5 text-foreground-800 font-medium font-mono text-xs">{z.codigo_postal}</td>
                          <td className="px-5 py-3.5 text-foreground-700">{z.cidade}</td>
                          <td className="px-5 py-3.5 text-foreground-600 whitespace-nowrap">{z.distancia || "—"}</td>
                          <td className="px-5 py-3.5 text-foreground-600">{z.tempo_estimado || "—"}</td>
                          <td className="px-5 py-3.5 text-right text-foreground-700 whitespace-nowrap">
                            {z.isencao_taxa ? (
                              <span className="text-xs text-foreground-400 mr-1">acima de:</span>
                            ) : null}
                            <span className="font-medium text-foreground-800">{z.isencao_taxa ? `${z.isencao_taxa} €` : "—"}</span>
                          </td>
                          <td className="px-5 py-3.5 text-right font-medium text-foreground-800 whitespace-nowrap">{z.taxa_entrega || "—"}</td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => startEdit(z)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-200/60 transition-colors cursor-pointer"
                                title="Editar"
                              >
                                <i className="ri-edit-line w-4 h-4 flex items-center justify-center text-foreground-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteZona(z)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                title="Excluir"
                              >
                                <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center text-red-600" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de exclusão de zona */}
      {deleteZona && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteZona(null)} />
          <div className="relative bg-background-50 rounded-xl border border-background-200/70 w-full max-w-sm p-6 shadow-lg">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto mb-4">
              <i className="ri-error-warning-line text-xl w-6 h-6 flex items-center justify-center" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground-950 text-center mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-foreground-600 text-center mb-6">
              Tens a certeza que queres excluir a zona <strong>{deleteZona.codigo_postal} - {deleteZona.cidade}</strong>?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteZona(null)}
                className="px-5 py-2.5 rounded-full border border-background-300/60 text-sm font-medium text-foreground-700 hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteZona}
                className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors"
              >
                <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}