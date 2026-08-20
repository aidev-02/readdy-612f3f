import { useEffect, useState } from "react";
import type { Produto } from "@/mocks/catalogo";

interface OrcamentoModalProps {
  produto: Produto;
  onClose: () => void;
}

const TIPOS_ORCAMENTO = [
  "Unidade para 2 ou mais pessoas",
  "Porções individuais (em embalagem)",
  "Porções individuais servidas em pratos",
];

const FORMATOS = ["Retangular", "Quadrado", "Redondo", "Coração"];

const CODIGOS_PAIS = [
  { codigo: "+351", pais: "Portugal" },
  { codigo: "+55", pais: "Brasil" },
  { codigo: "+34", pais: "Espanha" },
  { codigo: "+33", pais: "França" },
  { codigo: "+44", pais: "Reino Unido" },
  { codigo: "+49", pais: "Alemanha" },
  { codigo: "+1", pais: "EUA / Canadá" },
  { codigo: "+244", pais: "Angola" },
  { codigo: "+258", pais: "Moçambique" },
  { codigo: "+238", pais: "Cabo Verde" },
];

export default function OrcamentoModal({ produto, onClose }: OrcamentoModalProps) {
  const [empresaCliente, setEmpresaCliente] = useState("");
  const [tipoOrcamento, setTipoOrcamento] = useState(TIPOS_ORCAMENTO[0]);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState("");
  const [formato, setFormato] = useState("");
  const [formatoEspecifico, setFormatoEspecifico] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [mensagemEspecial, setMensagemEspecial] = useState("");
  const [alergiasSelecionadas, setAlergiasSelecionadas] = useState<string[]>([]);
  const [infoAdicionais, setInfoAdicionais] = useState("");
  const [prazo, setPrazo] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [codigoPais, setCodigoPais] = useState("+351");
  const [telemovel, setTelemovel] = useState("");
  const [temWhatsApp, setTemWhatsApp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const tamanhoOpcoes = [
    produto.formato,
    ...produto.variacoes.map((v) => v.nome),
  ];

  const toggleAlergia = (alergia: string) => {
    setAlergiasSelecionadas((prev) =>
      prev.includes(alergia) ? prev.filter((a) => a !== alergia) : [...prev, alergia]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const honeypot = formData.get("phone_alt") as string;
    if (honeypot && honeypot.trim() !== "") {
      setFormStatus("success");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      return;
    }
    setEmailError("");

    setSubmitting(true);
    setFormError("");

    try {
      const payload = new FormData(form);
      payload.delete("phone_alt");

      const response = await fetch(
        "https://readdy.ai/api/form/d9gkkqkbl0ahdbsfa6h0",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(payload as any).toString(),
        }
      );

      const responseText = await response.text();
      let parsed: any = {};
      try {
        parsed = JSON.parse(responseText);
      } catch {
        // resposta não é JSON, usar responseText diretamente
      }

      if (response.ok && parsed?.code === "OK") {
        setFormStatus("success");
      } else {
        const serverMsg =
          parsed?.meta?.message || parsed?.message || responseText || "";
        if (serverMsg.toLowerCase().includes("spam")) {
          setFormError("Erro de validação. Por favor, tente novamente.");
        } else {
          setFormError(
            serverMsg || "Erro ao enviar o pedido. Tente novamente."
          );
        }
        setFormStatus("error");
      }
    } catch {
      setFormError("Erro de conexão. Verifique a sua internet e tente novamente.");
      setFormStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  const hoje = new Date().toISOString().split("T")[0];
  const prazoMinimo = new Date();
  prazoMinimo.setDate(prazoMinimo.getDate() + 2);
  const prazoMinimoStr = prazoMinimo.toISOString().split("T")[0];

  if (formStatus === "success") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative w-full max-w-lg bg-background-50 rounded-2xl p-8 md:p-10 z-10 text-center">
          <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-primary-100">
            <i className="ri-check-line text-3xl w-8 h-8 flex items-center justify-center text-primary-600" />
          </div>
          <h2 className="font-heading text-2xl text-foreground-950 font-bold mb-3">
            Pedido enviado com sucesso!
          </h2>
          <p className="text-foreground-600 text-sm leading-relaxed mb-6">
            Obrigado, {nome || "visitante"}! O seu pedido de orçamento para{" "}
            <strong>{produto.nome}</strong> foi recebido. Entraremos em contacto
            dentro de 24 a 48 horas úteis.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center py-8 px-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl bg-background-50 rounded-2xl overflow-hidden z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-background-50/90 hover:bg-background-100 text-foreground-600 hover:text-foreground-950 transition-colors cursor-pointer whitespace-nowrap"
          aria-label="Fechar"
        >
          <i className="ri-close-line text-xl w-5 h-5 flex items-center justify-center" />
        </button>

        <div className="px-6 md:px-8 py-6 md:py-7">
          <h2 className="font-heading text-2xl text-foreground-950 font-bold mb-1">
            Pedir Orçamento
          </h2>
          <p className="text-sm text-foreground-600 mb-6">
            Preencha os dados abaixo e receberá uma resposta em breve.
          </p>

          <form
            onSubmit={handleSubmit}
            data-readdy-form
            className="space-y-0"
            noValidate
          >
            <div className="flex items-center gap-4 p-4 bg-background-100/70 rounded-xl mb-6">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-background-200/60">
                <img
                  src={produto.imagemThumb}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading text-lg text-foreground-950 font-semibold">
                  {produto.nome}
                </h3>
                <p className="text-sm text-foreground-600 line-clamp-2 mt-0.5">
                  {produto.descricao}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground-800 mb-3 font-label">
                Tipo de Orçamento
              </label>
              <div className="space-y-2">
                {TIPOS_ORCAMENTO.map((tipo) => (
                  <label
                    key={tipo}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors whitespace-nowrap ${
                      tipoOrcamento === tipo
                        ? "border-primary-400 bg-primary-50/60"
                        : "border-background-200/70 hover:border-background-300/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipo_orcamento"
                      value={tipo}
                      checked={tipoOrcamento === tipo}
                      onChange={() => setTipoOrcamento(tipo)}
                      className="w-4 h-4 accent-primary-500 cursor-pointer"
                    />
                    <span className="text-sm text-foreground-800">{tipo}</span>
                  </label>
                ))}
              </div>
            </div>

            {tipoOrcamento !== TIPOS_ORCAMENTO[0] ? (
              <div className="text-center py-10 px-4 bg-background-100/50 rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-background-200/60">
                  <i className="ri-tools-line text-xl w-5 h-5 flex items-center justify-center text-foreground-400" />
                </div>
                <p className="text-sm text-foreground-500 font-medium">
                  Esta opção estará disponível em breve.
                </p>
                <p className="text-xs text-foreground-400 mt-1">
                  Por favor, selecione &ldquo;Unidade para 2 ou mais pessoas&rdquo; para continuar.
                </p>
              </div>
            ) : (
              <>
                <div className="border-t border-background-200/60 pt-5 mb-5">
                  <p className="text-xs uppercase tracking-[0.2em] font-label text-foreground-500 mb-4">
                    Detalhes do Produto
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground-800 mb-1.5 font-label">
                      Tamanho
                    </label>
                    <select
                      name="tamanho"
                      value={tamanhoSelecionado}
                      onChange={(e) => setTamanhoSelecionado(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:border-primary-400 transition-colors cursor-pointer"
                    >
                      <option value="">Selecione o tamanho</option>
                      {tamanhoOpcoes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground-800 mb-1.5 font-label">
                      Formato
                    </label>
                    <select
                      name="formato"
                      value={formato}
                      onChange={(e) => setFormato(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:border-primary-400 transition-colors cursor-pointer"
                    >
                      <option value="">Selecione o formato</option>
                      {FORMATOS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground-800 mb-1.5 font-label">
                      Formato Específico
                    </label>
                    <input
                      type="text"
                      name="formato_especifico"
                      value={formatoEspecifico}
                      onChange={(e) => setFormatoEspecifico(e.target.value)}
                      placeholder="Ex.: 30 cm x 20 cm, coração 25 cm..."
                      className="w-full px-4 py-2.5 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground-800 mb-1.5 font-label">
                      Quantidade
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantidade((q) => Math.max(1, q - 1))
                        }
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-background-200/70 bg-background-50 text-foreground-700 hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
                        aria-label="Diminuir quantidade"
                      >
                        <i className="ri-subtract-line w-4 h-4 flex items-center justify-center" />
                      </button>
                      <span className="w-12 text-center text-lg font-semibold text-foreground-950 font-heading">
                        {quantidade}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantidade((q) => q + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-background-200/70 bg-background-50 text-foreground-700 hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
                        aria-label="Aumentar quantidade"
                      >
                        <i className="ri-add-line w-4 h-4 flex items-center justify-center" />
                      </button>
                    </div>
                    <input type="hidden" name="quantidade" value={quantidade} />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground-800 mb-1.5 font-label">
                      Mensagem Especial
                    </label>
                    <textarea
                      name="mensagem_especial"
                      value={mensagemEspecial}
                      onChange={(e) => setMensagemEspecial(e.target.value)}
                      placeholder="Ex.: &quot;Feliz Aniversário, Maria!&quot; ou &quot;Parabéns aos noivos!&quot;"
                      rows={2}
                      maxLength={500}
                      className="w-full px-4 py-2.5 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors resize-none"
                    />
                    <span className="text-[10px] text-foreground-400 mt-1 block text-right">
                      {mensagemEspecial.length}/500
                    </span>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground-800 mb-1.5 font-label">
                      Alergias / Restrições
                    </label>
                    {produto.alergeneos.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {produto.alergeneos.map((alergia) => (
                          <label
                            key={alergia}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors whitespace-nowrap ${
                              alergiasSelecionadas.includes(alergia)
                                ? "bg-accent-100 text-accent-900 border-accent-300"
                                : "bg-background-50 text-foreground-600 border-background-200/70 hover:border-background-300/60"
                            }`}
                          >
                            <input
                              type="checkbox"
                              name="alergias"
                              value={alergia}
                              checked={alergiasSelecionadas.includes(alergia)}
                              onChange={() => toggleAlergia(alergia)}
                              className="sr-only"
                            />
                            {alergia}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-foreground-400 italic">
                        Nenhum alergénico listado para este produto.
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground-800 mb-1.5 font-label">
                      Informações Adicionais
                    </label>
                    <textarea
                      name="informacoes_adicionais"
                      value={infoAdicionais}
                      onChange={(e) => setInfoAdicionais(e.target.value)}
                      placeholder="Alguma preferência, pedido especial ou nota que queira partilhar..."
                      rows={2}
                      maxLength={500}
                      className="w-full px-4 py-2.5 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="border-t border-background-200/60 pt-5 mb-5">
                  <p className="text-xs uppercase tracking-[0.2em] font-label text-foreground-500 mb-4">
                    Prazo e Contacto
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground-800 mb-1.5 font-label">
                      Preciso receber o orçamento até:
                    </label>
                    <div className="flex items-center gap-3 flex-wrap">
                      <input
                        type="date"
                        name="prazo"
                        value={prazo}
                        onChange={(e) => setPrazo(e.target.value)}
                        min={prazoMinimoStr}
                        className="px-4 py-2.5 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:border-primary-400 transition-colors cursor-pointer"
                      />
                      <span className="text-xs text-foreground-500 flex items-center gap-1">
                        <i className="ri-information-line w-3.5 h-3.5 flex items-center justify-center" />
                        Prazo mínimo — 48 horas
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground-800 mb-1.5 font-label">
                      Empresa / Estabelecimento
                    </label>
                    <input
                      type="text"
                      name="empresa_cliente"
                      value={empresaCliente}
                      onChange={(e) => setEmpresaCliente(e.target.value)}
                      placeholder="Nome da sua empresa ou estabelecimento (opcional)"
                      className="w-full px-4 py-2.5 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground-800 mb-1.5 font-label">
                      Nome / Apelido
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="O seu nome completo"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground-800 mb-1.5 font-label">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      placeholder="exemplo@email.com"
                      required
                      className={`w-full px-4 py-2.5 rounded-xl border bg-background-50 text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none transition-colors ${
                        emailError
                          ? "border-red-400 focus:border-red-500"
                          : "border-background-200/70 focus:border-primary-400"
                      }`}
                    />
                    {emailError && (
                      <p className="text-red-500 text-xs mt-1">{emailError}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground-800 mb-1.5 font-label">
                      Telemóvel
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="codigo_pais"
                        value={codigoPais}
                        onChange={(e) => setCodigoPais(e.target.value)}
                        className="w-[140px] flex-shrink-0 px-3 py-2.5 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:border-primary-400 transition-colors cursor-pointer"
                      >
                        {CODIGOS_PAIS.map((cp) => (
                          <option key={cp.codigo} value={cp.codigo}>
                            {cp.pais} ({cp.codigo})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="telemovel"
                        value={telemovel}
                        onChange={(e) => setTelemovel(e.target.value)}
                        placeholder="912 345 678"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="whatsapp"
                        checked={temWhatsApp}
                        onChange={(e) => setTemWhatsApp(e.target.checked)}
                        className="w-4 h-4 rounded accent-primary-500 cursor-pointer"
                      />
                      <span className="text-sm text-foreground-700">
                        Possui WhatsApp?
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <input
              type="hidden"
              name="produto_nome"
              value={produto.nome}
            />
            <input
              type="hidden"
              name="produto_id"
              value={produto.id}
            />

            <input
              type="text"
              name="phone_alt"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              readOnly
              className="absolute opacity-0 pointer-events-none"
              style={{
                position: "absolute",
                left: "-9999px",
                opacity: "0",
                pointerEvents: "none",
                height: "0",
                width: "0",
              }}
            />

            {formStatus === "error" && formError && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-red-500">
                  <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center" />
                </div>
                <p className="text-sm text-red-700">{formError}</p>
              </div>
            )}

            {tipoOrcamento === TIPOS_ORCAMENTO[0] && (
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-background-50 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                {submitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                    A enviar...
                  </>
                ) : (
                  <>
                    Enviar Pedido de Orçamento
                    <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center" />
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}