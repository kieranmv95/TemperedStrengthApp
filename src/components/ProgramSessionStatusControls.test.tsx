import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { ProgramSessionStatusControls } from '@/src/components/ProgramSessionStatusControls';
import type { ProgramSessionStatus } from '@/src/types/storage';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

async function renderControls(status: ProgramSessionStatus | null) {
  const handlers = {
    onToggle: jest.fn(),
    onMove: jest.fn(),
    onComplete: jest.fn(),
    onSkip: jest.fn(),
  };
  await render(
    <ProgramSessionStatusControls status={status} expanded {...handlers} />
  );
  await act(async () => {});
  return handlers;
}

describe('ProgramSessionStatusControls', () => {
  beforeEach(() => {
    mockReduceMotion(false);
  });

  it('includes the session status in the header and badge', async () => {
    await renderControls('completed');

    expect(
      screen.getByRole('button', { name: 'Session actions, Completed' })
    ).toBeExpanded();
    expect(
      screen.getByRole('button', { name: 'Mark session complete' })
    ).toBeSelected();
    expect(
      screen.getByRole('button', { name: 'Skip session' })
    ).not.toBeSelected();
  });

  it('keeps the existing callbacks', async () => {
    const handlers = await renderControls(null);

    await fireEvent.press(
      screen.getByRole('button', { name: 'Mark session complete' })
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Skip session' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Move session' }));
    await fireEvent.press(
      screen.getByRole('button', { name: 'Session actions' })
    );

    expect(handlers.onComplete).toHaveBeenCalledTimes(1);
    expect(handlers.onSkip).toHaveBeenCalledTimes(1);
    expect(handlers.onMove).toHaveBeenCalledTimes(1);
    expect(handlers.onToggle).toHaveBeenCalledTimes(1);
  });
});
