import React from "react";
import { prisma } from "../../../../lib/prisma";
import { ServiceManager } from "../../../../components/admin/ServiceManager";

export const revalidate = 0; // Disable caching on the admin dashboard

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return <ServiceManager initialServices={services} />;
}
