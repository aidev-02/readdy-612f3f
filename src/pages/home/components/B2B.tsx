import { Link } from "react-router-dom";

export default function B2B() {
  return (
    <section className="bg-accent-950 text-background-50 relative overflow-hidden">
      <div className="w-full px-4 md:px-10 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-secondary-300 mb-4">
            <span className="w-8 h-px bg-secondary-400" />
            Para profissionais
          </span>
          <h4 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
            <a href="/para-empresas" className="cursor-pointer hover:text-secondary-300 transition-colors">
              Sobremesas de assinatura na tua carta.
            </a>
          </h4>
          <p className="mt-5 text-base md:text-lg text-background-100/85 leading-relaxed max-w-2xl">
            Restaurantes, hotéis e hostels contam com a Manger.pt para elevar a
            sobremesa da casa. Encomenda recorrente, preço sob consulta, entregas
            organizadas por rota.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            {[
              { icon: "ri-repeat-line", title: "Recorrente", text: "Encomenda semanal ou mensal fixa." },
              { icon: "ri-price-tag-3-line", title: "Sob consulta", text: "Preço adaptado ao volume real." },
              { icon: "ri-truck-line", title: "Entrega organizada", text: "Rota fixa em dias combinados." },
            ].map((f) => (
              <div key={f.title} className="p-4 rounded-xl bg-background-50/5 border border-background-50/10">
                <i className={`${f.icon} text-2xl text-secondary-300 mb-2 w-6 h-6 flex items-center justify-center`} />
                <h5 className="font-heading text-base font-semibold text-background-50">{f.title}</h5>
                <p className="text-xs text-background-100/80 mt-1 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              to="/para-empresas"
              className="px-6 py-3.5 rounded-full bg-secondary-500 hover:bg-secondary-400 text-primary-950 text-sm font-semibold cursor-pointer whitespace-nowrap inline-flex items-center gap-2 justify-center"
            >
              Pedir catálogo profissional
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
            </Link>
            <a
              href="mailto:profissionais@manger.pt"
              className="px-6 py-3.5 rounded-full border border-background-50/30 hover:bg-background-50/10 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap inline-flex items-center gap-2 justify-center"
            >
              <i className="ri-mail-line w-4 h-4 flex items-center justify-center" />
              profissionais@manger.pt
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden h-[420px] md:h-[500px]">
            <img
              src="https://readdy.ai/api/search-image?query=Elegant%20fine%20dining%20restaurant%20plated%20dessert%20with%20cremeux%20and%20berry%20garnish%20on%20white%20ceramic%20plate%20being%20served%20by%20waiter%2C%20warm%20candle%20light%2C%20restaurant%20interior%20with%20cream%20tablecloth%2C%20soft%20focus%20background%2C%20editorial%20restaurant%20photography%2C%20premium%20artisanal%20quality%20mood%20with%20golden%20cutlery%20detail&width=1000&height=1200&seq=b2b-restaurant&orientation=portrait"
              alt="Sobremesas para restaurantes"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute -bottom-6 left-4 md:-left-6 bg-background-50 text-foreground-950 p-5 rounded-2xl max-w-[220px]">
            <div className="text-xs uppercase tracking-wider font-label text-primary-700 mb-1">
              Parceiros
            </div>
            <div className="font-heading text-2xl font-bold text-foreground-950">30+</div>
            <div className="text-xs text-foreground-700 mt-1">
              Restaurantes, hotéis e hostels em Portugal
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}