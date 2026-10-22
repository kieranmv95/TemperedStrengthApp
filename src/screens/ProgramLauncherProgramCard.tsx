import { Badge, PressableCard, Tag } from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import type { Program } from '@/src/types/program';
import { sessionsPerWeekFromProgram } from '@/src/utils/programWeekPattern';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { sentenceCaseLabel } from './programLauncherConstants';
import { programLauncherStyles as styles } from './programLauncherStyles';

type ProgramLauncherProgramCardProps = {
  program: Program;
  isLocked: boolean;
  isRecommended?: boolean;
  onSelect: (program: Program) => void;
};

const LOCK_ICON_SIZE = 14;

export function ProgramLauncherProgramCard({
  program,
  isLocked,
  isRecommended = false,
  onSelect,
}: ProgramLauncherProgramCardProps) {
  const maxDayIndex = Math.max(...program.workouts.map((w) => w.dayIndex));
  const weekCount = Math.ceil((maxDayIndex + 1) / 7);
  const sessionsPerWeek = sessionsPerWeekFromProgram(program);

  const difficultyLabel = sentenceCaseLabel(program.difficulty);
  const categoryLabels = program.categories.map(sentenceCaseLabel);
  const statsParts = [
    `${weekCount} ${weekCount === 1 ? 'week' : 'weeks'}`,
    sessionsPerWeek > 0 ? `${sessionsPerWeek} sessions/week` : null,
    program.averageSessionDuration || null,
  ].filter((part): part is string => part !== null);
  const proLabel = program.isPro ? (isLocked ? 'Pro, locked' : 'Pro') : null;

  const accessibilityLabel = [
    program.name,
    isRecommended ? 'Recommended for you' : null,
    proLabel,
    difficultyLabel,
    ...categoryLabels,
    ...statsParts,
  ]
    .filter((part): part is string => part !== null)
    .join(', ');

  return (
    <PressableCard
      onPress={() => onSelect(program)}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Opens program details"
    >
      <View style={styles.programContent}>
        {isRecommended ? (
          <Badge label="Recommended for you" tone="success" />
        ) : null}
        <Text style={styles.programName}>{program.name}</Text>
        <View style={styles.programTagRow}>
          {program.isPro ? (
            <View style={styles.proBadgeRow}>
              {isLocked ? (
                <Ionicons
                  name="lock-closed"
                  size={LOCK_ICON_SIZE}
                  color={color.textSecondary}
                />
              ) : null}
              <Badge label="PRO" accessibilityLabel="Pro program" />
            </View>
          ) : null}
          <Badge label={difficultyLabel} tone="neutral" />
          {program.categories.map((category, index) => (
            <Tag key={category} label={categoryLabels[index]} />
          ))}
        </View>
        <Text style={styles.programDescription}>{program.description}</Text>
        <Text style={styles.programStats}>{statsParts.join(' · ')}</Text>
      </View>
    </PressableCard>
  );
}
