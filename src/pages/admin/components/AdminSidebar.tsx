import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { menuItems, cadastrosSubItems } from "@/pages/admin/navigation";

interface AdminSidebarProps {
  activeHref: string;
  title: string;
}

export default function AdminSidebar({ activeHref, title }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cadastrosOpen, setCadastrosOpen] = useState(false);

  const isCadastrosActive = location.pathname.startsWith("/admin/cadastros");

  const handleLogout = () => {
    localStorage.removeItem("manger_admin_session");
    navigate("/admin");
  };

  const isActive = (itemHref: string) => itemHref === activeHref;

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary-950 text-background-50 border-r border-background-50/10">
        <div className="p-6">
          <Link to="/" className="inline-block cursor-pointer">
            <img
              src="https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/c935aa9a-c680-41c9-a0a6-ff65cb4f7853_compressed_manger.pt_logo.webp"
              alt="Manger.pt"
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] font-label text-background-200/60">
            Painel administrativo
          </p>
        </div>

        <nav className="flex-1 px-3 py-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive(item.href)
                      ? "bg-background-50/10 text-background-50"
                      : "text-background-200/80 hover:bg-background-50/10 hover:text-background-50"
                  }`}
                >
                  <i className={`${item.icon} w-5 h-5 flex items-center justify-center`} />
                  {item.label}
                </Link>
              </li>
            ))}

            {/* Cadastros com sub-itens colapsável */}
            <li>
              <button
                type="button"
                onClick={() => setCadastrosOpen((v) => !v)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isCadastrosActive
                    ? "bg-background-50/10 text-background-50"
                    : "text-background-200/80 hover:bg-background-50/10 hover:text-background-50"
                }`}
              >
                <i className="ri-database-2-line w-5 h-5 flex items-center justify-center" />
                <span className="flex-1 text-left">Cadastros</span>
                <i className={`${cadastrosOpen ? "ri-subtract-line" : "ri-add-line"} w-4 h-4 flex items-center justify-center shrink-0`} />
              </button>
              {cadastrosOpen && (
                <ul className="ml-2 mt-1 space-y-0.5 border-l border-background-50/10">
                  {cadastrosSubItems.map((sub) => (
                    <li key={sub.href}>
                      <Link
                        to={sub.href}
                        className="flex items-center gap-2.5 pl-8 pr-3 py-2 rounded-lg text-xs font-medium text-background-200/60 hover:bg-background-50/5 hover:text-background-200/90 transition-colors cursor-pointer"
                      >
                        <i className={`${sub.icon} w-4 h-4 flex items-center justify-center`} />
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-background-50/10">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-background-200/80 hover:bg-background-50/10 hover:text-background-50 transition-colors cursor-pointer"
          >
            <i className="ri-logout-box-r-line w-5 h-5 flex items-center justify-center" />
            Terminar sessão
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary-950 text-background-50 h-14 flex items-center justify-between px-4 border-b border-background-50/10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-background-50/10 cursor-pointer"
            aria-label="Menu"
          >
            <i className={`${sidebarOpen ? "ri-close-line" : "ri-menu-line"} text-lg w-5 h-5 flex items-center justify-center`} />
          </button>
          <span className="font-heading text-base font-semibold">{title}</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-background-50/10 cursor-pointer"
          aria-label="Sair"
        >
          <i className="ri-logout-box-r-line text-lg w-5 h-5 flex items-center justify-center" />
        </button>
      </div>

      {/* Mobile sidebar panel */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-primary-950 text-background-50 flex flex-col pt-16">
            <nav className="flex-1 px-3 py-2 overflow-y-auto">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive(item.href)
                          ? "bg-background-50/10 text-background-50"
                          : "text-background-200/80 hover:bg-background-50/10 hover:text-background-50"
                      }`}
                    >
                      <i className={`${item.icon} w-5 h-5 flex items-center justify-center`} />
                      {item.label}
                    </Link>
                  </li>
                ))}

                {/* Cadastros colapsável mobile */}
                <li>
                  <button
                    type="button"
                    onClick={() => setCadastrosOpen((v) => !v)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      isCadastrosActive
                        ? "bg-background-50/10 text-background-50"
                        : "text-background-200/80 hover:bg-background-50/10 hover:text-background-50"
                    }`}
                  >
                    <i className="ri-database-2-line w-5 h-5 flex items-center justify-center" />
                    <span className="flex-1 text-left">Cadastros</span>
                    <i className={`${cadastrosOpen ? "ri-subtract-line" : "ri-add-line"} w-4 h-4 flex items-center justify-center shrink-0`} />
                  </button>
                  {cadastrosOpen && (
                    <ul className="ml-2 mt-1 space-y-0.5 border-l border-background-50/10">
                      {cadastrosSubItems.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            to={sub.href}
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-2.5 pl-8 pr-3 py-2 rounded-lg text-xs font-medium text-background-200/60 hover:bg-background-50/5 hover:text-background-200/90 transition-colors cursor-pointer"
                          >
                            <i className={`${sub.icon} w-4 h-4 flex items-center justify-center`} />
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
    </>
  );
}