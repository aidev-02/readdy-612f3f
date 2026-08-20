export default function SobreChef() {
  return (
    <section className="bg-primary-950 text-background-50 py-20 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden h-[400px] md:h-[520px]">
              <img
                src="https://readdy.ai/api/search-image?query=Professional%20male%20pastry%20chef%20in%20white%20uniform%20working%20with%20precision%20on%20elegant%20dessert%20plating%20in%20premium%20kitchen%2C%20warm%20golden%20lighting%2C%20focused%20expression%2C%20artisanal%20pastry%20craftsmanship%2C%20editorial%20portrait%20photography%2C%20soft%20background%20bokeh&width=600&height=800&seq=chef-manuel-brito&orientation=portrait"
                alt="Chef Manuel Brito - Pastelaria artesanal premium"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-secondary-300 mb-4">
              <span className="w-8 h-px bg-secondary-400" />
              Sobre o Chef
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-5">
              Experiência, técnica e paixão pela pastelaria
            </h2>
            <p className="text-base text-background-100/85 leading-relaxed mb-5">
              O Chef Manuel Brito desenvolve sobremesas que combinam técnica, qualidade e criatividade. A proposta vai além do fornecimento: ajudar cada parceiro a construir uma oferta consistente, diferenciada e adequada ao público.
            </p>
            <p className="text-base text-background-100/85 leading-relaxed mb-5">
              Cada criação atende à seleção criteriosa de matérias-primas, ao equilíbrio de sabores e texturas e a um padrão de execução que garante qualidade em cada fornecimento.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {[
                { valor: "15+", label: "Anos de experiência" },
                { valor: "30+", label: "Parceiros B2B" },
                { valor: "100%", label: "Artesanal" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-xl bg-background-50/5 border border-background-50/10 text-center"
                >
                  <div className="font-heading text-2xl md:text-3xl font-bold text-secondary-300 mb-1">
                    {stat.valor}
                  </div>
                  <div className="text-xs uppercase tracking-wider font-label text-background-200/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}