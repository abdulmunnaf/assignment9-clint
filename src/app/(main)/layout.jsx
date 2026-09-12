import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer/>
    </>
  );
}