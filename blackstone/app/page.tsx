import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DeliveringSection from "@/components/DeliveringSection";
import FeaturedStories from "@/components/FeaturedStories";
import SignUpSection from "@/components/SignUpSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <Hero />

      <DeliveringSection />

      {/* Dark "Build Wealth" Section from image */}
      <section className="bg-bx-black text-white py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 block">Our Approach</span>
          <h2 className="text-5xl md:text-8xl font-serif font-light mb-12">
            Build wealth with <span className="italic">conviction</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            We invest in themes, not just assets. We look for opportunities where others see challenges.
          </p>
          <button className="text-sm font-bold uppercase tracking-widest border border-white px-8 py-4 hover:bg-white hover:text-bx-black transition-colors">
            Explore Our Strategies
          </button>
        </div>
      </section>

      <FeaturedStories />

      <SignUpSection />

      <Footer />
    </main>
  );
}
