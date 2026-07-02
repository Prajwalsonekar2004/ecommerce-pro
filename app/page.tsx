import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/shared/HeroSection";
import FeaturedProducts from "@/components/shared/FeaturedProducts";
import CategorySection from "@/components/shared/CategorySection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <FeaturedProducts />
      </main>
      <Footer />
    </>
  );
}
