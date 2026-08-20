import { valores } from "@/mocks/home";

export default function ValuesBar() {
  return (
    <section className="bg-background-100 border-y border-background-200/70">
      <div className="w-full px-4 md:px-10 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {valores.map((v) => (
          <div key={v.titulo} className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 shrink-0">
              <i className={`${v.icon} text-xl w-6 h-6 flex items-center justify-center`} />
            </div>
            <div>
              <h3 className="font-heading text-lg text-foreground-950 font-semibold">
                {v.titulo}
              </h3>
              <p className="text-sm text-foreground-700 mt-1 leading-relaxed">{v.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}