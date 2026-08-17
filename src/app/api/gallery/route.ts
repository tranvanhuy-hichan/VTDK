import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const galleryDir = path.join(process.cwd(), "public", "images", "gallery");
    
    // Ensure gallery directory exists
    await fs.mkdir(galleryDir, { recursive: true });
    
    const files = await fs.readdir(galleryDir);
    
    const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg"];
    const images = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map((file) => {
        const nameWithoutExt = file.replace(/\.[^/.]+$/, "").replace(/^\d+[-_]/, "");
        const cleanTitle = nameWithoutExt
          ? nameWithoutExt.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          : "Hình ảnh Đông Kha";

        return {
          id: `/images/gallery/${file}`,
          url: `/images/gallery/${file}`,
          title: cleanTitle,
          filename: file,
        };
      })
      .sort((a, b) => a.filename.localeCompare(b.filename));

    return NextResponse.json(images);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
