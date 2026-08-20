import { useState } from "react";
import { faqB2B } from "@/mocks/b2b";

export default function FAQ() {
  const [aberto, setAberto] = useState<number | null>(0);

  const toggle = (i: number) => setAberto(aberto === i ? null : i);

  return (
    <section className="bg-background-50 py-20 md:py-24">
      <div className="w-full px-4 md:px-10 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-600 mb-4">
            <span className="w-8 h-px bg-primary-400" />
            Perguntas frequentes
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight">
            Reduzir objeções e esclarecer dúvidas
          </h2>
        </div>

        <div className="space-y-3">
          {faqB2B.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-background-200/70 bg-background-100 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
              >
                <span className="font-heading text-base font-semibold text-foreground-950">
                  {item.pergunta}
                </span>
                <i
                  className={`${
                    aberto === i ? "ri-subtract-line" : "ri-add-line"
                  } text-primary-600 w-5 h-5 flex items-center justify-center shrink-0`}
                />
              </button>
              {aberto === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-foreground-600 leading-relaxed">{item.resposta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}