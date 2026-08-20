import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import HeroB2B from "./components/HeroB2B";
import IntroB2B from "./components/IntroB2B";
import Beneficios from "./components/Beneficios";
import ParceriaESolucoes from "./components/ParceriaESolucoes";
import QualidadeEIngredientes from "./components/QualidadeEIngredientes";
import CustoEDiferenciais from "./components/CustoEDiferenciais";
import GaleriaProdutos from "./components/GaleriaProdutos";
import SolucoesSegmentos from "./components/SolucoesSegmentos";
import Degustacao from "./components/Degustacao";
import ComoFunciona from "./components/ComoFunciona";
import SobreChef from "./components/SobreChef";
import FAQ from "./components/FAQ";
import FormularioComercial from "./components/FormularioComercial";
import CTAFinal from "./components/CTAFinal";
import MobileCTA from "./components/MobileCTA";

export default function ParaEmpresasPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background-50 pb-20 md:pb-0">
      <Header transparentOnTop={false} />

      <main className="flex-1">
        <HeroB2B />
        <IntroB2B />
        <Beneficios />
        <ParceriaESolucoes />
        <QualidadeEIngredientes />
        <CustoEDiferenciais />
        <GaleriaProdutos />
        <SolucoesSegmentos />
        <Degustacao />
        <ComoFunciona />
        <SobreChef />
        <FAQ />
        <FormularioComercial />
        <CTAFinal />
      </main>

      <Footer />
      <MobileCTA />
    </div>
  );
}