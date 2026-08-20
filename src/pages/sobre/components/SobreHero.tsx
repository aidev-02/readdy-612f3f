import { Link } from "react-router-dom";

export default function SobreHero() {
  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/6ab777ce-fad3-4bce-ae16-488277fd3516_compressed_CHEF-MANUEL-BRITO-NA-COZINHA.webp"
          alt="Chef Manuel Brito Junior em ação na cozinha"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
      </div>

      <div className="relative z-10 w-full px-4 md:px-10 pt-28 pb-16 text-center">
        <span className="inline-block text-xs md:text-sm uppercase tracking-[0.2em] font-label text-secondary-400 mb-4 md:mb-5">
          O Chef por detrás da manger.pt
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-700 text-background-50 leading-tight mb-4 md:mb-5 max-w-5xl mx-auto">
          Manuel Brito Junior
        </h1>
        <p className="text-xl md:text-2xl font-heading font-500 text-secondary-300 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
          Cozinheiro por vocação. Chef por experiência.
        </p>
        <p className="text-sm md:text-base text-background-200/90 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10">
          Uma trajetória construída entre Portugal, Londres e Noruega, com formação no Le Cordon Bleu e uma paixão inabalável pela cozinha, pelo sabor e pela excelência.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <a
            href="#trajetoria"
            className="px-7 py-3 rounded-full bg-secondary-500 text-primary-950 text-sm font-semibold hover:bg-secondary-400 transition-colors cursor-pointer whitespace-nowrap"
          >
            Conhecer a trajetória
          </a>
          <a
            href="https://wa.me/351000000000"
            className="px-7 py-3 rounded-full border border-background-50/40 text-background-50 text-sm font-semibold hover:bg-background-50/10 transition-colors cursor-pointer whitespace-nowrap"
          >
            Falar com a manger.pt
          </a>
        </div>
      </div>
    </section>
  );
}