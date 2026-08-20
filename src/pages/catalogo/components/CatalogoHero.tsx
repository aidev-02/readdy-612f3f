import { Link } from "react-router-dom";

export default function CatalogoHero() {
  return (
    <section className="relative min-h-[420px] md:min-h-[520px] flex items-center bg-primary-900 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://readdy.ai/api/search-image?query=Warm%20abstract%20wood%20and%20flour%20texture%20background%20with%20golden%20light%20streaks%2C%20artisanal%20kitchen%20mood%2C%20cinematic%20soft%20focus%2C%20warm%20terracotta%20and%20cream%20tones%2C%20subtle%20flour%20dust%20particles&width=1800&height=800&seq=cat-hero-texture&orientation=landscape')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/50 via-primary-950/40 to-primary-950/70" />
      <div className="relative w-full px-4 md:px-10 pt-28 pb-20 md:pt-32 md:pb-24 text-center">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-secondary-300 mb-6">
            <Link to="/" className="hover:text-background-50 transition-colors cursor-pointer">
              Início
            </Link>
            <i className="ri-arrow-right-s-line w-3 h-3 flex items-center justify-center" />
            <span className="text-background-50">Catálogo</span>
          </nav>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-background-50 font-bold leading-tight mb-5">
            O nosso catálogo
          </h1>
          <p className="text-lg md:text-xl text-secondary-200 leading-relaxed max-w-2xl mx-auto">
            Cheesecakes cremosos, cremeux individuais, troncos sazonais e sobremesas para eventos —
            tudo assinado pelo Chef Manuel Brito e preparado por encomenda.
          </p>
        </div>
      </div>
    </section>
  );
}