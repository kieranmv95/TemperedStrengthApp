import AsyncStorage from '@react-native-async-storage/async-storage';
import { shouldSync } from '@/src/sync/syncedKeys';
import {
  defaultHomeLayout,
  homeLayoutHasHidden,
  HOME_SECTION_ORDER,
  moveHomeSection,
  normalizeHomeLayout,
  setHomeSectionVisible,
  visibleHomeSectionIds,
} from '@/src/utils/homeLayout';
import { HOME_LAYOUT_KEY } from '@/src/utils/storage/keys';
import { getHomeLayout, setHomeLayout } from '@/src/utils/storage/homeLayout';

describe('home layout', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('syncs with the account', () => {
    expect(shouldSync(HOME_LAYOUT_KEY)).toBe(true);
    expect(shouldSync('home_layout')).toBe(true);
  });

  it('starts from the built-in order with every section shown', () => {
    expect(defaultHomeLayout()).toEqual([
      { id: 'program', visible: true },
      { id: 'daily', visible: true },
      { id: 'checkin', visible: true },
      { id: 'wodShop', visible: true },
      { id: 'streaks', visible: true },
      { id: 'personalBests', visible: true },
    ]);
    expect(normalizeHomeLayout(null)).toEqual(defaultHomeLayout());
  });

  it('keeps a saved order and appends sections the install does not know yet', () => {
    expect(
      normalizeHomeLayout([
        { id: 'streaks', visible: false },
        { id: 'not-a-section', visible: false },
        { id: 'streaks', visible: true },
        { id: 'program' },
      ]).map((section) => `${section.id}:${section.visible}`)
    ).toEqual([
      'streaks:false',
      'program:true',
      'daily:true',
      'checkin:true',
      'wodShop:true',
      'personalBests:true',
    ]);
  });

  it('reorders without changing the input', () => {
    const layout = defaultHomeLayout();
    const next = moveHomeSection(layout, 0, 2);

    expect(layout.map((section) => section.id)).toEqual([
      ...HOME_SECTION_ORDER,
    ]);
    expect(next.map((section) => section.id)).toEqual([
      'daily',
      'checkin',
      'program',
      'wodShop',
      'streaks',
      'personalBests',
    ]);
    expect(moveHomeSection(layout, 0, 0)).toEqual(layout);
    expect(moveHomeSection(layout, -1, 1)).toEqual(layout);
  });

  it('shows every section to accounts that cannot hide, and keeps the saved flags', () => {
    const layout = setHomeSectionVisible(defaultHomeLayout(), 'program', false);

    expect(layout.find((section) => section.id === 'program')?.visible).toBe(
      false
    );
    expect(homeLayoutHasHidden(layout)).toBe(true);
    expect(visibleHomeSectionIds(layout, false)).toEqual([
      ...HOME_SECTION_ORDER,
    ]);
    expect(visibleHomeSectionIds(layout, true)).toEqual([
      'daily',
      'checkin',
      'wodShop',
      'streaks',
      'personalBests',
    ]);
    expect(
      visibleHomeSectionIds(
        HOME_SECTION_ORDER.map((id) => ({ id, visible: false })),
        true
      )
    ).toEqual([]);
  });

  it('round-trips a layout and ignores a corrupt stored value', async () => {
    const layout = setHomeSectionVisible(
      moveHomeSection(defaultHomeLayout(), 0, 2),
      'streaks',
      false
    );

    await setHomeLayout(layout);
    await expect(getHomeLayout()).resolves.toEqual(layout);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await AsyncStorage.setItem(HOME_LAYOUT_KEY, '{');
    await expect(getHomeLayout()).resolves.toEqual(defaultHomeLayout());
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
