import { TEMPERED_STRENGTH_API_ORIGIN } from '@/src/services/temperedStrengthApi';

const PROMO_CODE_PATTERN = /^[A-Z0-9_-]{2,32}$/;

export type PromoApiErrorCode =
  | 'invalid_code'
  | 'exhausted'
  | 'requires_password'
  | 'invalid_password'
  | 'already_redeemed'
  | 'invalid_email'
  | 'network_error'
  | 'unknown';

export type PromoValidateSuccess = {
  ok: true;
  requiresPassword: boolean;
  daysGranted: number;
};

export type PromoValidateFailure = {
  ok: false;
  error: PromoApiErrorCode;
  message: string;
};

export type PromoValidateResult = PromoValidateSuccess | PromoValidateFailure;

export type PromoRedeemSuccess = {
  ok: true;
  daysGranted: number;
};

export type PromoRedeemFailure = {
  ok: false;
  error: PromoApiErrorCode;
  message: string;
};

export type PromoRedeemResult = PromoRedeemSuccess | PromoRedeemFailure;

const ERROR_FALLBACKS: Record<PromoApiErrorCode, string> = {
  invalid_code: 'Code not found or inactive.',
  exhausted: 'This code has been fully redeemed.',
  requires_password: 'This code requires a password.',
  invalid_password: 'Incorrect password.',
  already_redeemed: 'This email already redeemed this code.',
  invalid_email: 'Enter a valid email.',
  network_error:
    'Could not reach the server. Check your connection and try again.',
  unknown: 'Something went wrong. Please try again.',
};

function isPromoApiErrorCode(value: unknown): value is PromoApiErrorCode {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(ERROR_FALLBACKS, value)
  );
}

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

export function isValidPromoCodeFormat(code: string): boolean {
  return PROMO_CODE_PATTERN.test(normalizePromoCode(code));
}

export function isValidPromoEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length < 3 || trimmed.length > 254) {
    return false;
  }
  // Practical client check only — server validates for real.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function messageForError(
  error: PromoApiErrorCode,
  apiMessage: unknown
): string {
  if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
    return apiMessage.trim();
  }
  return ERROR_FALLBACKS[error];
}

function failureFromBody(body: unknown): PromoValidateFailure {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return {
      ok: false,
      error: 'unknown',
      message: ERROR_FALLBACKS.unknown,
    };
  }

  const record = body as Record<string, unknown>;
  const error = isPromoApiErrorCode(record.error) ? record.error : 'unknown';
  return {
    ok: false,
    error,
    message: messageForError(error, record.message),
  };
}

async function postPromoJson(
  path: string,
  payload: Record<string, unknown>
): Promise<{ status: number; body: unknown } | PromoValidateFailure> {
  try {
    const response = await fetch(`${TEMPERED_STRENGTH_API_ORIGIN}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return { status: response.status, body };
  } catch (error) {
    if (__DEV__) {
      console.warn('Promo API request failed:', error);
    }
    return {
      ok: false,
      error: 'network_error',
      message: ERROR_FALLBACKS.network_error,
    };
  }
}

export async function validatePromoCode(
  code: string
): Promise<PromoValidateResult> {
  const normalized = normalizePromoCode(code);
  if (!isValidPromoCodeFormat(normalized)) {
    return {
      ok: false,
      error: 'invalid_code',
      message: 'Enter a valid code (2–32 letters, numbers, - or _).',
    };
  }

  const result = await postPromoJson('/api/promo/validate', {
    code: normalized,
  });
  if ('ok' in result) {
    return result;
  }

  const { status, body } = result;
  if (
    status === 200 &&
    typeof body === 'object' &&
    body !== null &&
    !Array.isArray(body)
  ) {
    const record = body as Record<string, unknown>;
    if (record.ok === true) {
      const daysGranted =
        typeof record.daysGranted === 'number' &&
        Number.isFinite(record.daysGranted)
          ? record.daysGranted
          : NaN;
      if (!Number.isFinite(daysGranted) || daysGranted <= 0) {
        return {
          ok: false,
          error: 'unknown',
          message: ERROR_FALLBACKS.unknown,
        };
      }
      return {
        ok: true,
        requiresPassword: record.requiresPassword === true,
        daysGranted,
      };
    }
  }

  return failureFromBody(body);
}

export async function redeemPromoCode(input: {
  code: string;
  email: string;
  password?: string;
}): Promise<PromoRedeemResult> {
  const normalized = normalizePromoCode(input.code);
  if (!isValidPromoCodeFormat(normalized)) {
    return {
      ok: false,
      error: 'invalid_code',
      message: 'Enter a valid code (2–32 letters, numbers, - or _).',
    };
  }

  const email = input.email.trim();
  if (!isValidPromoEmail(email)) {
    return {
      ok: false,
      error: 'invalid_email',
      message: ERROR_FALLBACKS.invalid_email,
    };
  }

  const password =
    typeof input.password === 'string' && input.password.length > 0
      ? input.password
      : undefined;

  const payload: Record<string, unknown> = {
    code: normalized,
    email,
  };
  if (password !== undefined) {
    payload.password = password;
  }

  const result = await postPromoJson('/api/promo/redeem', payload);
  if ('ok' in result) {
    return result;
  }

  const { status, body } = result;
  if (
    status === 200 &&
    typeof body === 'object' &&
    body !== null &&
    !Array.isArray(body)
  ) {
    const record = body as Record<string, unknown>;
    if (record.ok === true) {
      const daysGranted =
        typeof record.daysGranted === 'number' &&
        Number.isFinite(record.daysGranted)
          ? record.daysGranted
          : NaN;
      if (!Number.isFinite(daysGranted) || daysGranted <= 0) {
        return {
          ok: false,
          error: 'unknown',
          message: ERROR_FALLBACKS.unknown,
        };
      }
      return {
        ok: true,
        daysGranted,
      };
    }
  }

  return failureFromBody(body);
}
