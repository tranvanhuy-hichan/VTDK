"use server";

import { createAdminAction } from "../server/actionClient";
import * as serviceService from "../services/service.service";

export async function createServiceAction(formData: FormData) {
  return createAdminAction(async () => {
    return serviceService.createService(formData);
  }, null);
}

export async function updateServiceAction(
  idOrFormData: string | FormData,
  maybeFormData?: FormData
) {
  return createAdminAction(async () => {
    const formData = idOrFormData instanceof FormData ? idOrFormData : maybeFormData!;
    const id = idOrFormData instanceof FormData ? (formData.get("id") as string) : (idOrFormData as string);
    return serviceService.updateService(id, formData);
  }, null);
}

export async function deleteServiceAction(id: string) {
  return createAdminAction(async () => {
    return serviceService.deleteService(id);
  }, null);
}
