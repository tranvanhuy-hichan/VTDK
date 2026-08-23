import React from "react";
import { prisma } from "../../lib/prisma";
import { getCompanyInfo } from "../../lib/company";
import { Hero } from "../../components/home/Hero";
import { BrandSlider } from "../../components/home/BrandSlider";
import { ProductList } from "../../components/product/ProductList";
import { Services } from "../../components/home/Services";
import { WhyChooseUs } from "../../components/home/WhyChooseUs";
import { CustomerTypes } from "../../components/home/CustomerTypes";
import { Gallery } from "../../components/home/Gallery";
import { Location } from "../../components/home/Location";

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

  const galleryImages = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <>
      <Hero company={company} />
      <BrandSlider />
      {/* Render the dynamic product catalog */}
      <ProductList initialCategories={categories} initialProducts={products} company={company} />
      <CustomerTypes />
      <Services company={company} services={services} />
      <WhyChooseUs company={company} />
      <Gallery items={galleryImages} />
      <Location company={company} />
    </>
  );
}
