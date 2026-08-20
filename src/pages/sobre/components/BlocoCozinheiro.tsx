export default function BlocoCozinheiro() {
  return (
    <section className="w-full bg-background-100 texture-paper py-16 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -top-4 -left-4 text-8xl md:text-9xl text-primary-300/20 font-heading leading-none select-none">
                &ldquo;
              </div>
              <blockquote className="relative z-10 pl-6 md:pl-8">
                <p className="text-lg md:text-xl font-heading font-500 text-foreground-800 leading-relaxed mb-6">
                  Sou chef de cozinha, mas prefiro dizer que sou cozinheiro. Gosto de estar no calor, no ritmo e no desafio de uma cozinha a tempo inteiro.
                </p>
                <p className="text-base md:text-lg text-foreground-700 leading-relaxed mb-6">
                  Sou exigente com a qualidade, com o sabor e com cada detalhe. Acredito que os melhores resultados começam sempre com ingredientes de primeira qualidade. Posso dizer que sou bem old school.
                </p>
                <footer className="text-sm font-label uppercase tracking-[0.15em] text-secondary-600">
                  — Manuel Brito Junior
                </footer>
              </blockquote>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
              {[
                { label: "Qualidade", icon: "ri-shield-check-line" },
                { label: "Sabor", icon: "ri-restaurant-line" },
                { label: "Exigência", icon: "ri-fire-line" },
                { label: "Ingredientes Premium", icon: "ri-leaf-line" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 px-3 py-4 rounded-lg bg-background-50 border border-background-200/70"
                >
                  <i className={`${item.icon} w-5 h-5 flex items-center justify-center text-secondary-500`} />
                  <span className="text-xs font-label uppercase tracking-[0.1em] text-foreground-600 text-center whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src="https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/0e794196-95c1-4c04-9ae5-170822bdd8f7_compressed_Chef-Manuel-Brito-Jr-no-MANGER.webp"
                alt="Chef Manuel Brito Junior"
                className="w-full aspect-[4/5] object-cover object-top rounded-lg"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background-100 shadow-lg hidden md:block">
                <img
                  src="https://readdy.ai/api/search-image?query=Close%20up%20of%20pastry%20chef%20hands%20piping%20chocolate%20decoration%20on%20a%20cream%20dessert%20in%20warm%20golden%20lighting%2C%20artisan%20kitchen%20detail%2C%20shallow%20depth%20of%20field%2C%20brown%20and%20cream%20color%20palette%2C%20editorial%20food%20photography&width=400&height=400&seq=sobre-chef-detail&orientation=squarish"
                  alt="Detalhe das mãos do Chef Manuel Brito"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}