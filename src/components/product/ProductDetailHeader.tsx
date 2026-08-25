"use client";

import React from "react";
import { Breadcrumb, BreadcrumbItem } from "../common/Breadcrumb";

interface ProductDetailHeaderProps {
  productName: string;
  categoryName?: string;
  categorySlug?: string;
  variant?: "light" | "banner";
  className?: string;
}

export const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  productName,
  categoryName,
  categorySlug,
  variant = "light",
  className = "",
}) => {
  const items: BreadcrumbItem[] = [];

  if (categoryName) {
    items.push({
      label: categoryName,
      href: categorySlug ? `/${categorySlug}` : "/san-pham",
    });
  }

  items.push({
    label: productName,
  });

  return (
    <Breadcrumb
      items={items}
      showBackButton={true}
      variant={variant}
      className={className}
    />
  );
};
