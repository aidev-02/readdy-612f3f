import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import HeroContactos from "./components/HeroContactos";
import InfoContactos from "./components/InfoContactos";
import FormularioContactos from "./components/FormularioContactos";
import MapaEZonas from "./components/MapaEZonas";
import FAQEntregas from "./components/FAQEntregas";

export default function ContactosPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background-50">
      <Header transparentOnTop={false} />

      <main className="flex-1">
        <HeroContactos />
        <InfoContactos />
        <FormularioContactos />
        <MapaEZonas />
        <FAQEntregas />
      </main>

      <Footer />
    </div>
  );
}