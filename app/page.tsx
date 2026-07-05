import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/hero/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import ShopByCategory from "@/components/home/ShopByCategory";
import TrendingCollection from "@/components/home/TrendingCollection";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <FeaturedProducts />
        <NewArrivals />
        <ShopByCategory />
        <TrendingCollection />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}
