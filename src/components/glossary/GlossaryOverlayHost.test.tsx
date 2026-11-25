import { GlossaryOverlayHost } from '@/src/components/glossary/GlossaryOverlayHost';
import { GlossaryText } from '@/src/components/glossary/GlossaryText';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

jest.mock('posthog-react-native', () => ({
  usePostHog: () => ({ capture: jest.fn() }),
}));

function Host({
  dismissRef,
}: {
  dismissRef?: React.RefObject<(() => boolean) | null>;
}) {
  return (
    <GlossaryOverlayHost dismissRef={dismissRef}>
      <GlossaryText text="Volume drops as intensity climbs." />
    </GlossaryOverlayHost>
  );
}

describe('GlossaryOverlayHost', () => {
  it('shows the definition inside the current popup', async () => {
    await render(<Host />);

    await fireEvent.press(
      screen.getByRole('button', { name: 'Intensity. Show definition' })
    );

    expect(
      screen.getByText(/How heavy the weight is relative to your max/)
    ).toBeOnTheScreen();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Close Intensity' })
    );

    expect(
      screen.queryByText(/How heavy the weight is relative to your max/)
    ).not.toBeOnTheScreen();
  });

  it('closes from the scrim and from Android back before the parent popup', async () => {
    const dismissRef = React.createRef<(() => boolean) | null>();
    await render(<Host dismissRef={dismissRef} />);

    await fireEvent.press(
      screen.getByRole('button', { name: 'Volume. Show definition' })
    );
    await fireEvent.press(screen.getByTestId('glossary-overlay-scrim'));
    expect(
      screen.queryByText(/Total amount of work done/)
    ).not.toBeOnTheScreen();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Volume. Show definition' })
    );
    let dismissed = false;
    await act(() => {
      dismissed = dismissRef.current?.() ?? false;
    });
    expect(dismissed).toBe(true);
    expect(
      screen.queryByText(/Total amount of work done/)
    ).not.toBeOnTheScreen();
    expect(dismissRef.current?.()).toBe(false);
  });
});
