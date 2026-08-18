import React from "react";
import { ServiceForm } from "../../../../../components/admin/ServiceForm";

export const revalidate = 0; // Disable caching on the admin dashboard

export default function NewServicePage() {
  return <ServiceForm />;
}
