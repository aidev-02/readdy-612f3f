import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[720px] lg:min-h-[820px] flex items-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://readdy.ai/api/search-image?query=Moody%20artisanal%20patisserie%20kitchen%20scene%20with%20chef%20hands%20decorating%20a%20cheesecake%20with%20fresh%20red%20berries%20and%20golden%20flake%2C%20soft%20window%20light%20from%20left%2C%20warm%20terracotta%20and%20cream%20color%20palette%2C%20flour%20dust%20in%20air%2C%20rustic%20wood%20surface%20with%20ceramic%20plates%2C%20portuguese%20premium%20patisserie%20mood%2C%20editorial%20food%20photography%20with%20cinematic%20depth%20of%20field%20and%20natural%20shadows&width=2000&height=1400&seq=hero-manger-main&orientation=landscape')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/60 via-primary-950/40 to-primary-950/85" />
      <div className="absolute inset-0 texture-paper opacity-40" />

      <div className="relative w-full px-4 md:px-10 pb-16 md:pb-24 pt-32">
        <div className="max-w-3xl animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-500/20 border border-secondary-400/40 text-secondary-100 text-xs uppercase tracking-[0.24em] font-label whitespace-nowrap">
            <i className="ri-quill-pen-line w-3 h-3 flex items-center justify-center" />
            Assinatura Chef Manuel Brito
          </span>
          <h1 className="mt-6 font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-background-50 leading-[1.05] tracking-tight">
            Sobremesas feitas <em className="text-secondary-300 not-italic">à mão</em>,
            <br className="hidden md:block" />
            para os teus dias marcantes.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-background-100/90 max-w-2xl leading-relaxed">
            Cheesecakes, cremeux, bolos de eventos e criações sazonais — sempre por
            encomenda, com ingredientes reais e o carinho de uma pastelaria artesanal
            portuguesa.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/encomenda"
              className="px-7 py-4 rounded-full bg-primary-500 hover:bg-primary-400 text-background-50 text-base font-semibold cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors"
            >
              <i className="ri-shopping-bag-3-line w-5 h-5 flex items-center justify-center" />
              Fazer encomenda
            </Link>
            <Link
              to="/catalogo"
              className="px-7 py-4 rounded-full bg-background-50/10 hover:bg-background-50/20 border border-background-50/30 text-background-50 text-base font-semibold cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors backdrop-blur-sm"
            >
              Ver catálogo
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center" />
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl">
            <div>
              <div className="font-heading text-3xl md:text-4xl text-secondary-300 font-bold">7+</div>
              <div className="text-xs md:text-sm text-background-100/80 mt-1 uppercase tracking-wider font-label">
                Anos de casa
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl text-secondary-300 font-bold">40+</div>
              <div className="text-xs md:text-sm text-background-100/80 mt-1 uppercase tracking-wider font-label">
                Criações no catálogo
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl text-secondary-300 font-bold">100%</div>
              <div className="text-xs md:text-sm text-background-100/80 mt-1 uppercase tracking-wider font-label">
                Feito por encomenda
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-2 text-background-50/80 text-xs uppercase tracking-[0.24em] font-label rotate-[-90deg] origin-bottom-right">
        <span>Scroll</span>
        <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center" />
      </div>
    </section>
  );
}