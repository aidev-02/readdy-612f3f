import { useState } from "react";

const images = [
  {
    src: "https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/a41ec32a-a999-4a0e-a4da-7e15ba7cd6fb_compressed_Chef-Manuel----criando.webp",
    alt: "Chef Manuel Brito a empratar uma sobremesa",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://readdy.ai/api/search-image?query=Close%20up%20of%20pastry%20chef%20hands%20using%20piping%20bag%20to%20decorate%20chocolate%20ganache%20dessert%2C%20warm%20golden%20kitchen%20lighting%2C%20shallow%20depth%20of%20field%2C%20editorial%20detail%20photography%20cream%20and%20brown%20tones&width=600&height=400&seq=sobre-gal-02&orientation=landscape",
    alt: "Mãos do Chef a decorar com saco de pasteleiro",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://readdy.ai/api/search-image?query=Elegant%20finished%20artisan%20cheesecake%20with%20fresh%20berries%20and%20gold%20leaf%20on%20marble%20slab%2C%20warm%20ambient%20lighting%2C%20editorial%20food%20photography%20with%20cream%20and%20caramel%20tones&width=600&height=400&seq=sobre-gal-03&orientation=landscape",
    alt: "Cheesecake artesanal finalizado",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://readdy.ai/api/search-image?query=Artisan%20pastry%20ingredients%20arrangement%20with%20dark%20chocolate%20chunks%2C%20vanilla%20pods%2C%20fresh%20cream%20and%20cocoa%20powder%20on%20rustic%20wooden%20surface%2C%20warm%20golden%20lighting%2C%20editorial%20food%20photography%20cream%20and%20brown%20tones&width=600&height=400&seq=sobre-gal-04&orientation=landscape",
    alt: "Ingredientes premium para pastelaria artesanal",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/e34cf2c5-2780-48ea-94ac-35faa1a4e9ad_compressed_Chef-Manuel----criando-2.webp",
    alt: "Chef Manuel Brito a trabalhar cremeux",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://readdy.ai/api/search-image?query=Beautiful%20artisan%20tronco%20de%20natal%20yule%20log%20cake%20with%20chocolate%20bark%20texture%20and%20gold%20dust%20on%20dark%20surface%2C%20warm%20ambient%20lighting%2C%20editorial%20food%20photography%20with%20cream%20and%20brown%20tones&width=600&height=400&seq=sobre-gal-06&orientation=landscape",
    alt: "Tronco de Natal artesanal",
    span: "col-span-1 row-span-1",
  },
];

export default function GaleriaEditorial() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section className="w-full bg-primary-950 py-16 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs uppercase tracking-[0.2em] font-label text-secondary-400 mb-3">
            Galeria
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-600 text-background-50 mb-4">
            O trabalho em imagens
          </h2>
          <p className="text-base md:text-lg text-background-200/70 max-w-2xl mx-auto leading-relaxed">
            Texturas, ingredientes, mãos em movimento e o resultado final. Um olhar sobre a pastelaria artesanal.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          {images.map((img) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setLightbox(img.src)}
              className={`relative overflow-hidden rounded-lg cursor-pointer group ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <i className="ri-zoom-in-line w-8 h-8 flex items-center justify-center text-background-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xl" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-background-50/10 text-background-50 hover:bg-background-50/20 transition-colors cursor-pointer"
            aria-label="Fechar galeria"
          >
            <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
          </button>
          <img
            src={lightbox}
            alt="Imagem ampliada"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        </div>
      )}
    </section>
  );
}