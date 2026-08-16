import React from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { QuickContactBar } from "./components/QuickContactBar";
import { ProductCategories } from "./components/ProductCategories";
import { Services } from "./components/Services";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { CustomerTypes } from "./components/CustomerTypes";
import { Gallery } from "./components/Gallery";
import { ContactCTA } from "./components/ContactCTA";
import { Location } from "./components/Location";
import { FloatingContact } from "./components/FloatingContact";
import { Footer } from "./components/Footer";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FA] text-slate-800 antialiased font-sans">
      {/* 1. Header with Sticky glassmorphism & navigation */}
      <Header />

      {/* Main Content Flow: Trust -> Products/Services -> Real Images -> Location -> Contact */}
      <main className="flex-1">
        {/* 2. Hero Section (55/45 split, trust points, image badge) */}
        <Hero />

        {/* 3. Quick Contact Bar (Immediate action bar) */}
        <QuickContactBar />

        {/* 4. Product Categories Section (6 main HVAC supply groups) */}
        <ProductCategories />

        {/* 5. Services & Solutions Section (4 main HVAC engineering solutions) */}
        <Services />

        {/* 6. Why Choose Us Section (4 core brand pillars) */}
        <WhyChooseUs />

        {/* 7. Target Customer Types Section */}
        <CustomerTypes />

        {/* 8. Real Gallery Section with Lightbox */}
        <Gallery />

        {/* 9. Big Contact CTA Banner */}
        <ContactCTA />

        {/* 10. Location & Embedded Google Maps Section */}
        <Location />
      </main>

      {/* 11. Floating Contacts (Sticky right side desktop, bottom bar mobile) */}
      <FloatingContact />

      {/* 12. Corporate Footer */}
      <Footer />
    </div>
  );
};

export default App;
