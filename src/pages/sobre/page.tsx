import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import SobreHero from "./components/SobreHero";
import BlocoCozinheiro from "./components/BlocoCozinheiro";
import BlocoHistoria from "./components/BlocoHistoria";
import Timeline from "./components/Timeline";
import BlocoFilosofia from "./components/BlocoFilosofia";
import BlocoManger from "./components/BlocoManger";
import BlocoCredenciais from "./components/BlocoCredenciais";
import GaleriaEditorial from "./components/GaleriaEditorial";
import CTAFinal from "./components/CTAFinal";

export default function SobrePage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background-50">
      <Header transparentOnTop={false} />

      <main className="flex-1">
        <SobreHero />
        <BlocoCozinheiro />
        <BlocoHistoria />
        <Timeline />
        <BlocoFilosofia />
        <BlocoManger />
        <BlocoCredenciais />
        <GaleriaEditorial />
        <CTAFinal />
      </main>

      <Footer />
    </div>
  );
}