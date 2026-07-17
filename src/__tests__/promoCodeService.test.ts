import {
  isValidPromoCodeFormat,
  isValidPromoEmail,
  normalizePromoCode,
  redeemPromoCode,
  validatePromoCode,
} from '../services/promoCodeService';

describe('promoCodeService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('normalizes promo codes to uppercase trimmed values', () => {
    expect(normalizePromoCode('  rainhill ')).toBe('RAINHILL');
  });

  it('validates promo code format', () => {
    expect(isValidPromoCodeFormat('AB')).toBe(true);
    expect(isValidPromoCodeFormat('RAIN-HILL_1')).toBe(true);
    expect(isValidPromoCodeFormat('A')).toBe(false);
    expect(isValidPromoCodeFormat('bad code')).toBe(false);
  });

  it('validates email format', () => {
    expect(isValidPromoEmail('user@example.com')).toBe(true);
    expect(isValidPromoEmail('not-an-email')).toBe(false);
  });

  it('returns a validate success payload', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({
        ok: true,
        requiresPassword: true,
        daysGranted: 30,
      }),
    }) as unknown as typeof fetch;

    await expect(validatePromoCode('TESTCODE')).resolves.toEqual({
      ok: true,
      requiresPassword: true,
      daysGranted: 30,
    });
  });

  it('maps validate API failures to messages', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 400,
      json: async () => ({
        ok: false,
        error: 'exhausted',
        message: 'This code has been fully redeemed.',
      }),
    }) as unknown as typeof fetch;

    await expect(validatePromoCode('USEDUP')).resolves.toEqual({
      ok: false,
      error: 'exhausted',
      message: 'This code has been fully redeemed.',
    });
  });

  it('returns network errors when fetch throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline'));

    await expect(validatePromoCode('TESTCODE')).resolves.toMatchObject({
      ok: false,
      error: 'network_error',
    });
  });

  it('redeems a valid code', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({
        ok: true,
        daysGranted: 365,
      }),
    }) as unknown as typeof fetch;

    await expect(
      redeemPromoCode({
        code: 'RAINHILL',
        email: 'user@example.com',
      })
    ).resolves.toEqual({
      ok: true,
      daysGranted: 365,
    });
  });

  it('rejects invalid email before calling redeem', async () => {
    global.fetch = jest.fn();

    await expect(
      redeemPromoCode({
        code: 'RAINHILL',
        email: 'bad',
      })
    ).resolves.toMatchObject({
      ok: false,
      error: 'invalid_email',
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
