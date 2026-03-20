export function formatVnd(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' ₫';
}

export function parseVnd(value: string): number {
  const cleaned = value.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}
