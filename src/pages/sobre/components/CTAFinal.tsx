import { Link } from "react-router-dom";

export default function CTAFinal() {
  return (
    <section className="w-full bg-background-100 texture-paper py-16 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-4xl mx-auto text-center">
        <span className="inline-block text-xs uppercase tracking-[0.2em] font-label text-secondary-600 mb-3">
          Contacto comercial
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-600 text-foreground-950 mb-5 leading-tight">
          Leve sobremesas de autor para o seu negócio
        </h2>
        <p className="text-base md:text-lg text-foreground-700 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10">
          Fale com a manger.pt e descubra como integrar sobremesas artesanais, consistentes e cuidadosamente desenvolvidas na sua operação.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-10 md:mb-12">
          <a
            href="https://wa.me/351000000000"
            className="px-7 py-3 rounded-full bg-primary-500 text-background-50 text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center" />
            Pedir informações
          </a>
          <Link
            to="/catalogo"
            className="px-7 py-3 rounded-full border border-background-300 text-foreground-800 text-sm font-semibold hover:bg-background-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            Ver sobremesas
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <a
            href="tel:+351000000000"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background-50 border border-background-200/70 hover:border-secondary-300/60 transition-colors cursor-pointer"
          >
            <i className="ri-phone-line w-5 h-5 flex items-center justify-center text-secondary-500" />
            <span className="text-sm font-medium text-foreground-800">+351 000 000 000</span>
          </a>
          <a
            href="mailto:ola@manger.pt"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background-50 border border-background-200/70 hover:border-secondary-300/60 transition-colors cursor-pointer"
          >
            <i className="ri-mail-line w-5 h-5 flex items-center justify-center text-secondary-500" />
            <span className="text-sm font-medium text-foreground-800">ola@manger.pt</span>
          </a>
          <a
            href="https://wa.me/351000000000"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background-50 border border-background-200/70 hover:border-secondary-300/60 transition-colors cursor-pointer"
          >
            <i className="ri-whatsapp-line w-5 h-5 flex items-center justify-center text-secondary-500" />
            <span className="text-sm font-medium text-foreground-800">WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}