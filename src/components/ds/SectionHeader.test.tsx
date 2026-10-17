import { SectionHeader } from '@/src/components/ds/SectionHeader';
import { fireEvent, render, screen } from '@testing-library/react-native';

describe('SectionHeader', () => {
  it('exposes the title as a header', async () => {
    await render(<SectionHeader title="Session actions" />);

    expect(
      screen.getByRole('header', { name: 'Session actions' })
    ).toBeOnTheScreen();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('renders the trailing action as a labelled button', async () => {
    const onActionPress = jest.fn();
    await render(
      <SectionHeader
        title="Tools"
        actionLabel="See all"
        onActionPress={onActionPress}
        actionAccessibilityLabel="See all tools"
      />
    );

    fireEvent.press(screen.getByRole('button', { name: 'See all tools' }));
    expect(onActionPress).toHaveBeenCalledTimes(1);
  });
});
