import { useState, type FormEvent } from "react";

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const honeypot = String(formData.get("website_alt") || "").trim();
    if (honeypot) {
      setStatus("success");
      setMessage("Obrigado! Está tudo tratado.");
      form.reset();
      return;
    }
    formData.delete("website_alt");

    setStatus("loading");
    setMessage("");

    try {
      const params = new URLSearchParams();
      formData.forEach((value, key) => {
        params.append(key, String(value));
      });

      const response = await fetch("https://readdy.ai/api/form/d9f7pq8jnu01ovhhkugg", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      const responseText = await response.text();
      let parsed: { code?: string; meta?: { message?: string; detail?: string } } = {};
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = {};
      }

      const serverMsg = parsed?.meta?.message || parsed?.meta?.detail || responseText || "";
      const isSpam = serverMsg.toLowerCase().includes("spam");

      if (response.ok && parsed?.code === "OK" && !isSpam) {
        setStatus("success");
        setMessage("Obrigado! Vais receber as nossas novidades em breve.");
        form.reset();
      } else {
        setStatus("error");
        setMessage(serverMsg || "Não foi possível concluir. Tenta novamente.");
      }
    } catch {
      setStatus("error");
      setMessage("Erro de rede. Verifica a tua ligação e tenta de novo.");
    }
  };

  return (
    <section className="bg-background-50">
      <div className="w-full px-4 md:px-10 py-16">
        <div className="relative rounded-3xl bg-primary-500 text-background-50 overflow-hidden">
          <div className="absolute inset-0 texture-paper opacity-30" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 md:p-14">
            <div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-secondary-200 mb-3">
                <i className="ri-mail-line w-3 h-3 flex items-center justify-center" />
                Novidades & sazonais
              </span>
              <h4 className="font-heading text-3xl md:text-4xl font-bold leading-tight">
                <a href="#newsletter" className="cursor-pointer">
                  Sê o primeiro a saber quando abrem encomendas de Natal.
                </a>
              </h4>
              <p className="mt-3 text-sm md:text-base text-background-50/85 leading-relaxed max-w-lg">
                Uma vez por mês, no máximo. Novidades do Chef, edições sazonais e
                pequenos truques da nossa cozinha.
              </p>
            </div>

            <form
              id="newsletter"
              data-readdy-form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row gap-2 bg-background-50/95 p-2 rounded-2xl">
                <input
                  type="text"
                  name="name"
                  placeholder="O teu nome"
                  required
                  maxLength={100}
                  className="flex-1 px-4 py-3 text-sm bg-transparent text-foreground-950 placeholder:text-foreground-500 outline-none rounded-xl"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="email@exemplo.pt"
                  required
                  maxLength={150}
                  className="flex-1 px-4 py-3 text-sm bg-transparent text-foreground-950 placeholder:text-foreground-500 outline-none rounded-xl"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-5 py-3 rounded-xl bg-foreground-950 hover:bg-primary-700 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                      A enviar
                    </>
                  ) : (
                    <>
                      Subscrever
                      <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
                    </>
                  )}
                </button>
              </div>

              <input
                type="text"
                name="website_alt"
                tabIndex={-1}
                autoComplete="off"
                readOnly
                aria-hidden="true"
                className="form-safety-net"
              />

              {message && (
                <p
                  className={`text-sm ${
                    status === "success" ? "text-secondary-200" : "text-secondary-100"
                  }`}
                >
                  {message}
                </p>
              )}
              <p className="text-xs text-background-50/70">
                Ao subscrever aceitas receber emails da Manger.pt. Cancelas quando quiseres.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}