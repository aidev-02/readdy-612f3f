const contactCards = [
  {
    icon: "ri-phone-line",
    title: "Telefone",
    lines: ["+351 913 664 756"],
    action: { type: "tel", href: "tel:+351913664756", label: "Ligar agora" },
    color: "primary",
  },
  {
    icon: "ri-whatsapp-line",
    title: "WhatsApp",
    lines: ["+351 913 664 756"],
    action: { type: "whatsapp", href: "https://wa.me/351913664756", label: "Conversar agora" },
    color: "accent",
  },
  {
    icon: "ri-mail-line",
    title: "Email",
    lines: ["manger.pt@outlook.com"],
    action: { type: "mailto", href: "mailto:manger.pt@outlook.com", label: "Enviar email" },
    color: "secondary",
  },
  {
    icon: "ri-map-pin-2-line",
    title: "Morada",
    lines: ["Rua Machado dos Santos, 593 / Loja 1", "4400-209 Vila Nova de Gaia", "Take-away & delivery"],
    action: null,
    color: "primary",
  },
  {
    icon: "ri-time-line",
    title: "Horário de encomendas",
    lines: ["2ª feira a 6ª: das 9h às 19h", "Sábado: das 9h às 14h", "4ª feira: Encerrado", "24h a 48h de antecedência"],
    action: null,
    color: "accent",
  },
];

const colorMap: Record<string, string> = {
  primary: "bg-primary-500 text-background-50",
  accent: "bg-accent-500 text-background-50",
  secondary: "bg-secondary-500 text-background-50",
};

export default function InfoContactos() {
  return (
    <section className="w-full px-4 md:px-10 py-16 md:py-24 bg-background-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {contactCards.map((card) => (
          <div
            key={card.title}
            className="group relative rounded-xl bg-background-100 border border-background-200/70 p-6 md:p-7 transition-colors hover:border-primary-300/40"
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full mb-5 ${colorMap[card.color]}`}
            >
              <i className={`${card.icon} text-xl w-5 h-5 flex items-center justify-center`} />
            </div>
            <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground-950 mb-3">
              {card.title}
            </h3>
            <div className="space-y-1">
              {card.lines.map((line, i) => (
                <p key={i} className="text-sm text-foreground-700 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
            {card.action && (
              <a
                href={card.action.href}
                rel={card.action.type === "whatsapp" ? "nofollow" : undefined}
                target={card.action.type === "whatsapp" ? "_blank" : undefined}
                className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors cursor-pointer"
              >
                {card.action.label}
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}