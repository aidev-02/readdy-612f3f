import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Catalogo from "../pages/catalogo/page";
import ProdutoDetalhe from "../pages/produto/page";
import Encomenda from "../pages/encomenda/page";
import Pedido from "../pages/pedido/page";
import Sobre from "../pages/sobre/page";
import Contactos from "../pages/contactos/page";
import ParaEmpresas from "../pages/para-empresas/page";
import AdminLogin from "../pages/admin/login/page";
import AdminDashboard from "../pages/admin/dashboard/page";
import AdminCatalogo from "../pages/admin/catalogo/page";
import AdminEncomendas from "../pages/admin/encomendas/page";
import AdminAgenda from "../pages/admin/agenda/page";
import AdminClientes from "../pages/admin/clientes/page";
import AdminProducao from "../pages/admin/producao/page";
import AdminSeguranca from "../pages/admin/seguranca/page";
import AdminCadastros from "../pages/admin/cadastros/page";
import AdminOrcamentos from "../pages/admin/orcamentos/page";
import Levantamento from "../pages/levantamento/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/catalogo",
    element: <Catalogo />,
  },
  {
    path: "/produto/:slug",
    element: <ProdutoDetalhe />,
  },
  {
    path: "/encomenda",
    element: <Encomenda />,
  },
  {
    path: "/pedido",
    element: <Pedido />,
  },
  {
    path: "/sobre",
    element: <Sobre />,
  },
  {
    path: "/contactos",
    element: <Contactos />,
  },
  {
    path: "/para-empresas",
    element: <ParaEmpresas />,
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/catalogo",
    element: <AdminCatalogo />,
  },
  {
    path: "/admin/encomendas",
    element: <AdminEncomendas />,
  },
  {
    path: "/admin/agenda",
    element: <AdminAgenda />,
  },
  {
    path: "/admin/clientes",
    element: <AdminClientes />,
  },
  {
    path: "/admin/producao",
    element: <AdminProducao />,
  },
  {
    path: "/admin/seguranca",
    element: <AdminSeguranca />,
  },
  {
    path: "/admin/cadastros",
    element: <AdminCadastros />,
  },
  {
    path: "/admin/orcamentos",
    element: <AdminOrcamentos />,
  },
  {
    path: "/levantamento",
    element: <Levantamento />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;