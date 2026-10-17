import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { ComponentPreviewScreen } from '@/src/screens/dev/ComponentPreviewScreen';
import { TokenPreviewScreen } from '@/src/screens/dev/TokenPreviewScreen';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('expo-router', () => ({ router: { back: jest.fn() } }));

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

async function renderScreen(element: React.ReactElement) {
  await render(
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      {element}
    </SafeAreaProvider>
  );
  await act(async () => {});
}

describe('dev preview screens', () => {
  beforeEach(() => {
    mockReduceMotion(false);
  });

  it('renders every token section and plays motion samples', async () => {
    await renderScreen(<TokenPreviewScreen />);

    for (const title of [
      'Colour',
      'Typography',
      'Spacing',
      'Radius',
      'Elevation',
      'Motion',
    ]) {
      expect(screen.getByRole('header', { name: title })).toBeOnTheScreen();
    }
    await fireEvent.press(
      screen.getByLabelText(/Play duration\.base · 260ms · standard/)
    );
    await fireEvent.press(screen.getByLabelText('Play fade, base duration'));
  });

  it('renders the component preview and responds to interaction', async () => {
    await renderScreen(<ComponentPreviewScreen />);

    await fireEvent.press(
      screen.getByRole('button', { name: 'Hyrox, 9 workouts' })
    );
    expect(
      screen.getByRole('button', { name: 'Hyrox, 9 workouts' })
    ).toBeSelected();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Clean and jerk warm-up, 3 drills' })
    );
    expect(screen.getByText('Push press × 5')).toBeOnTheScreen();

    await fireEvent.press(
      screen.getByRole('button', { name: 'One more session complete' })
    );
    expect(
      screen.getAllByRole('progressbar', { name: 'Program progress' })[0]
    ).toHaveAccessibilityValue({ text: '7 of 16 sessions complete' });
  });
});
