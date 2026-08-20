import { SITE_URL } from "./site";

export interface BuyerInfo {
  name: string;
  phone: string;
  address: string;
}

export function formatBuyerInfoBlock(buyer: BuyerInfo): string {
  return `Thông tin người mua:\n- Họ tên: ${buyer.name}\n- SĐT: ${buyer.phone}\n- Địa chỉ: ${buyer.address}`;
}

function withBuyerInfo(message: string, buyer?: BuyerInfo): string {
  return buyer ? `${formatBuyerInfoBlock(buyer)}\n\n${message}` : message;
}

type ZaloMessageMode = "inquire" | "buy";

interface BuildProductZaloMessageArgs {
  name: string;
  slug: string;
  variantLabel?: string | null;
  price: number;
  qty?: number;
  mode?: ZaloMessageMode;
  buyer?: BuyerInfo;
}

export function buildProductZaloMessage({
  name,
  slug,
  variantLabel,
  price,
  qty = 1,
  mode = "inquire",
  buyer,
}: BuildProductZaloMessageArgs): string {
  const productLine = variantLabel ? `${name} (${variantLabel})` : name;
  const productUrl = `${SITE_URL}/san-pham/${slug}`;
  const priceLine =
    price > 0
      ? `${price.toLocaleString("vi-VN")}đ/cái = ${(price * qty).toLocaleString("vi-VN")}đ`
      : "Liên hệ báo giá";

  const intro =
    mode === "buy"
      ? "Chào Đông Kha, tôi muốn đặt mua sản phẩm:"
      : price > 0
      ? "Chào Đông Kha, tôi muốn hỏi mua sản phẩm:"
      : "Chào Đông Kha, tôi muốn hỏi giá sản phẩm:";
  const closing =
    mode === "buy"
      ? "Nhờ shop xác nhận đơn và giao hàng giúp tôi."
      : price > 0
      ? "Nhờ shop tư vấn và kiểm tra tình trạng hàng giúp tôi."
      : "Nhờ shop báo giá giúp tôi.";

  const message = `${intro}\n${productLine} x${qty} — ${priceLine}\n   ${productUrl}\n\n${closing}`;
  return withBuyerInfo(message, buyer);
}

interface CartZaloMessageItem {
  name: string;
  slug: string;
  variantLabel?: string;
  price: number;
  qty: number;
}

interface BuildCartZaloMessageOptions {
  mode?: ZaloMessageMode;
  buyer?: BuyerInfo;
}

export function buildCartZaloMessage(items: CartZaloMessageItem[], options: BuildCartZaloMessageOptions = {}): string {
  const { mode = "inquire", buyer } = options;

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

  const intro =
    mode === "buy"
      ? "Chào Đông Kha, tôi muốn đặt mua các sản phẩm sau:"
      : "Chào Đông Kha, tôi muốn hỏi về các sản phẩm sau:";
  const closing = mode === "buy" ? "Nhờ shop xác nhận đơn và giao hàng giúp tôi." : "Nhờ shop tư vấn và báo giá giúp tôi.";

  const message = `${intro}\n\n${lines.join("\n\n")}\n\n${totalLine}${closing}`;
  return withBuyerInfo(message, buyer);
}
