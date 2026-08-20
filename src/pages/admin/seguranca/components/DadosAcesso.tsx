import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface AdminUser {
  id: number;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
}

interface EditModalProps {
  user: AdminUser;
  onClose: () => void;
  onSaved: () => void;
}

function EditUserModal({ user, onClose, onSaved }: EditModalProps) {
  const [nome, setNome] = useState(user.nome);
  const [email, setEmail] = useState(user.email);
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!nome.trim() || !email.trim()) {
      setError("Nome e email são obrigatórios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updateData: Record<string, unknown> = {
        nome: nome.trim(),
        email: email.trim(),
        updated_at: new Date().toISOString(),
      };
      if (senha.trim()) {
        updateData.senha = senha.trim();
      }
      const { error: err } = await supabase
        .from("admin_usuarios")
        .update(updateData)
        .eq("id", user.id);
      if (err) throw err;
      onSaved();
      onClose();
    } catch {
      setError("Erro ao guardar. Tenta novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background-50 rounded-xl border border-background-200/70 w-full max-w-md p-6 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-semibold text-foreground-950">Editar utilizador</h3>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-200/60 transition-colors cursor-pointer">
            <i className="ri-close-line w-5 h-5 flex items-center justify-center text-foreground-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground-800 mb-1.5">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-800 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-800 mb-1.5">Nova palavra-passe (deixar em branco para manter)</label>
            <div className="relative">
              <input
                type={showSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 pr-12 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowSenha((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-200/60 transition-colors cursor-pointer"
              >
                <i className={`${showSenha ? "ri-eye-off-line" : "ri-eye-line"} w-4 h-4 flex items-center justify-center text-foreground-500`} />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
            <i className="ri-error-warning-line text-red-600 mt-0.5 w-4 h-4 flex items-center justify-center shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-background-300/60 text-sm font-medium text-foreground-700 hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors"
          >
            {saving ? (
              <>
                <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                A guardar...
              </>
            ) : (
              <>
                <i className="ri-save-line w-4 h-4 flex items-center justify-center" />
                Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function NovoUserForm({ onCreated }: { onCreated: () => void }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleCreate = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const { error: err } = await supabase
        .from("admin_usuarios")
        .insert({ nome: nome.trim(), email: email.trim(), senha: senha.trim(), ativo: true });
      if (err) throw err;
      setNome("");
      setEmail("");
      setSenha("");
      setExpanded(false);
      onCreated();
    } catch {
      setError("Erro ao criar utilizador. Tenta novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
      >
        <i className="ri-user-add-line w-4 h-4 flex items-center justify-center" />
        Novo utilizador
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-primary-200/60 bg-primary-50/60 p-5">
      <h4 className="font-heading text-base font-semibold text-foreground-950 mb-4">Novo utilizador</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground-800 mb-1.5">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do utilizador"
            className="w-full px-4 py-2.5 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-800 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className="w-full px-4 py-2.5 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-800 mb-1.5">Palavra-passe</label>
          <div className="relative">
            <input
              type={showSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-background-300/60 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 pr-12 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowSenha((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-200/60 transition-colors cursor-pointer"
            >
              <i className={`${showSenha ? "ri-eye-off-line" : "ri-eye-line"} w-4 h-4 flex items-center justify-center text-foreground-500`} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
          <i className="ri-error-warning-line text-red-600 mt-0.5 w-4 h-4 flex items-center justify-center shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={handleCreate}
          disabled={saving}
          className="px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors"
        >
          {saving ? (
            <>
              <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
              A criar...
            </>
          ) : (
            <>
              <i className="ri-check-line w-4 h-4 flex items-center justify-center" />
              Criar utilizador
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="px-5 py-2.5 rounded-full border border-background-300/60 text-sm font-medium text-foreground-700 hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default function DadosAcesso() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AdminUser | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("admin_usuarios")
        .select("*")
        .order("nome", { ascending: true });
      if (error) throw error;
      setUsers((data || []) as AdminUser[]);
    } catch {
      // mantém o estado atual
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error } = await supabase
        .from("admin_usuarios")
        .delete()
        .eq("id", deleteConfirm.id);
      if (error) throw error;
      setUsers((prev) => prev.filter((u) => u.id !== deleteConfirm.id));
    } catch {
      // erro silencioso
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <i className="ri-loader-4-line animate-spin text-xl w-6 h-6 flex items-center justify-center text-foreground-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <NovoUserForm onCreated={carregar} />
      </div>

      {users.length === 0 ? (
        <div className="py-12 text-center rounded-xl bg-background-100 border border-background-200/70">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background-200/60 mx-auto mb-3">
            <i className="ri-user-line text-lg w-5 h-5 flex items-center justify-center text-foreground-400" />
          </div>
          <p className="text-sm text-foreground-600">Nenhum utilizador cadastrado.</p>
        </div>
      ) : (
        <div className="rounded-xl bg-background-100 border border-background-200/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-background-200/60">
                  <th className="text-left px-5 py-3 font-medium text-foreground-600">Nome</th>
                  <th className="text-left px-5 py-3 font-medium text-foreground-600">Email</th>
                  <th className="text-left px-5 py-3 font-medium text-foreground-600">Palavra-passe</th>
                  <th className="text-left px-5 py-3 font-medium text-foreground-600">Estado</th>
                  <th className="text-right px-5 py-3 font-medium text-foreground-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-background-200/40 hover:bg-background-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-foreground-800 font-medium">{u.nome}</td>
                    <td className="px-5 py-3.5 text-foreground-600">{u.email}</td>
                    <td className="px-5 py-3.5 text-foreground-500 font-mono text-xs">••••••••</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${u.ativo ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.ativo ? "bg-emerald-500" : "bg-red-500"}`} />
                        {u.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingUser(u)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-200/60 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <i className="ri-edit-line w-4 h-4 flex items-center justify-center text-foreground-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(u)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={carregar}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-background-50 rounded-xl border border-background-200/70 w-full max-w-sm p-6 shadow-lg">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto mb-4">
              <i className="ri-error-warning-line text-xl w-6 h-6 flex items-center justify-center" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground-950 text-center mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-foreground-600 text-center mb-6">
              Tens a certeza que queres excluir o utilizador <strong>{deleteConfirm.nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 rounded-full border border-background-300/60 text-sm font-medium text-foreground-700 hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-background-50 text-sm font-semibold cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors"
              >
                <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}