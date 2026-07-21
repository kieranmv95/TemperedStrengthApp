import {
  clearLiveCompetitionCache,
  LIVE_COMPETITION_CACHE_TTL_MS,
  loadLiveCompetition,
  parseLiveCompetitionResponse,
  peekLiveCompetitionCache,
} from '@/src/services/liveCompetitionService';

const apiResponse = {
  title: 'Arena Games Live Competition',
  description: 'Get down to the stand.',
  additionalInfo: 'Grip strength test.',
  linkText: 'View The Leaderboard',
  orderBy: 'weight',
  theme: {
    borderColor: '#FF3801',
    bgColor: '#FF3801',
    copyColor: '#000000',
    linkColor: '#000000',
    linkTextColor: '#ffffff',
  },
  entries: [{ name: 'Alex Carter', score: 142, category: 'Male' }],
};

describe('liveCompetitionService', () => {
  beforeEach(() => {
    clearLiveCompetitionCache();
    jest.restoreAllMocks();
  });

  it('parses API responses into app types', () => {
    expect(parseLiveCompetitionResponse(apiResponse)).toEqual({
      title: 'Arena Games Live Competition',
      description: 'Get down to the stand.',
      additionalInfo: 'Grip strength test.',
      linkText: 'View The Leaderboard',
      orderBy: 'weight',
      theme: {
        borderColor: '#FF3801',
        bgColor: '#FF3801',
        copyColor: '#000000',
        linkColor: '#000000',
        linkTextColor: '#ffffff',
      },
      entries: [{ name: 'Alex Carter', score: 142, category: 'Male' }],
    });
  });

  it('returns null for invalid orderBy values', () => {
    expect(
      parseLiveCompetitionResponse({ ...apiResponse, orderBy: 'distance' })
    ).toBeNull();
  });

  it('coerces numeric score strings from the API', () => {
    const parsed = parseLiveCompetitionResponse({
      ...apiResponse,
      entries: [{ name: 'Alex Carter', score: '142', category: 'Male' }],
    });

    expect(parsed?.entries[0]?.score).toBe(142);
  });

  it('returns null for malformed payloads', () => {
    expect(parseLiveCompetitionResponse(null)).toBeNull();
    expect(
      parseLiveCompetitionResponse({ title: 'Missing fields' })
    ).toBeNull();
  });

  it('defaults missing additionalInfo to an empty string', () => {
    const { additionalInfo, ...withoutAdditionalInfo } = apiResponse;

    expect(
      parseLiveCompetitionResponse(withoutAdditionalInfo)?.additionalInfo
    ).toBe('');
  });

  it('accepts an empty entries array', () => {
    expect(
      parseLiveCompetitionResponse({ ...apiResponse, entries: [] })?.entries
    ).toEqual([]);
  });

  it('returns fresh cache without refetching', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => apiResponse,
    } as Response);
    global.fetch = fetchMock;

    const first = await loadLiveCompetition('test');
    const second = await loadLiveCompetition('test');

    expect(first?.title).toBe('Arena Games Live Competition');
    expect(second).toEqual(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(peekLiveCompetitionCache('test')).toEqual(first);
  });

  it('refetches when forceRefresh is true', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => apiResponse,
    } as Response);
    global.fetch = fetchMock;

    await loadLiveCompetition('test');
    await loadLiveCompetition('test', { forceRefresh: true });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('refetches after the cache TTL expires', async () => {
    jest.useFakeTimers();

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => apiResponse,
    } as Response);
    global.fetch = fetchMock;

    await loadLiveCompetition('test');
    jest.advanceTimersByTime(LIVE_COMPETITION_CACHE_TTL_MS + 1);
    await loadLiveCompetition('test');

    expect(fetchMock).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });
});
