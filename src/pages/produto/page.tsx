import { useParams, Link } from "react-router-dom";
import { produtos } from "@/mocks/catalogo";
import ProdutoGallery from "./components/ProdutoGallery";
import ProdutoInfo from "./components/ProdutoInfo";
import ProdutosRelacionados from "./components/ProdutosRelacionados";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";

export default function ProdutoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const produto = produtos.find((p) => p.slug === slug && p.estado === "publicado");

  if (!produto) {
    return (
      <>
        <Header transparentOnTop={false} />
        <main className="min-h-[60vh] flex items-center justify-center bg-background-50">
          <div className="text-center px-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-background-100 flex items-center justify-center">
              <i className="ri-cake-2-line w-10 h-10 flex items-center justify-center text-foreground-400" />
            </div>
            <h1 className="font-heading text-2xl text-foreground-950 font-bold mb-2">
              Produto não encontrado
            </h1>
            <p className="text-foreground-500 mb-6">
              Este produto pode ter sido removido ou o endereço está incorreto.
            </p>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 text-background-50 text-sm font-semibold uppercase tracking-wider font-label hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center" />
              Ver catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header transparentOnTop={false} />
      <main className="bg-background-50 pt-24">
        {/* Produto detail section */}
        <section className="w-full px-4 md:px-10 py-10 md:py-14">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* Left: Gallery */}
            <div className="w-full lg:w-5/12">
              <ProdutoGallery
                imagem={produto.imagem}
                nome={produto.nome}
                tag={produto.tag}
                assinaturaChef={produto.assinaturaChef}
                familia={produto.familia}
                familiaSlug={produto.familiaSlug}
                b2b={produto.b2b}
              />
            </div>

            {/* Right: Info */}
            <div className="w-full lg:w-7/12">
              <ProdutoInfo produto={produto} />
            </div>
          </div>
        </section>

        {/* Long description */}
        {produto.descricaoLonga && (
          <section className="w-full px-4 md:px-10 py-10 md:py-14 bg-background-100">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-label text-primary-700 mb-4">
                <span className="w-8 h-px bg-primary-500" />
                A história
              </span>
              <h4 className="font-heading text-2xl md:text-3xl text-foreground-950 font-bold mb-5 leading-tight">
                Sobre esta criação.
              </h4>
              <p className="text-foreground-700 leading-relaxed text-base">
                {produto.descricaoLonga}
              </p>
            </div>
          </section>
        )}

        {/* Related products */}
        <ProdutosRelacionados produtos={produtos} produtoAtual={produto} />
      </main>
      <Footer />
    </>
  );
}