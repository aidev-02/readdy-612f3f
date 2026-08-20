import { Link } from "react-router-dom";

export default function BlocoManger() {
  return (
    <section className="w-full bg-background-50 py-16 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative">
            <img
              src="https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/d89df36c-0f25-489c-82c3-7823e0af4364_compressed_Chef-Manuel----criando-3.webp"
              alt="Chef Manuel Brito a finalizar sobremesas artesanais"
              className="w-full aspect-[4/3] object-cover object-top rounded-lg"
            />
            <div className="absolute -bottom-5 -left-5 bg-background-50 border border-background-200/70 rounded-lg p-4 md:p-5 shadow-sm hidden md:block">
              <p className="text-sm font-heading font-600 text-foreground-900 mb-1">
                Sobremesas artesanais
              </p>
              <p className="text-xs text-foreground-600">
                Feitas por encomenda com ingredientes reais
              </p>
            </div>
          </div>

          <div>
            <span className="inline-block text-xs uppercase tracking-[0.2em] font-label text-secondary-600 mb-3">
              Da experiência internacional para a sua mesa
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-600 text-foreground-950 mb-5 leading-tight">
              A origem da manger.pt
            </h2>
            <p className="text-base md:text-lg text-foreground-700 leading-relaxed mb-5">
              A manger.pt nasceu da vontade de levar o trabalho, a experiência e a paixão do Chef Manuel Brito para um novo mercado. A marca desenvolve sobremesas artesanais de alta qualidade para restaurantes, hotéis e hostels que não possuem um chef de pastelaria na sua equipa.
            </p>
            <p className="text-base md:text-lg text-foreground-700 leading-relaxed mb-8">
              Cada produto é preparado com matérias-primas de primeira linha, procurando garantir sabores autênticos, apresentação cuidada e uma solução consistente para negócios que valorizam qualidade sem comprometer a eficiência operacional.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "Produção artesanal com rigor técnico",
                "Fornecimento direto para canal profissional",
                "Consistência de sabor e apresentação",
                "Matérias-primas premium e selecionadas",
                "Soluções para pequenos e médios negócios",
                "Apoio a operações sem pastelaria interna",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm md:text-base text-foreground-700">
                  <i className="ri-check-line w-4 h-4 flex items-center justify-center text-secondary-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/profissionais"
                className="px-6 py-3 rounded-full bg-primary-500 text-background-50 text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap text-center"
              >
                Saber mais para profissionais
              </Link>
              <Link
                to="/catalogo"
                className="px-6 py-3 rounded-full border border-background-300 text-foreground-800 text-sm font-semibold hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap text-center"
              >
                Ver sobremesas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}