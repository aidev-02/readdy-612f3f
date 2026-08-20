import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";

interface AdminPlaceholderProps {
  title: string;
  icon: string;
}

export default function AdminPlaceholder({ title, icon }: AdminPlaceholderProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem("manger_admin_session");
    if (!session) {
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <div className="min-h-[100dvh] flex bg-background-50">
      <AdminSidebar activeHref={`/admin/${title.toLowerCase()}`} title={title} />

      <main className="flex-1 lg:pt-0 pt-14">
        <div className="px-4 md:px-8 py-6 md:py-8">          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <i className={`${icon} text-xl w-5 h-5 flex items-center justify-center`} />
            </div>
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">{title}</h1>
              <p className="text-sm text-foreground-600">Módulo administrativo · Em desenvolvimento</p>
            </div>
          </div>

          <div className="rounded-xl bg-background-100 border border-background-200/70 p-8 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-background-200/60 mx-auto mb-4">
              <i className="ri-tools-line text-2xl w-6 h-6 flex items-center justify-center text-foreground-500" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-foreground-950 mb-2">
              Em construção
            </h2>
            <p className="text-sm text-foreground-600 max-w-md mx-auto leading-relaxed">
              Este módulo está a ser desenvolvido. Será necessário ligar o{" "}
              <strong>Supabase</strong> para persistência de dados e autenticação real.
              Volta ao Dashboard para explorar o que já está disponível.
            </p>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            >
              <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center" />
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}