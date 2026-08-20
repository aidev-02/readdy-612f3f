export default function ChefSignature() {
  return (
    <section className="bg-primary-950 text-background-50 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://readdy.ai/api/search-image?query=Warm%20abstract%20wood%20and%20flour%20texture%20background%20with%20golden%20light%20streaks%2C%20artisanal%20kitchen%20mood%2C%20cinematic%20soft%20focus%2C%20warm%20terracotta%20and%20cream%20tones%2C%20subtle%20flour%20dust%20particles&width=1800&height=1200&seq=chef-texture&orientation=landscape')",
          backgroundSize: "cover",
        }}
      />
      <div className="relative w-full px-4 md:px-10 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="relative w-full h-[560px] rounded-2xl overflow-hidden">
            <img
              src="https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/0e794196-95c1-4c04-9ae5-170822bdd8f7_compressed_Chef-Manuel-Brito-Jr-no-MANGER.webp"
              alt="Chef Manuel Brito"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 md:-right-6 max-w-xs bg-secondary-500 text-primary-950 p-5 rounded-2xl">
            <div className="flex items-start gap-3">
              <i className="ri-double-quotes-l text-3xl leading-none w-8 h-8 flex items-center justify-center" />
              <div>
                <p className="text-sm font-medium leading-relaxed">
                  Uma boa sobremesa não se serve — recebe-se com atenção. É por isso que trabalhamos por encomenda.
                </p>
                <p className="mt-3 text-xs uppercase tracking-widest font-label font-bold">
                  Chef Manuel Brito
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:pl-10">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-secondary-300 mb-5">
            <span className="w-8 h-px bg-secondary-400" />
            O Chef
          </span>
          <h4 className="font-heading text-4xl md:text-5xl font-bold leading-tight text-background-50">
            <a href="/sobre" className="cursor-pointer hover:text-secondary-300 transition-colors">
              Cada criação carrega uma assinatura.
            </a>
          </h4>
          <p className="mt-6 text-base md:text-lg text-background-100/90 leading-relaxed">
            O Chef Manuel Brito traz para a Manger.pt anos de experiência em pastelaria
            fina — mas mantém o gesto simples: fruta madura, chocolate certo, técnica
            clássica e o tempo que cada sobremesa precisa.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "ri-award-line", title: "Formação clássica", text: "Escolas de pastelaria em Portugal e Europa." },
              { icon: "ri-heart-3-line", title: "Foco no detalhe", text: "Cada decoração é feita à mão, sem atalhos." },
              { icon: "ri-leaf-line", title: "Fornecedores locais", text: "Fruta e laticínios de produtores portugueses." },
              { icon: "ri-restaurant-line", title: "Cozinha aberta", text: "Trabalho com restaurantes, hotéis e hostels." },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-xl bg-background-50/5 border border-background-50/10"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-500 text-primary-950 shrink-0">
                  <i className={`${item.icon} text-lg w-5 h-5 flex items-center justify-center`} />
                </div>
                <div>
                  <h5 className="font-heading text-base font-semibold text-background-50">
                    {item.title}
                  </h5>
                  <p className="text-sm text-background-100/80 mt-1 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}