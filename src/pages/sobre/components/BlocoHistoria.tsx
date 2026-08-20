export default function BlocoHistoria() {
  return (
    <section id="trajetoria" className="w-full bg-background-50 py-16 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs uppercase tracking-[0.2em] font-label text-secondary-600 mb-3">
            A origem
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-600 text-foreground-950 mb-4">
            Uma trajetória internacional
          </h2>
          <p className="text-base md:text-lg text-foreground-600 max-w-2xl mx-auto leading-relaxed">
            De um hobby familiar a uma carreira internacional marcada pela exigência, técnica e disciplina.
          </p>
        </div>

        <div className="space-y-10 md:space-y-14">
          <div className="relative pl-8 md:pl-12 border-l-2 border-secondary-300/60">
            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-secondary-500 border-4 border-background-50" />
            <span className="text-xs font-label uppercase tracking-[0.15em] text-secondary-600 mb-2 block">
              Algarve, Portugal
            </span>
            <h3 className="text-lg md:text-xl font-heading font-600 text-foreground-900 mb-2">
              O ponto de viragem
            </h3>
            <p className="text-sm md:text-base text-foreground-700 leading-relaxed">
              Manuel Brito Junior sempre gostou de cozinhar, mas durante muito tempo viu essa relação como um hobby. O ponto de viragem aconteceu quando recebeu o convite para trabalhar numa cozinha profissional, num restaurante no Algarve. Foi ali que percebeu que queria fazer da cozinha a sua vida.
            </p>
          </div>

          <div className="relative pl-8 md:pl-12 border-l-2 border-secondary-300/60">
            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-secondary-500 border-4 border-background-50" />
            <span className="text-xs font-label uppercase tracking-[0.15em] text-secondary-600 mb-2 block">
              Londres, Reino Unido
            </span>
            <h3 className="text-lg md:text-xl font-heading font-600 text-foreground-900 mb-2">
              Formação no Le Cordon Bleu
            </h3>
            <p className="text-sm md:text-base text-foreground-700 leading-relaxed">
              Consciente de que precisava de aprofundar os seus conhecimentos, mudou-se para Londres e estudou no Le Cordon Bleu, onde concluiu formação em cozinha e pâtisserie — duas disciplinas que moldariam para sempre a sua abordagem ao trabalho.
            </p>
          </div>

          <div className="relative pl-8 md:pl-12 border-l-2 border-secondary-300/60">
            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-secondary-500 border-4 border-background-50" />
            <span className="text-xs font-label uppercase tracking-[0.15em] text-secondary-600 mb-2 block">
              Portugal · Londres · Noruega
            </span>
            <h3 className="text-lg md:text-xl font-heading font-600 text-foreground-900 mb-2">
              Uma carreira construída com rigor
            </h3>
            <p className="text-sm md:text-base text-foreground-700 leading-relaxed">
              A partir daí, construiu uma carreira internacional marcada por exigência, técnica, disciplina e contacto com diferentes culturas gastronómicas. Passou por cozinhas de referência em Portugal, Londres e Noruega, acumulando mais de 10 anos de experiência em hotéis e restaurantes de prestígio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}