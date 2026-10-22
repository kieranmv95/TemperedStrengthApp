import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { LoadingImage } from '@/src/components/ds/LoadingImage';
import { HubToolsSection } from '@/src/components/hub/HubToolsSection';
import { SkillsAndCuesCard } from '@/src/components/hub/SkillsAndCuesCard';
import { TOOLS } from '@/src/data/tools';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

describe('HubToolsSection', () => {
  beforeEach(() => {
    mockReduceMotion(false);
  });

  it('exposes each tool as a labelled button that opens its route', async () => {
    const onOpenTool = jest.fn();
    await render(<HubToolsSection onOpenTool={onOpenTool} />);
    await act(async () => {});

    const firstTool = TOOLS[0];
    await fireEvent.press(
      screen.getByRole('button', { name: firstTool.title })
    );
    expect(onOpenTool).toHaveBeenCalledWith(firstTool.route);
  });

  it('switches between the peeking row and the full grid', async () => {
    await render(<HubToolsSection onOpenTool={jest.fn()} />);
    await act(async () => {});

    await fireEvent.press(
      screen.getByRole('button', { name: 'See all tools' })
    );
    expect(
      screen.getByRole('button', { name: 'Show fewer tools' })
    ).toBeOnTheScreen();
    expect(screen.getAllByRole('button', { name: /./ }).length).toBeGreaterThan(
      TOOLS.length
    );
  });
});

describe('SkillsAndCuesCard', () => {
  it('reads as a single button', async () => {
    mockReduceMotion(false);
    const onPress = jest.fn();
    await render(<SkillsAndCuesCard onPress={onPress} />);
    await act(async () => {});

    await fireEvent.press(
      screen.getByRole('button', { name: /^Skills and Cues/ })
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('LoadingImage', () => {
  beforeEach(() => {
    mockReduceMotion(false);
  });

  it('exposes a labelled image to assistive tech', async () => {
    await render(
      <LoadingImage
        source={require('@/assets/images/skills/thumbnails/RMU.jpg')}
        accessibilityLabel="Ring muscle-up"
      />
    );
    await act(async () => {});

    expect(
      screen.getByRole('image', { name: 'Ring muscle-up' })
    ).toBeOnTheScreen();
  });

  it('hides decorative images', async () => {
    await render(
      <LoadingImage
        source={require('@/assets/images/skills/thumbnails/RMU.jpg')}
      />
    );
    await act(async () => {});

    expect(screen.queryByRole('image')).not.toBeOnTheScreen();
  });
});
