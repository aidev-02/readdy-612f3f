import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface EmpresaData {
  id: number;
  nome_empresa: string;
  nome_conhecido: string;
  morada: string;
  nipc: string;
  telefone: string;
  email_corporativo: string;
  titulo_slogan: string;
  responsavel: string;
  email_responsavel: string;
  telefone_responsavel: string;
}

const EMPTY_EMPRESA: EmpresaData = {
  id: 1,
  nome_empresa: "",
  nome_conhecido: "",
  morada: "",
  nipc: "",
  telefone: "",
  email_corporativo: "",
  titulo_slogan: "",
  responsavel: "",
  email_responsavel: "",
  telefone_responsavel: "",
};

export default function DadosEmpresa() {
  const [data, setData] = useState<EmpresaData>(EMPTY_EMPRESA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const { data: row, error } = await supabase
        .from("admin_empresa")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      if (row) setData(row as EmpresaData);
    } catch {
      // mantém o estado atual
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleChange = (field: keyof EmpresaData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setMsg(null);
    setSaving(true);
    try {
      const { error } = await supabase
        .from("admin_empresa")
        .upsert({
          id: 1,
          nome_empresa: data.nome_empresa,
          nome_conhecido: data.nome_conhecido,
          morada: data.morada,
          nipc: data.nipc,
          telefone: data.telefone,
          email_corporativo: data.email_corporativo,
          titulo_slogan: data.titulo_slogan,
          responsavel: data.responsavel,
          email_responsavel: data.email_responsavel,
          telefone_responsavel: data.telefone_responsavel,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      setMsg({ type: "success", text: "Dados da empresa guardados com sucesso." });
    } catch {
      setMsg({ type: "error", text: "Erro ao guardar os dados. Tenta novamente." });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <i className="ri-loader-4-line animate-spin text-xl w-6 h-6 flex items-center justify-center text-foreground-400" />
      </div>
    );
  }

  const fields: { label: string; field: keyof EmpresaData; type?: string; placeholder?: string }[] = [
    { label: "Nome da Empresa", field: "nome_empresa", placeholder: "Ex: Manger Unipessoal Lda" },
    { label: "Nome Conhecido", field: "nome_conhecido", placeholder: "Ex: Manger.pt" },
    { label: "Morada", field: "morada", placeholder: "Rua, nº, código postal, cidade" },
    { label: "NIPC", field: "nipc", placeholder: "Ex: 123456789" },
    { label: "Telefone", field: "telefone", placeholder: "Ex: +351 913 664 756" },
    { label: "E-mail Corporativo", field: "email_corporativo", type: "email", placeholder: "Ex: manger.pt@outlook.com" },
    { label: "Título / Slogan", field: "titulo_slogan", placeholder: "Ex: Pastelaria Artesanal de Excelência" },
    { label: "Responsável", field: "responsavel", placeholder: "Nome do responsável" },
    { label: "E-mail do Responsável", field: "email_responsavel", type: "email", placeholder: "Email do responsável" },
    { label: "Telefone do Responsável", field: "telefone_responsavel", placeholder: "Telefone do responsável" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((f) => (
          <div key={f.field} className={f.field === "morada" || f.field === "titulo_slogan" ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium text-foreground-800 mb-1.5">
              {f.label}
            </label>
            <input
              type={f.type || "text"}
              value={data[f.field]}
              onChange={(e) => handleChange(f.field, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-4 py-2.5 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors"
        >
          {saving ? (
            <>
              <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
              A guardar...
            </>
          ) : (
            <>
              <i className="ri-save-line w-4 h-4 flex items-center justify-center" />
              Guardar alterações
            </>
          )}
        </button>

        {msg && (
          <span className={`text-sm font-medium flex items-center gap-1.5 ${msg.type === "success" ? "text-emerald-700" : "text-red-700"}`}>
            <i className={`${msg.type === "success" ? "ri-check-line" : "ri-error-warning-line"} w-4 h-4 flex items-center justify-center`} />
            {msg.text}
          </span>
        )}
      </div>
    </div>
  );
}