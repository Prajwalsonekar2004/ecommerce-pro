import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/shared/HeroSection";
import FeaturedProducts from "@/components/shared/FeaturedProducts";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
      </main>
      <Footer />
    </>
  );
}
