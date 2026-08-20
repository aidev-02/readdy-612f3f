import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface ZonaEntrega {
  id: number;
  codigo_postal: string;
  cidade: string;
  tempo_estimado: string;
  taxa_entrega: string;
  distancia: string;
  isencao_taxa: string;
}

export default function MapaEZonas() {
  const [activeZona, setActiveZona] = useState<string | null>(null);
  const [zonasEntrega, setZonasEntrega] = useState<ZonaEntrega[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarZonas = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("admin_zonas_entrega")
          .select("*");

        if (error) throw error;

        // Ordenar por distância ascendente (extrai número da string)
        const sorted = (data || []).sort((a, b) => {
          const numA = parseInt((a.distancia || "0").match(/\d+/)?.[0] || "0", 10);
          const numB = parseInt((b.distancia || "0").match(/\d+/)?.[0] || "0", 10);
          return numA - numB;
        });

        setZonasEntrega(sorted as ZonaEntrega[]);
      } catch {
        // mantém array vazio
      } finally {
        setLoading(false);
      }
    };

    carregarZonas();
  }, []);

  return (
    <section id="zonas" className="w-full px-4 md:px-10 py-16 md:py-24 bg-background-50">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
        <div className="lg:col-span-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-100 border border-secondary-200/60 text-secondary-800 text-xs uppercase tracking-[0.24em] font-label whitespace-nowrap">
            <i className="ri-truck-line w-3 h-3 flex items-center justify-center" />
            Zonas de entrega
          </span>
          <h2 className="mt-5 font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight">
            Entregamos à porta onde estiveres
          </h2>
          <p className="mt-4 text-base text-foreground-700 leading-relaxed max-w-lg">
            Baseados em Vila Nova de Gaia, cobrimos um raio de 80 km que inclui Porto, Braga,
            Aveiro e todas as zonas intermédias. Fora desta área, contacta-nos para verificar disponibilidade.
          </p>

          <div className="mt-8 rounded-xl overflow-hidden border border-background-200/70">
            <iframe
              title="Localização Manger.pt"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3012!2d-8.6525!3d41.1265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zUnVhIE1hY2hhZG8gZG9zIFNhbnRvcywgNTkz!5e0!3m2!1spt-PT!2spt!4v1700000000000"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block"
            />
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-lg bg-accent-50 border border-accent-200/60 p-4">
            <i className="ri-information-line text-accent-600 mt-0.5 w-5 h-5 flex items-center justify-center shrink-0" />
            <p className="text-sm text-accent-800 leading-relaxed">
              <strong>Take-away também disponível.</strong> Podes levantar a tua encomenda diretamente no nosso
              atelier. Indica na encomenda se preferes levantamento — sem taxa de entrega.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-5">
            Tabela de zonas
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <i className="ri-loader-4-line animate-spin text-xl w-6 h-6 flex items-center justify-center text-foreground-400" />
            </div>
          ) : zonasEntrega.length === 0 ? (
            <div className="rounded-xl bg-background-100 border border-background-200/70 p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background-200/60 mx-auto mb-3">
                <i className="ri-map-pin-line text-lg w-5 h-5 flex items-center justify-center text-foreground-400" />
              </div>
              <p className="text-sm text-foreground-600">Nenhuma zona de entrega disponível de momento.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {zonasEntrega.map((zona) => {
                const isActive = activeZona === zona.cidade;
                return (
                  <button
                    key={zona.id}
                    type="button"
                    onClick={() => setActiveZona(isActive ? null : zona.cidade)}
                    className={`w-full text-left rounded-lg border p-4 transition-all cursor-pointer ${
                      isActive
                        ? "border-primary-300 bg-primary-50"
                        : "border-background-200/70 bg-background-100 hover:border-background-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground-950">{zona.cidade}</span>
                      <i
                        className={`${isActive ? "ri-subtract-line" : "ri-add-line"} w-4 h-4 flex items-center justify-center text-foreground-500`}
                      />
                    </div>
                    {isActive && (
                      <div className="mt-3 pt-3 border-t border-background-200/60 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground-600">Tempo estimado</span>
                          <span className="font-medium text-foreground-900">{zona.tempo_estimado || "—"}</span>
                        </div>
                        {zona.isencao_taxa ? (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground-600">Isenção de taxa</span>
                            <span className="font-medium text-foreground-900">acima de: {zona.isencao_taxa} €</span>
                          </div>
                        ) : null}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground-600">Taxa de entrega</span>
                          <span className="font-medium text-foreground-900">{zona.taxa_entrega || "—"}</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-6 rounded-xl bg-primary-950 text-background-50 p-6">
            <h4 className="font-heading text-base font-semibold mb-2">
              Não encontras a tua zona?
            </h4>
            <p className="text-sm text-background-200/80 leading-relaxed mb-4">
              Contacta-nos e verificamos se conseguimos chegar até ti. Encomendas maiores têm mais flexibilidade de zona.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                href="tel:+351000000000"
                className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-300 hover:text-secondary-200 transition-colors cursor-pointer"
              >
                <i className="ri-phone-line w-4 h-4 flex items-center justify-center" />
                +351 000 000 000
              </a>
              <a
                href="https://wa.me/351000000000"
                rel="nofollow"
                target="_blank"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent-300 hover:text-accent-200 transition-colors cursor-pointer"
              >
                <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center" />
                Conversar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}