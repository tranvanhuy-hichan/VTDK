// Simplified image loader for Next.js compatibility
// Vite glob imports have been removed to avoid build errors.

export const getCategoryImages = (categoryId: string): string[] => {
  return [];
};

export interface DynamicGalleryItem {
  id: string;
  url: string;
  title: string;
  filename: string;
}

export const getGalleryImages = (): DynamicGalleryItem[] => {
  return [];
};
