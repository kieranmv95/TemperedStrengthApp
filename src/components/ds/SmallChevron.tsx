import { BorderRadius, Colors } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

type SmallChevronProps = {
  /** Icon colour; defaults to brand accent. */
  color?: string;
  /** Circle fill; defaults to accent wash, or a 12% wash of `color` when only `color` is set. */
  backgroundColor?: string;
};

export const SmallChevron = ({
  color = Colors.accent,
  backgroundColor,
}: SmallChevronProps) => {
  const useDefaultWash =
    backgroundColor === undefined && color === Colors.accent;

  return (
    <View
      style={[
        styles.cardChevronWrap,
        useDefaultWash ? styles.cardChevronWrapDefault : null,
      ]}
      pointerEvents="none"
    >
      {!useDefaultWash ? (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            styles.cardChevronWash,
            {
              backgroundColor: backgroundColor ?? color,
              opacity: backgroundColor === undefined ? 0.12 : 1,
            },
          ]}
        />
      ) : null}
      <Ionicons name="chevron-forward" size={22} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardChevronWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 32,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
  },
  cardChevronWrapDefault: {
    backgroundColor: Colors.accentWashFill,
  },
  cardChevronWash: {
    borderRadius: BorderRadius.xxl,
  },
});
