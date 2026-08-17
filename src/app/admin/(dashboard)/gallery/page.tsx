import React from "react";
import { prisma } from "../../../../lib/prisma";
import { GalleryManager } from "../../../../components/admin/GalleryManager";

export const revalidate = 0; // Disable caching on the admin dashboard

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return <GalleryManager initialImages={images} />;
}
