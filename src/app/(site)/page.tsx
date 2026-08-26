import React from "react";
import { getCompanyInfo } from "../../lib/company";
import {
  getCachedCategories,
  getCachedActiveProducts,
  getCachedServices,
  getCachedGalleryImages,
} from "../../lib/cachedData";
import { parseHomepageSections } from "../../lib/sections";
import { Hero } from "../../components/home/Hero";
import { BrandSlider } from "../../components/home/BrandSlider";
import { ProductList } from "../../components/product/ProductList";
import { Services } from "../../components/home/Services";
import { WhyChooseUs } from "../../components/home/WhyChooseUs";
import { CustomerTypes } from "../../components/home/CustomerTypes";
import { Gallery } from "../../components/home/Gallery";
import { Location } from "../../components/home/Location";

export const revalidate = 3600; // 1 hour ISR, revalidated on-demand via Server Actions

export default async function HomePage() {
  // Fetch all home data concurrently with ultra-fast caching
  const [categories, products, company, services, galleryImages] = await Promise.all([
    getCachedCategories(),
    getCachedActiveProducts(),
    getCompanyInfo(),
    getCachedServices(),
    getCachedGalleryImages(),
  ]);

  const configuredSections = parseHomepageSections(company.homepageSections);

  return (
    <>
      {configuredSections.map((sec) => {
        if (!sec.enabled) return null;

        switch (sec.id) {
          case "hero":
            return <Hero key="hero" company={company} />;
          case "brands":
            return <BrandSlider key="brands" />;
          case "products":
            return (
              <ProductList
                key="products"
                initialCategories={categories}
                initialProducts={products}
                company={company}
              />
            );
          case "customerTypes":
            return <CustomerTypes key="customerTypes" company={company} />;
          case "services":
            return <Services key="services" company={company} services={services} />;
          case "whyChooseUs":
            return <WhyChooseUs key="whyChooseUs" company={company} />;
          case "gallery":
            return <Gallery key="gallery" items={galleryImages} company={company} />;
          case "location":
            return <Location key="location" company={company} />;
          default:
            return null;
        }
      })}
    </>
  );
}

