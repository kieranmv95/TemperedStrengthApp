import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { HomeCheckinCard } from '@/src/components/home/HomeCheckinCard';
import { HomeTodayCard } from '@/src/components/home/HomeTodayCard';
import { SponsorAdCard } from '@/src/components/home/SponsorAdCard';
import { SponsorAdsCarousel } from '@/src/components/home/SponsorAdsCarousel';
import { ToastProvider } from '@/src/hooks/toast-context';
import type { HomeSponsorAd } from '@/src/services/sanitySponsorAds';
import type { HomeProgramSummary } from '@/src/utils/homeProgramSummary';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(() => Promise.resolve(true)),
}));
jest.mock('posthog-react-native', () => ({
  usePostHog: () => ({ capture: jest.fn() }),
}));

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const SUMMARY: HomeProgramSummary = {
  programId: 'olympic_advanced_8wk',
  programName: 'Advanced Olympic Performance',
  todaySessionLabel: 'Snatch Day',
  sessionsRemaining: 10,
  sessionsCompleted: 6,
  sessionsSkipped: 0,
  programCompleted: false,
  awaitingProgramStart: false,
  calendarSessionSpanProgress: 0.375,
};

const AD: HomeSponsorAd = {
  id: 'prep-pal',
  title: 'Prep Pal Meals',
  description: 'Meal prep tailored to your goals.',
  layout: 'textHeader',
  affiliateUrl: 'https://example.com',
  ctaLabel: 'Shop now',
  bgColor: '#7EC8E3',
  titleColor: '#FFFFFF',
  descriptionColor: '#FFFFFF',
  ctaColor: '#FFFFFF',
  ctaTextColor: '#000000',
  logoUrl: null,
  productUrl: null,
  categories: [],
  review: null,
  promoCode: 'TS10',
};

async function renderWithProviders(element: React.ReactElement) {
  await render(
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <ToastProvider>{element}</ToastProvider>
    </SafeAreaProvider>
  );
  await act(async () => {});
}

describe('HomeTodayCard', () => {
  beforeEach(() => {
    mockReduceMotion(false);
  });

  it('reads as one button and offers Start session on a training day', async () => {
    await renderWithProviders(
      <HomeTodayCard summary={SUMMARY} onPress={jest.fn()} />
    );

    expect(
      screen.getByRole('button', {
        name: 'Advanced Olympic Performance, Snatch Day, 6 completed · 10 sessions left',
      })
    ).toBeOnTheScreen();
    expect(screen.getByText('Start session')).toBeOnTheScreen();
  });

  it('shows Rest day in sentence case with View week', async () => {
    await renderWithProviders(
      <HomeTodayCard
        summary={{ ...SUMMARY, todaySessionLabel: 'Rest Day' }}
        onPress={jest.fn()}
      />
    );

    expect(screen.getByText('Rest day')).toBeOnTheScreen();
    expect(screen.getByText('View week')).toBeOnTheScreen();
  });

  it('asks the user to pick a program when none is active', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <HomeTodayCard summary={null} onPress={onPress} />
    );

    await fireEvent.press(
      screen.getByRole('button', { name: 'Pick a program' })
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('HomeCheckinCard', () => {
  beforeEach(() => {
    mockReduceMotion(false);
  });

  it('summarises behaviours and supplements in its label', async () => {
    await renderWithProviders(
      <HomeCheckinCard
        loggedCount={1}
        totalCount={4}
        supplementsDue={1}
        supplementsTotal={2}
        onPress={jest.fn()}
      />
    );

    expect(
      screen.getByRole('button', {
        name: 'Check-in, 1 of 4 behaviours · 1 supplement due',
      })
    ).toBeOnTheScreen();
  });

  it('collapses extra behaviours into a +k label', async () => {
    await renderWithProviders(
      <HomeCheckinCard
        loggedCount={0}
        totalCount={9}
        supplementsDue={0}
        supplementsTotal={0}
        onPress={jest.fn()}
      />
    );

    expect(
      screen.getByText('+3', { includeHiddenElements: true })
    ).toBeTruthy();
  });
});

describe('SponsorAdCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion(false);
  });

  it('labels the placement, links the CTA and copies the promo code', async () => {
    const onPressCta = jest.fn();
    await renderWithProviders(
      <SponsorAdCard ad={AD} width={320} onPressCta={onPressCta} />
    );

    expect(screen.getByText('Partner')).toBeOnTheScreen();
    await fireEvent.press(
      screen.getByRole('link', { name: 'Shop now, Prep Pal Meals' })
    );
    expect(onPressCta).toHaveBeenCalledWith(AD);

    await fireEvent.press(
      screen.getByRole('button', { name: 'Copy code TS10' })
    );
    expect(Clipboard.setStringAsync).toHaveBeenCalledWith('TS10');
    await waitFor(() =>
      expect(screen.getByText('Code TS10 copied')).toBeOnTheScreen()
    );
  });

  it('shows no code chip when the ad has no promo code', async () => {
    await renderWithProviders(
      <SponsorAdCard
        ad={{ ...AD, promoCode: null }}
        width={320}
        onPressCta={jest.fn()}
      />
    );

    expect(
      screen.queryByRole('button', { name: /Copy code/ })
    ).not.toBeOnTheScreen();
  });
});

describe('SponsorAdsCarousel', () => {
  beforeEach(() => {
    mockReduceMotion(false);
  });

  it('announces its position when there is more than one ad', async () => {
    await renderWithProviders(
      <SponsorAdsCarousel
        ads={[AD, { ...AD, id: 'second', title: 'Second partner' }]}
        onPressCta={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Ad 1 of 2')).toBeOnTheScreen();
  });

  it('shows no page dots for a single ad', async () => {
    await renderWithProviders(
      <SponsorAdsCarousel ads={[AD]} onPressCta={jest.fn()} />
    );

    expect(screen.queryByLabelText(/^Ad \d of/)).not.toBeOnTheScreen();
  });
});
