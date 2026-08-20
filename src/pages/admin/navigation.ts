export interface MenuItem {
  label: string;
  icon: string;
  href: string;
}

export const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: "ri-dashboard-line", href: "/admin/dashboard" },
  { label: "Catálogo", icon: "ri-cake-3-line", href: "/admin/catalogo" },
  { label: "Encomendas", icon: "ri-shopping-bag-3-line", href: "/admin/encomendas" },
  { label: "Orçamentos", icon: "ri-file-list-3-line", href: "/admin/orcamentos" },
  { label: "Agenda", icon: "ri-calendar-line", href: "/admin/agenda" },
  { label: "Clientes", icon: "ri-team-line", href: "/admin/clientes" },
  { label: "Produção", icon: "ri-restaurant-line", href: "/admin/producao" },
  { label: "Segurança", icon: "ri-shield-check-line", href: "/admin/seguranca" },
];

export const cadastrosSubItems: MenuItem[] = [
  { label: "Família", icon: "ri-folder-2-line", href: "/admin/cadastros?tab=familia" },
  { label: "Alergénicos", icon: "ri-virus-line", href: "/admin/cadastros?tab=alergenicos" },
  { label: "Ingredientes", icon: "ri-leaf-line", href: "/admin/cadastros?tab=ingredientes" },
  { label: "Disponibilidade", icon: "ri-time-line", href: "/admin/cadastros?tab=disponibilidade" },
  { label: "Categorias B2B", icon: "ri-building-2-line", href: "/admin/cadastros?tab=categorias-b2b" },
  { label: "Tipo de Orçamento", icon: "ri-file-list-3-line", href: "/admin/cadastros?tab=tipo-orcamento" },
  { label: "Tamanho", icon: "ri-ruler-line", href: "/admin/cadastros?tab=tamanho" },
  { label: "Formato", icon: "ri-shapes-line", href: "/admin/cadastros?tab=formato" },
  { label: "Unidade de Medida", icon: "ri-scales-3-line", href: "/admin/cadastros?tab=unidade-medida" },
  { label: "TemplateProposta", icon: "ri-file-word-2-line", href: "/admin/cadastros?tab=template-proposta" },
];