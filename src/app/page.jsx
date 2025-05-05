import Bestsellers from "@/components/Bestsellers";
import CuratedEdit from "@/components/CuratedEdit";
import FeaturedCollections from "@/components/FeaturedCollections";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import ShopByCategory from "@/components/ShopByCategory";
import ThePalmEdit from "@/components/ThePalmEdit";
import CustomerLove from "@/components/CustomerLove";


export default function Home() {
  return (
    <>
      <Hero />
      {/* <FeaturedCollections/> */}
      {/* <ThePalmEdit />
      <CuratedEdit /> */}
      <Bestsellers />
      <ShopByCategory />
      {/* <CustomerLove /> */}
      <Newsletter />
    </>
  );
}
