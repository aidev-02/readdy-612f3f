import { Link } from "react-router-dom";

interface ProdutoGalleryProps {
  imagem: string;
  nome: string;
  tag: string;
  assinaturaChef: boolean;
  familia: string;
  familiaSlug: string;
  b2b: boolean;
}

export default function ProdutoGallery({
  imagem,
  nome,
  tag,
  assinaturaChef,
  familia,
  familiaSlug,
  b2b,
}: ProdutoGalleryProps) {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center gap-2 text-sm font-label text-foreground-500" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary-600 transition-colors cursor-pointer whitespace-nowrap">
          Início
        </Link>
        <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center" />
        <Link to="/catalogo" className="hover:text-primary-600 transition-colors cursor-pointer whitespace-nowrap">
          Catálogo
        </Link>
        <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center" />
        <Link
          to={`/catalogo?familia=${familiaSlug}`}
          className="hover:text-primary-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          {familia}
        </Link>
        <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center" />
        <span className="text-foreground-800 font-medium truncate">{nome}</span>
      </nav>

      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-background-100">
        <img
          src={imagem}
          alt={nome}
          className="w-full h-full object-cover object-center"
        />
        <span
          className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider font-label ${
            b2b
              ? "bg-accent-100 text-accent-900"
              : "bg-secondary-500 text-primary-950"
          }`}
        >
          {tag}
        </span>
        {assinaturaChef && (
          <span className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-background-50/90 text-primary-700 text-xs font-semibold flex items-center gap-1.5">
            <i className="ri-quill-pen-line w-3.5 h-3.5 flex items-center justify-center" />
            Chef Manuel Brito
          </span>
        )}
      </div>
    </div>
  );
}