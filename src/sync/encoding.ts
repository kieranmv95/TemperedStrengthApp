import type { ParsedICloudValue, ICloudEnvelope } from './types';

export function parseICloudPayload(raw: string | null): ParsedICloudValue {
  if (raw === null) return { kind: 'missing' };
  const trimmed = raw.trim();
  if (trimmed === '') {
    // Treat empty string as a real value (legacy).
    return { kind: 'legacy_string', value: raw };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { kind: 'legacy_string', value: raw };
    }
    const maybe = parsed as Record<string, unknown>;
    const v = maybe.v;
    const ts = maybe.ts;
    const deleted = maybe.deleted;

    if (typeof ts !== 'number' || !Number.isFinite(ts)) {
      return { kind: 'legacy_string', value: raw };
    }

    const envelope: ICloudEnvelope = {
      v: typeof v === 'string' ? v : v === null ? null : null,
      ts,
      deleted: typeof deleted === 'boolean' ? deleted : undefined,
    };
    return { kind: 'envelope', envelope };
  } catch {
    return { kind: 'legacy_string', value: raw };
  }
}

export function encodeICloudEnvelope(envelope: ICloudEnvelope): string {
  return JSON.stringify({
    v: envelope.v,
    ts: envelope.ts,
    deleted: envelope.deleted ?? false,
  });
}

