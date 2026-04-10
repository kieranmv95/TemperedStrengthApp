export function asStringId(idParam: unknown): string | null {
  if (typeof idParam === 'string') return idParam;
  if (Array.isArray(idParam) && typeof idParam[0] === 'string')
    return idParam[0];
  return null;
}
