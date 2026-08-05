import Hero from "@/components/home/hero/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import TrendingCollection from "@/components/home/TrendingCollection";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <NewArrivals />
      <TrendingCollection />
      <Newsletter />
    </main>
  );
}
