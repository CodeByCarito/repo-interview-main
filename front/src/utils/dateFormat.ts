export function toDisplayDate(apiDate: string): string {
  if (!apiDate || apiDate.length !== 10) return '';
  const [y, m, d] = apiDate.split('-');
  if (!y || !m || !d) return '';
  return `${d}/${m}/${y}`;
}

export function toApiDate(displayDigitsOrDdMmYyyy: string): string {
  const digits = displayDigitsOrDdMmYyyy.replace(/\D/g, '');
  if (digits.length !== 8) return '';
  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);
  return `${yyyy}-${mm}-${dd}`;
}
