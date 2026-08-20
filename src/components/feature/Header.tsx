import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCartContext } from "@/pages/encomenda/hooks/CartContext";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Encomendar", href: "/encomenda" },
  { label: "Para Empresas", href: "/para-empresas" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contactos", href: "/contactos" },
];

const FALLBACK_PHONE = "+351 000 000 000";

export default function Header({ transparentOnTop = true }: { transparentOnTop?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [phone, setPhone] = useState<string>(FALLBACK_PHONE);
  const location = useLocation();
  const { itemCount } = useCartContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let active = true;
    supabase
      .from("admin_empresa")
      .select("telefone")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data?.telefone) setPhone(data.telefone);
      })
      .catch(() => {
        // mantém o telefone de fallback
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isTransparent = transparentOnTop && !scrolled;
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-background-50/95 backdrop-blur-md border-b border-background-200/70"
      }`}
    >
      <div className="w-full px-4 md:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer">
          <img
            src="https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/c935aa9a-c680-41c9-a0a6-ff65cb4f7853_compressed_manger.pt_logo.webp"
            alt="Manger.pt"
            className={`h-10 w-auto transition-all duration-300 ${
              isTransparent ? "brightness-0 invert" : ""
            }`}
          />
          <span
            className={`hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-label font-semibold ${
              isTransparent ? "text-background-100/90" : "text-foreground-700"
            }`}
          >
            <span className={`w-4 h-px rounded-full ${
              isTransparent ? "bg-secondary-400" : "bg-secondary-500"
            }`} />
            STUDIO DE Pastelaria Artesanal
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                isTransparent
                  ? "text-background-50 hover:bg-background-50/15"
                  : "text-foreground-800 hover:bg-background-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/admin"
            className={`flex items-center gap-2 text-sm font-medium whitespace-nowrap cursor-pointer ${
              isTransparent ? "text-background-50 hover:text-secondary-300" : "text-foreground-800 hover:text-primary-600"
            }`}
          >
            <i className="ri-login-box-line w-4 h-4 flex items-center justify-center" />
            <span>Login</span>
          </Link>
          <a
            href={phoneHref}
            className={`flex items-center gap-2 text-sm font-medium whitespace-nowrap ${
              isTransparent ? "text-background-50" : "text-foreground-800"
            }`}
          >
            <i className="ri-phone-line w-4 h-4 flex items-center justify-center" />
            <span>{phone}</span>
          </a>
          <Link
            to="/pedido"
            className="relative px-5 py-2.5 rounded-full bg-primary-500 text-background-50 text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-shopping-bag-3-line w-4 h-4 flex items-center justify-center" />
            Ver pedido
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent-500 text-background-50 text-[11px] font-bold flex items-center justify-center leading-none shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <button
          type="button"
          className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-full cursor-pointer ${
            isTransparent
              ? "bg-background-50/15 text-background-50"
              : "bg-background-100 text-foreground-800"
          }`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          <i
            className={`${
              mobileOpen ? "ri-close-line" : "ri-menu-line"
            } text-xl w-5 h-5 flex items-center justify-center`}
          />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background-50 border-t border-background-200 shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-3 text-base font-medium text-foreground-800 rounded-lg hover:bg-background-100 cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-background-200 my-2" />
            <Link
              to="/admin"
              className="px-4 py-3 text-base font-medium text-foreground-800 rounded-lg hover:bg-background-100 cursor-pointer flex items-center gap-2.5"
            >
              <i className="ri-login-box-line w-5 h-5 flex items-center justify-center" />
              Login
            </Link>
            <a
              href={phoneHref}
              className="px-4 py-3 text-base font-medium text-foreground-800 rounded-lg hover:bg-background-100 cursor-pointer flex items-center gap-2.5"
            >
              <i className="ri-phone-line w-5 h-5 flex items-center justify-center" />
              {phone}
            </a>
            <Link
              to="/pedido"
              className="mt-2 px-5 py-3 rounded-full bg-primary-500 text-background-50 text-base font-semibold text-center cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              <i className="ri-shopping-bag-3-line w-4 h-4 flex items-center justify-center" />
              Ver pedido
              {itemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-accent-500 text-background-50 text-[11px] font-bold flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}