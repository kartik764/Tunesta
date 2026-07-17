import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import HowItWorks from "../components/landing/HowItWorks";
import LiveRoomPreview from "../components/landing/LiveRoomPreview";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

function LandingPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-20 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[150px]" />
        <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[170px]" />
      </div>

      <Navbar />
      <HeroSection />
      <HowItWorks />
      <LiveRoomPreview />
      <CTASection />
      <Footer />
    </main>
  );
}

export default LandingPage;