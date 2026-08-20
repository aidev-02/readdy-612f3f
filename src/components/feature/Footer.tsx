import { Link } from "react-router-dom";

const familias = [
  { label: "Cheesecakes", href: "/catalogo?familia=cheesecakes" },
  { label: "Cremeux", href: "/catalogo?familia=cremeux" },
  { label: "Bolos & Eventos", href: "/catalogo?familia=bolos-eventos" },
  { label: "Troncos de Natal", href: "/catalogo?familia=troncos" },
  { label: "Para Empresas", href: "/para-empresas" },
];

const links = [
  { label: "Como funciona", href: "/#como-funciona" },
  { label: "Sobre o Chef", href: "/sobre" },
  { label: "Zonas de entrega", href: "/contactos#zonas" },
  { label: "Termos & condições", href: "/termos" },
  { label: "Política de privacidade", href: "/privacidade" },
];

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-background-100">
      <div className="w-full px-4 md:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src="https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/c935aa9a-c680-41c9-a0a6-ff65cb4f7853_compressed_manger.pt_logo.webp"
              alt="Manger.pt"
              className="h-10 w-auto brightness-0 invert"
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.24em] font-label text-background-200/70 mb-5 block">
            by Chef Manuel Brito
          </span>
          <p className="text-sm text-background-200/80 leading-relaxed max-w-xs">
            Pastelaria & culinária artesanal, feita por encomenda com carinho, atenção
            aos detalhes e ingredientes reais.
          </p>
          <div className="flex items-center gap-2 mt-6">
            <a
              href="https://instagram.com"
              rel="nofollow"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-background-50/10 hover:bg-secondary-500 hover:text-primary-950 transition-colors cursor-pointer"
              aria-label="Instagram"
            >
              <i className="ri-instagram-line text-lg w-5 h-5 flex items-center justify-center" />
            </a>
            <a
              href="https://facebook.com"
              rel="nofollow"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-background-50/10 hover:bg-secondary-500 hover:text-primary-950 transition-colors cursor-pointer"
              aria-label="Facebook"
            >
              <i className="ri-facebook-fill text-lg w-5 h-5 flex items-center justify-center" />
            </a>
            <a
              href="https://wa.me/351000000000"
              rel="nofollow"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-background-50/10 hover:bg-secondary-500 hover:text-primary-950 transition-colors cursor-pointer"
              aria-label="WhatsApp"
            >
              <i className="ri-whatsapp-line text-lg w-5 h-5 flex items-center justify-center" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-lg text-background-50 mb-5">
            <a href="#familias" className="cursor-pointer hover:text-secondary-400">
              Famílias
            </a>
          </h4>
          <ul className="space-y-3">
            {familias.map((f) => (
              <li key={f.href}>
                <Link
                  to={f.href}
                  className="text-sm text-background-200/80 hover:text-background-50 cursor-pointer"
                >
                  {f.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-lg text-background-50 mb-5">
            <a href="#institucional" className="cursor-pointer hover:text-secondary-400">
              A casa
            </a>
          </h4>
          <ul className="space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  className="text-sm text-background-200/80 hover:text-background-50 cursor-pointer"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-lg text-background-50 mb-5">
            <a href="#contacto" className="cursor-pointer hover:text-secondary-400">
              Fala connosco
            </a>
          </h4>
          <ul className="space-y-4 text-sm text-background-200/80">
            <li className="flex items-start gap-3">
              <i className="ri-map-pin-2-line text-secondary-400 mt-0.5 w-4 h-4 flex items-center justify-center" />
              <span>Portugal · Take-away & delivery</span>
            </li>
            <li className="flex items-start gap-3">
              <i className="ri-phone-line text-secondary-400 mt-0.5 w-4 h-4 flex items-center justify-center" />
              <a href="tel:+351000000000" className="hover:text-background-50 cursor-pointer">
                +351 000 000 000
              </a>
            </li>
            <li className="flex items-start gap-3">
              <i className="ri-mail-line text-secondary-400 mt-0.5 w-4 h-4 flex items-center justify-center" />
              <a href="mailto:ola@manger.pt" className="hover:text-background-50 cursor-pointer">
                ola@manger.pt
              </a>
            </li>
            <li className="flex items-start gap-3">
              <i className="ri-time-line text-secondary-400 mt-0.5 w-4 h-4 flex items-center justify-center" />
              <span>Encomendas: 24 h · 48 h antecedência</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background-50/10">
        <div className="w-full px-4 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background-200/70">
          <span>© {new Date().getFullYear()} Manger.pt · Todos os direitos reservados.</span>
          <span className="flex items-center gap-2">
            Feito com <i className="ri-heart-3-fill text-primary-400 w-3 h-3 flex items-center justify-center" /> em Portugal
          </span>
        </div>
      </div>
    </footer>
  );
}