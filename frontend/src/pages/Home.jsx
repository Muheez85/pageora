import Hero from "../sections/Home/Hero";
import CategoriesSection from "../sections/Home/CategoriesSection";
import FeaturedBooks from "../sections/Home/FeaturedBooks";
import WhyChooseUs from "../sections/Home/WhyChooseUs";
import Newsletter from "../sections/Home/NewsLetter";
import Footer from "../components/Footer";
const Home = () => {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <FeaturedBooks />
      <WhyChooseUs />
      <Newsletter />
      <Footer />
    </>
  );
};

export default Home;