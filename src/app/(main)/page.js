import Banner from "@/components/Banner";
import FeaturedCars from "@/components/FeaturedCars";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Banner />
      <FeaturedCars />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
    </main>
  );
}
