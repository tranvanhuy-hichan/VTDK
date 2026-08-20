import { SITE_URL } from "./site";

interface BuildProductZaloMessageArgs {
  name: string;
  slug: string;
  variantLabel?: string | null;
  hasPrice: boolean;
}

export function buildProductZaloMessage({ name, slug, variantLabel, hasPrice }: BuildProductZaloMessageArgs): string {
  const productLine = variantLabel ? `${name} (${variantLabel})` : name;
  const productUrl = `${SITE_URL}/san-pham/${slug}`;

  const intro = hasPrice
    ? "Chào Đông Kha, tôi muốn hỏi mua sản phẩm:"
    : "Chào Đông Kha, tôi muốn hỏi giá sản phẩm:";
  const closing = hasPrice ? "Nhờ shop tư vấn và kiểm tra tình trạng hàng giúp tôi." : "Nhờ shop báo giá giúp tôi.";

  return `${intro}\n${productLine}\n\nXem sản phẩm: ${productUrl}\n\n${closing}`;
}

interface CartZaloMessageItem {
  name: string;
  slug: string;
  variantLabel?: string;
  price: number;
  qty: number;
}

export function buildCartZaloMessage(items: CartZaloMessageItem[]): string {
  const lines = items.map((item, index) => {
    const productLine = item.variantLabel ? `${item.name} (${item.variantLabel})` : item.name;
    const productUrl = `${SITE_URL}/san-pham/${item.slug}`;
    const priceLine =
      item.price > 0
        ? `${item.price.toLocaleString("vi-VN")}đ/cái = ${(item.price * item.qty).toLocaleString("vi-VN")}đ`
        : "Liên hệ báo giá";
    return `${index + 1}. ${productLine} x${item.qty} — ${priceLine}\n   ${productUrl}`;
  });

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const hasUnpriced = items.some((item) => item.price === 0);
  const totalLine =
    total > 0
      ? `Tạm tính: ${total.toLocaleString("vi-VN")}đ${
          hasUnpriced ? " (chưa gồm sản phẩm cần liên hệ báo giá)" : ""
        }\n\n`
      : "";

  return `Chào Đông Kha, tôi muốn hỏi về các sản phẩm sau:\n\n${lines.join(
    "\n\n"
  )}\n\n${totalLine}Nhờ shop tư vấn và báo giá giúp tôi.`;
}
