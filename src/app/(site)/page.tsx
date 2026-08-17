import React from "react";
import { prisma } from "../../lib/prisma";
import { getCompanyInfo } from "../../lib/company";
import { Hero } from "../../components/Hero";
import { BrandSlider } from "../../components/BrandSlider";
import { QuickContactBar } from "../../components/QuickContactBar";
import { ProductList } from "../../components/ProductList";
import { Services } from "../../components/Services";
import { WhyChooseUs } from "../../components/WhyChooseUs";
import { CustomerTypes } from "../../components/CustomerTypes";
import { Testimonials } from "../../components/Testimonials";
import { Gallery } from "../../components/Gallery";
import { ContactCTA } from "../../components/ContactCTA";
import { Location } from "../../components/Location";

export const revalidate = 0; // Disable caching to reflect database updates immediately

export default async function HomePage() {
  // Fetch categories and active products from SQLite
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const company = await getCompanyInfo();

  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <Hero company={company} />
      <BrandSlider />
      <QuickContactBar company={company} />
      {/* Render the dynamic product catalog */}
      <ProductList initialCategories={categories} initialProducts={products} company={company} />
      <Services company={company} services={services} />
      <WhyChooseUs company={company} />
      <CustomerTypes />
      <Testimonials />
      <Gallery />
      <ContactCTA company={company} />
      <Location company={company} />
    </>
  );
}
