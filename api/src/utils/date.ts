export function toDateOnly(iso: string): string {
  return iso.split('T')[0];
}
