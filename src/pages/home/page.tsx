import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import Hero from "@/pages/home/components/Hero";
import ValuesBar from "@/pages/home/components/ValuesBar";
import Familias from "@/pages/home/components/Familias";
import ChefSignature from "@/pages/home/components/ChefSignature";
import Destaques from "@/pages/home/components/Destaques";
import ComoFunciona from "@/pages/home/components/ComoFunciona";
import Sazonal from "@/pages/home/components/Sazonal";
import B2B from "@/pages/home/components/B2B";
import Testemunhos from "@/pages/home/components/Testemunhos";
import FAQ from "@/pages/home/components/FAQ";
import Newsletter from "@/pages/home/components/Newsletter";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <Header transparentOnTop />
      <Hero />
      <ValuesBar />
      <Familias />
      <ChefSignature />
      <Destaques />
      <ComoFunciona />
      <Sazonal />
      <B2B />
      <Testemunhos />
      <FAQ />
      <Newsletter />
      <Footer />
    </main>
  );
}