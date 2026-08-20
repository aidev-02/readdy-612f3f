import { Link } from "react-router-dom";

export default function HeroB2B() {
  return (
    <section className="relative min-h-[600px] md:min-h-[720px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=Professional%20pastry%20chef%20working%20in%20elegant%20kitchen%20preparing%20premium%20artisanal%20desserts%2C%20warm%20ambient%20lighting%2C%20chocolate%20and%20berries%20on%20marble%20counter%2C%20fine%20dining%20restaurant%20kitchen%20background%2C%20editorial%20food%20photography%2C%20golden%20tones%2C%20shallow%20depth%20of%20field%2C%20luxurious%20atmosphere&width=1600&height=900&seq=b2b-hero-2026&orientation=landscape"
          alt="Chef Manuel Brito a preparar sobremesas premium para hotéis e restaurantes"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/85 via-primary-950/70 to-primary-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-primary-950/30" />
      </div>

      <div className="relative z-10 w-full px-4 md:px-10 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-500/20 border border-secondary-400/30 text-secondary-300 text-xs uppercase tracking-[0.2em] font-label backdrop-blur-sm">
              <i className="ri-vip-crown-line w-3.5 h-3.5 flex items-center justify-center" />
              Soluções B2B
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-50/10 border border-background-50/20 text-background-100 text-xs uppercase tracking-[0.2em] font-label backdrop-blur-sm">
              <i className="ri-hand-heart-line w-3.5 h-3.5 flex items-center justify-center" />
              Produção artesanal
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-background-50 leading-[1.1] mb-6">
            Sobremesas premium para elevar a experiência dos seus clientes
          </h1>

          <p className="text-lg md:text-xl text-background-100/90 leading-relaxed max-w-2xl mb-4">
            Criações artesanais assinadas pelo Chef Manuel Brito para hotéis, restaurantes e eventos que procuram qualidade, consistência, personalização e uma excelente relação entre valor e resultado.
          </p>

          <p className="text-base text-background-100/70 leading-relaxed max-w-xl mb-10">
            Integre sobremesas de elevado nível na sua oferta sem aumentar a complexidade da cozinha.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#formulario-comercial"
              className="px-7 py-3.5 rounded-full bg-secondary-500 hover:bg-secondary-400 text-primary-950 text-sm font-semibold cursor-pointer whitespace-nowrap inline-flex items-center gap-2 justify-center transition-colors"
            >
              <i className="ri-file-list-3-line w-4 h-4 flex items-center justify-center" />
              Solicitar uma proposta personalizada
            </a>
            <a
              href="#degustacao"
              className="px-7 py-3.5 rounded-full border-2 border-background-50/40 hover:bg-background-50/10 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap inline-flex items-center gap-2 justify-center transition-colors"
            >
              <i className="ri-calendar-event-line w-4 h-4 flex items-center justify-center" />
              Agendar uma degustação
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-background-100/70">
            <span className="flex items-center gap-2">
              <i className="ri-check-double-line w-4 h-4 flex items-center justify-center text-secondary-300" />
              Ingredientes premium
            </span>
            <span className="flex items-center gap-2">
              <i className="ri-check-double-line w-4 h-4 flex items-center justify-center text-secondary-300" />
              Fornecimento flexível
            </span>
            <span className="flex items-center gap-2">
              <i className="ri-check-double-line w-4 h-4 flex items-center justify-center text-secondary-300" />
              Sem contrato obrigatório
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}