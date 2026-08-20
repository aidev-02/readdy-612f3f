import { Link } from "react-router-dom";

export default function HeroContactos() {
  return (
    <section className="relative w-full min-h-[480px] md:min-h-[560px] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://readdy.ai/api/search-image?query=Elegant%20artisanal%20pastry%20shop%20interior%20with%20warm%20terracotta%20walls%2C%20rustic%20wooden%20counter%20with%20ceramic%20cake%20stands%2C%20soft%20golden%20afternoon%20light%20streaming%20through%20window%2C%20fresh%20flowers%20in%20terracotta%20pots%2C%20warm%20cream%20and%20olive%20tones%2C%20Portuguese%20patisserie%20atmosphere%2C%20editorial%20interior%20photography%20with%20shallow%20depth%20of%20field&width=1600&height=900&seq=contactos-hero-manger&orientation=landscape')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-950/50 to-primary-950/70" />
      <div className="absolute inset-0 texture-paper opacity-30" />

      <div className="relative w-full px-4 md:px-10 py-32">
        <div className="max-w-3xl animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-500/20 border border-secondary-400/40 text-secondary-100 text-xs uppercase tracking-[0.24em] font-label whitespace-nowrap">
            <i className="ri-map-pin-line w-3 h-3 flex items-center justify-center" />
            Encontrar a Manger
          </span>
          <h1 className="mt-6 font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-background-50 leading-[1.1] tracking-tight">
            Fala connosco
          </h1>
          <p className="mt-5 text-lg md:text-xl text-background-100/90 max-w-xl leading-relaxed">
            Estamos aqui para tornar os teus momentos especiais ainda mais doces.
            Encomenda, pergunta ou simplesmente diz olá.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/encomenda"
              className="px-7 py-3.5 rounded-full bg-primary-500 hover:bg-primary-400 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors"
            >
              <i className="ri-shopping-bag-3-line w-5 h-5 flex items-center justify-center" />
              Fazer encomenda
            </Link>
            <a
              href="tel:+351000000000"
              className="px-7 py-3.5 rounded-full bg-background-50/10 hover:bg-background-50/20 border border-background-50/30 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors backdrop-blur-sm"
            >
              <i className="ri-phone-line w-5 h-5 flex items-center justify-center" />
              +351 000 000 000
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}