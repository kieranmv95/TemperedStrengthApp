import { HStack, Image, ProgressView, Text, VStack } from '@expo/ui/swift-ui';
import {
  activityBackgroundTint,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  monospacedDigit,
  multilineTextAlignment,
  padding,
  progressViewStyle,
  tint,
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

  // Brand tokens mirrored from Colors (widget runtime cannot import app modules).
  const accent = '#C9B072';
  const background = '#121212';
  const textPrimary = '#FFFFFF';
  const textSecondary = '#CCCCCC';

  const endDate = new Date(props.endTimeMs);
  const startDate = new Date(props.startedAtMs);
  const isComplete = props.status === 'complete';
  const timerInterval = { lower: startDate, upper: endDate };

  const countdownLarge = (
    <Text
      timerInterval={timerInterval}
      countsDown
      modifiers={[
        font({ weight: 'bold', size: 32, design: 'rounded' }),
        foregroundStyle(textPrimary),
        monospacedDigit(),
        multilineTextAlignment('trailing'),
      ]}
    />
  );

  const countdownCompact = (
    <Text
      timerInterval={timerInterval}
      countsDown
      modifiers={[
        font({ weight: 'bold', size: 14, design: 'rounded' }),
        foregroundStyle(textPrimary),
        monospacedDigit(),
        frame({ width: 56, alignment: 'trailing' }),
        multilineTextAlignment('trailing'),
      ]}
    />
  );

  const completeLabel = (
    <Text
      modifiers={[
        font({ weight: 'bold', size: 20, design: 'rounded' }),
        foregroundStyle(accent),
        multilineTextAlignment('trailing'),
      ]}
    >
      Rest complete
    </Text>
  );

  const progressBar = (
    <ProgressView
      timerInterval={timerInterval}
      countsDown
      modifiers={[
        progressViewStyle('linear'),
        tint(accent),
        frame({ maxWidth: Infinity }),
      ]}
    />
  );

  return {
    banner: (
      <VStack
        spacing={10}
        modifiers={[
          padding({ all: 14 }),
          activityBackgroundTint(background),
        ]}
      >
        <HStack spacing={12} alignment="center">
          <VStack spacing={4} modifiers={[frame({ maxWidth: Infinity, alignment: 'leading' })]}>
            <HStack spacing={6} alignment="center">
              <Image
                systemName={isComplete ? 'checkmark.circle.fill' : 'timer'}
                color={accent}
                size={16}
              />
              <Text
                modifiers={[
                  font({ weight: 'semibold', size: 13 }),
                  foregroundStyle(accent),
                ]}
              >
                Rest
              </Text>
            </HStack>
            <Text
              modifiers={[
                font({ weight: 'medium', size: 15 }),
                foregroundStyle(textSecondary),
                lineLimit(1),
              ]}
            >
              {isComplete ? 'Ready for the next set' : props.label}
            </Text>
          </VStack>
          {isComplete ? completeLabel : countdownLarge}
        </HStack>
        {isComplete ? null : progressBar}
      </VStack>
    ),
    compactLeading: (
      <Image
        systemName={isComplete ? 'checkmark.circle.fill' : 'timer'}
        color={accent}
        size={16}
      />
    ),
    compactTrailing: isComplete ? (
      <Text
        modifiers={[
          font({ weight: 'bold', size: 14 }),
          foregroundStyle(accent),
          frame({ width: 56, alignment: 'trailing' }),
        ]}
      >
        Done
      </Text>
    ) : (
      countdownCompact
    ),
    minimal: (
      <Image
        systemName={isComplete ? 'checkmark.circle.fill' : 'timer'}
        color={accent}
        size={14}
      />
    ),
    expandedLeading: (
      <VStack spacing={4} modifiers={[padding({ all: 8 })]}>
        <Image
          systemName={isComplete ? 'checkmark.circle.fill' : 'timer'}
          color={accent}
          size={22}
        />
        <Text
          modifiers={[
            font({ weight: 'semibold', size: 12 }),
            foregroundStyle(accent),
          ]}
        >
          Rest
        </Text>
      </VStack>
    ),
    expandedTrailing: (
      <HStack modifiers={[padding({ all: 8 })]}>
        {isComplete ? (
          <Text
            modifiers={[
              font({ weight: 'bold', size: 22, design: 'rounded' }),
              foregroundStyle(accent),
              monospacedDigit(),
            ]}
          >
            Done
          </Text>
        ) : (
          <Text
            timerInterval={timerInterval}
            countsDown
            modifiers={[
              font({ weight: 'bold', size: 28, design: 'rounded' }),
              foregroundStyle(textPrimary),
              monospacedDigit(),
              multilineTextAlignment('trailing'),
            ]}
          />
        )}
      </HStack>
    ),
    expandedBottom: (
      <VStack spacing={8} modifiers={[padding({ horizontal: 8, bottom: 8 })]}>
        <Text
          modifiers={[
            font({ weight: 'medium', size: 14 }),
            foregroundStyle(textSecondary),
            lineLimit(1),
          ]}
        >
          {isComplete ? 'Ready for the next set' : props.label}
        </Text>
        {isComplete ? null : progressBar}
      </VStack>
    ),
  };
};

export default createLiveActivity(
  'RestTimerLiveActivity',
  RestTimerLiveActivityLayout
);
