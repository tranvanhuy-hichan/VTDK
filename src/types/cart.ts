export interface CartItem {
  key: string;
  slug: string;
  name: string;
  variantLabel?: string;
  price: number;
  image: string;
  qty: number;
}

export type AddableCartItem = Omit<CartItem, "qty">;
