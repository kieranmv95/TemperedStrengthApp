import { HStack, Image, Text, VStack } from '@expo/ui/swift-ui';
import {
  font,
  foregroundStyle,
  frame,
  multilineTextAlignment,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { createLiveActivity } from 'expo-widgets';

export type RestTimerLiveActivityProps = {
  endTimeMs: number;
  startedAtMs: number;
  label: string;
  status: 'running' | 'complete';
};

const RestTimerLiveActivityLayout = (props: RestTimerLiveActivityProps) => {
  'widget';

  const endDate = new Date(props.endTimeMs);
  const startDate = new Date(props.startedAtMs);
  const isComplete = props.status === 'complete';
  const accentColor = '#FFFFFF';

  const timerText = (
    <Text
      timerInterval={{ lower: startDate, upper: endDate }}
      countsDown
      modifiers={[
        font({ weight: 'bold', size: 20 }),
        foregroundStyle(accentColor),
        frame({ width: 72, alignment: 'trailing' }),
        multilineTextAlignment('trailing'),
      ]}
    />
  );

  const statusText = (
    <Text
      modifiers={[
        font({ weight: 'bold', size: 18 }),
        foregroundStyle(accentColor),
      ]}
    >
      Rest complete
    </Text>
  );

  return {
    banner: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text
          modifiers={[
            font({ weight: 'semibold', size: 14 }),
            foregroundStyle(accentColor),
          ]}
        >
          {props.label}
        </Text>
        {isComplete ? statusText : timerText}
      </VStack>
    ),
    compactLeading: <Image systemName="timer" color={accentColor} size={16} />,
    compactTrailing: isComplete ? (
      <Text
        modifiers={[
          font({ weight: 'bold', size: 14 }),
          foregroundStyle(accentColor),
          frame({ width: 56, alignment: 'trailing' }),
        ]}
      >
        Done
      </Text>
    ) : (
      <Text
        timerInterval={{ lower: startDate, upper: endDate }}
        countsDown
        modifiers={[
          font({ weight: 'bold', size: 14 }),
          foregroundStyle(accentColor),
          frame({ width: 56, alignment: 'trailing' }),
          multilineTextAlignment('trailing'),
        ]}
      />
    ),
    minimal: <Image systemName="timer" color={accentColor} size={14} />,
    expandedLeading: (
      <VStack modifiers={[padding({ all: 8 })]}>
        <Image systemName="timer" color={accentColor} size={20} />
        <Text modifiers={[font({ size: 12 }), foregroundStyle(accentColor)]}>
          Rest
        </Text>
      </VStack>
    ),
    expandedTrailing: (
      <HStack modifiers={[padding({ all: 8 })]}>
        {isComplete ? statusText : timerText}
      </HStack>
    ),
    expandedBottom: (
      <VStack modifiers={[padding({ all: 8 })]}>
        <Text modifiers={[font({ size: 14 }), foregroundStyle(accentColor)]}>
          {props.label}
        </Text>
      </VStack>
    ),
  };
};

export default createLiveActivity(
  'RestTimerLiveActivity',
  RestTimerLiveActivityLayout
);
