import Navbar from "@/components/portfolio/Navbar";
import SmoothScroll from "@/components/portfolio/SmoothScroll";
import Hero from "@/components/portfolio/Hero";
import Statement from "@/components/portfolio/Statement";
import Work from "@/components/portfolio/Work";
import Footer from "@/components/portfolio/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main>
        <Hero />
        <Statement />
        <Work />
        <Footer />
      </main>
    </>
  );
}