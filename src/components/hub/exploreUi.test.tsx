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
    const firstName = firstTool.isNew
      ? `${firstTool.title}, new`
      : firstTool.title;
    await fireEvent.press(screen.getByRole('button', { name: firstName }));
    expect(onOpenTool).toHaveBeenCalledWith(firstTool.route);
  });

  it('can show the scrolling tiles without a title', async () => {
    await render(<HubToolsSection tilesOnly onOpenTool={jest.fn()} />);
    await act(async () => {});

    expect(screen.queryByText('Tools')).not.toBeOnTheScreen();
    expect(
      screen.queryByText(
        'Calculators and training utilities that work offline.'
      )
    ).not.toBeOnTheScreen();
    const firstTool = TOOLS[0];
    const firstName = firstTool.isNew
      ? `${firstTool.title}, new`
      : firstTool.title;
    expect(screen.getByRole('button', { name: firstName })).toBeOnTheScreen();
  });

  it('always shows the full tools grid on Explore', async () => {
    await render(<HubToolsSection onOpenTool={jest.fn()} />);
    await act(async () => {});

    expect(
      screen.queryByRole('button', { name: 'See all tools' })
    ).not.toBeOnTheScreen();
    expect(
      screen.queryByRole('button', { name: 'Show fewer tools' })
    ).not.toBeOnTheScreen();
    for (const tool of TOOLS) {
      const name = tool.isNew ? `${tool.title}, new` : tool.title;
      expect(screen.getByRole('button', { name })).toBeOnTheScreen();
    }
    expect(screen.getByText('New')).toBeOnTheScreen();
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
