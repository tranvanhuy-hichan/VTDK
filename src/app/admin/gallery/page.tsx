import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { isAdminAuthenticated } from "../actions";
import { GalleryManager } from "../../../components/admin/GalleryManager";

export const revalidate = 0; // Disable caching on the admin dashboard

export default async function AdminGalleryPage() {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    redirect("/admin/login");
  }

  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return <GalleryManager initialImages={images} />;
}
