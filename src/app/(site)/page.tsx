import React from "react";
import { prisma } from "../../lib/prisma";
import { getCompanyInfo } from "../../lib/company";
import { Hero } from "../../components/Hero";
import { BrandSlider } from "../../components/BrandSlider";
import { ProductList } from "../../components/ProductList";
import { Services } from "../../components/Services";
import { WhyChooseUs } from "../../components/WhyChooseUs";
import { CustomerTypes } from "../../components/CustomerTypes";
import { Gallery } from "../../components/Gallery";
import { Location } from "../../components/Location";

// Statically cached and refreshed on-demand via revalidatePath("/") in
// admin/actions.ts whenever a product/service/gallery/company edit is saved.

export default async function HomePage() {
  // Fetch categories and active products
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
      {/* Render the dynamic product catalog */}
      <ProductList initialCategories={categories} initialProducts={products} company={company} />
      <Services company={company} services={services} />
      <WhyChooseUs company={company} />
      <CustomerTypes />
      <Gallery />
      <Location company={company} />
    </>
  );
}
