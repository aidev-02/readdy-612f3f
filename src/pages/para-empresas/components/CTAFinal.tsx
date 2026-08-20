export default function CTAFinal() {
  return (
    <section className="bg-primary-950 text-background-50 py-20 md:py-28">
      <div className="w-full px-4 md:px-10 max-w-4xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-secondary-300 mb-5">
          <span className="w-8 h-px bg-secondary-400" />
          Vamos conversar
          <span className="w-8 h-px bg-secondary-400" />
        </span>

        <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">
          Transforme a sobremesa num motivo para o cliente voltar
        </h2>

        <p className="text-lg text-background-100/85 leading-relaxed max-w-2xl mx-auto mb-4">
          A experiência de uma refeição não termina no prato principal. Uma sobremesa memorável aumenta a satisfação, reforça a percepção de qualidade e cria uma última impressão capaz de definir toda a experiência.
        </p>

        <p className="text-base text-background-100/70 leading-relaxed max-w-xl mx-auto mb-10">
          Com a Manger.pt, o seu estabelecimento pode oferecer sobremesas de alto nível, com identidade, consistência e excelente relação entre qualidade e custo.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#formulario-comercial"
            className="px-8 py-3.5 rounded-full bg-secondary-500 hover:bg-secondary-400 text-primary-950 text-sm font-semibold cursor-pointer whitespace-nowrap inline-flex items-center gap-2 justify-center transition-colors"
          >
            <i className="ri-file-list-3-line w-4 h-4 flex items-center justify-center" />
            Quero elevar a minha carta de sobremesas
          </a>
          <a
            href="https://wa.me/351000000000"
            rel="nofollow"
            className="px-8 py-3.5 rounded-full border-2 border-background-50/30 hover:bg-background-50/10 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap inline-flex items-center gap-2 justify-center transition-colors"
          >
            <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center" />
            Falar com a Manger.pt
          </a>
        </div>

        <p className="mt-8 text-sm text-background-200/60">
          Manger.pt — sobremesas criadas para valorizar o seu negócio e permanecer na memória dos seus clientes.
        </p>
      </div>
    </section>
  );
}