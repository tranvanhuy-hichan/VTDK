/**
 * Image Loader Utility
 * Automatically scans subdirectories in public/images for images using Vite's import.meta.glob.
 * Users can simply drop any images (.png, .jpg, .jpeg, .webp, .svg) into category or gallery folders,
 * and they will automatically load on the website without changing any code or filenames!
 */

// Glob all category images
const categoryModules = import.meta.glob('/public/images/categories/**/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default'
});

// Glob all gallery images
const galleryModules = import.meta.glob('/public/images/gallery/**/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default'
});

// Helper to sanitize path from '/public/images/...' to '/images/...'
const sanitizeUrl = (path: string): string => {
  if (typeof path === 'string') {
    return path.replace(/^\/public/, '');
  }
  return String(path);
};

/**
 * Get all images belonging to a specific product category folder (e.g., 'ong-dong', 'gas-lanh')
 */
export const getCategoryImages = (categoryId: string): string[] => {
  const images: string[] = [];
  const searchPattern = `/public/images/categories/${categoryId}/`;

  Object.entries(categoryModules).forEach(([filePath, moduleValue]) => {
    if (filePath.includes(searchPattern)) {
      const url = sanitizeUrl(moduleValue as string || filePath);
      images.push(url);
    }
  });

  // Sort alphabetically so user can order them using file names like 1.jpg, 2.jpg if desired
  return images.sort();
};

/**
 * Get all images in the gallery folder (public/images/gallery/)
 */
export interface DynamicGalleryItem {
  id: string;
  url: string;
  title: string;
  filename: string;
}

export const getGalleryImages = (): DynamicGalleryItem[] => {
  const galleryItems: DynamicGalleryItem[] = [];

  Object.entries(galleryModules).forEach(([filePath, moduleValue]) => {
    const url = sanitizeUrl(moduleValue as string || filePath);
    const filename = filePath.split('/').pop() || 'hinh-anh';
    
    // Generate clean title from filename (e.g. "1_cua_hang_mat_tien.jpg" -> "Cua hang mat tien")
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '').replace(/^[0-[#\-_]+/, '');
    const cleanTitle = nameWithoutExt
      ? nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Hình ảnh Đông Kha';

    galleryItems.push({
      id: filePath,
      url,
      title: cleanTitle,
      filename
    });
  });

  return galleryItems.sort((a, b) => a.filename.localeCompare(b.filename));
};
