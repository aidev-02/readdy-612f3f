import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";
import DadosEmpresa from "./components/DadosEmpresa";
import DadosAcesso from "./components/DadosAcesso";
import DadosOperacao from "./components/DadosOperacao";

type TabKey = "empresa" | "acesso" | "operacao";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "empresa", label: "Dados da Empresa", icon: "ri-building-2-line" },
  { key: "acesso", label: "Dados de Acesso", icon: "ri-shield-user-line" },
  { key: "operacao", label: "Dados de Operação", icon: "ri-settings-3-line" },
];

export default function AdminSegurancaPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("empresa");

  useEffect(() => {
    const session = localStorage.getItem("manger_admin_session");
    if (!session) {
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <div className="min-h-[100dvh] flex bg-background-50">
      <AdminSidebar activeHref="/admin/seguranca" title="Segurança" />

      <main className="flex-1 lg:pt-0 pt-14">
        <div className="px-4 md:px-8 py-6 md:py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
                <i className="ri-shield-check-line text-xl w-5 h-5 flex items-center justify-center" />
              </div>
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">Segurança</h1>
                <p className="text-sm text-foreground-600">Configurações administrativas do sistema</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "bg-primary-500 text-background-50 shadow-sm"
                    : "bg-background-100 text-foreground-600 hover:bg-background-200/70 border border-background-200/70"
                }`}
              >
                <i className={`${tab.icon} w-4 h-4 flex items-center justify-center`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="rounded-xl bg-background-100 border border-background-200/70 p-6 md:p-8">
            {activeTab === "empresa" && <DadosEmpresa />}
            {activeTab === "acesso" && <DadosAcesso />}
            {activeTab === "operacao" && <DadosOperacao />}
          </div>
        </div>
      </main>
    </div>
  );
}