import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/prisma";
import { ServiceForm } from "../../../../../components/admin/ServiceForm";

export const revalidate = 0; // Disable caching on the admin dashboard

interface EditServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  return <ServiceForm initialService={service} />;
}
