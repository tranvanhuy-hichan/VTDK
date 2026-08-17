import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { isAdminAuthenticated } from "../actions";
import { ServiceManager } from "../../../components/admin/ServiceManager";

export const revalidate = 0; // Disable caching on the admin dashboard

export default async function AdminServicesPage() {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    redirect("/admin/login");
  }

  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return <ServiceManager initialServices={services} />;
}
