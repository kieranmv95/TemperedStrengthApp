import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { Collapsible } from '@/src/components/ds/Collapsible';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

async function renderCollapsible(expanded: boolean, onToggle = jest.fn()) {
  const result = await render(
    <Collapsible
      title="Warm-up"
      expanded={expanded}
      onToggle={onToggle}
      accessibilityLabel="Clean and jerk warm-up"
    >
      <Text>Empty bar × 10</Text>
    </Collapsible>
  );
  await act(async () => {});
  return { ...result, onToggle };
}

describe('Collapsible', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion(false);
  });

  it('exposes the header as a button with collapsed state', async () => {
    const { onToggle } = await renderCollapsible(false);

    const header = screen.getByRole('button', {
      name: 'Clean and jerk warm-up',
    });
    expect(header).not.toBeExpanded();
    await fireEvent.press(header);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('does not mount content until first expanded', async () => {
    await renderCollapsible(false);

    expect(screen.queryByText('Empty bar × 10')).not.toBeOnTheScreen();
  });

  it('shows content and expanded state when expanded', async () => {
    await renderCollapsible(true);

    expect(
      screen.getByRole('button', { name: 'Clean and jerk warm-up' })
    ).toBeExpanded();
    expect(screen.getByText('Empty bar × 10')).toBeOnTheScreen();
  });

  it('keeps content mounted but hidden from assistive tech after collapsing', async () => {
    const { rerender } = await renderCollapsible(true);

    await rerender(
      <Collapsible title="Warm-up" expanded={false} onToggle={jest.fn()}>
        <Text>Empty bar × 10</Text>
      </Collapsible>
    );

    expect(screen.queryByText('Empty bar × 10')).not.toBeOnTheScreen();
    expect(
      screen.getByText('Empty bar × 10', { includeHiddenElements: true })
    ).toBeTruthy();
  });
});
