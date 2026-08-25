import React from "react";
import { getCompanyInfo } from "../../lib/company";
import {
  getCachedCategories,
  getCachedActiveProducts,
  getCachedServices,
  getCachedGalleryImages,
} from "../../lib/cachedData";
import { Hero } from "../../components/home/Hero";
import { BrandSlider } from "../../components/home/BrandSlider";
import { ProductList } from "../../components/product/ProductList";
import { Services } from "../../components/home/Services";
import { WhyChooseUs } from "../../components/home/WhyChooseUs";
import { CustomerTypes } from "../../components/home/CustomerTypes";
import { Gallery } from "../../components/home/Gallery";
import { Location } from "../../components/home/Location";

export const revalidate = 120; // Revalidate every 2 minutes or on-demand via Server Actions

export default async function HomePage() {
  // Fetch all home data concurrently with ultra-fast caching
  const [categories, products, company, services, galleryImages] = await Promise.all([
    getCachedCategories(),
    getCachedActiveProducts(),
    getCompanyInfo(),
    getCachedServices(),
    getCachedGalleryImages(),
  ]);

  return (
    <>
      <Hero company={company} />
      <BrandSlider />
      {/* Render the dynamic product catalog */}
      <ProductList initialCategories={categories} initialProducts={products} company={company} />
      <CustomerTypes company={company} />
      <Services company={company} services={services} />
      <WhyChooseUs company={company} />
      <Gallery items={galleryImages} company={company} />
      <Location company={company} />
    </>
  );
}
