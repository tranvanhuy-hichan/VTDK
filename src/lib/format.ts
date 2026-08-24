export function formatCurrency(amount: number): string {
  if (!amount || amount <= 0) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
