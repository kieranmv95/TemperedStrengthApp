import type { Program } from '@/src/types/program';
import { sessionsPerWeekFromProgram } from '@/src/utils/programWeekPattern';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { programLauncherStyles as styles } from './programLauncherStyles';

type ProgramLauncherProgramCardProps = {
  program: Program;
  isLocked: boolean;
  onSelect: (program: Program) => void;
};

export function ProgramLauncherProgramCard({
  program,
  isLocked,
  onSelect,
}: ProgramLauncherProgramCardProps) {
  const maxDayIndex = Math.max(...program.workouts.map((w) => w.dayIndex));
  const weekCount = Math.ceil((maxDayIndex + 1) / 7);
  const sessionsPerWeek = sessionsPerWeekFromProgram(program);

  return (
    <TouchableOpacity
      style={[styles.programCard, isLocked && styles.programCardLocked]}
      onPress={() => onSelect(program)}
      disabled={false}
    >
      <View style={styles.programContent}>
        <View style={styles.programNameRow}>
          <Text style={styles.programName}>{program.name}</Text>
        </View>
        <View style={styles.programCategoryRow}>
          {program.isPro && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
          <Text style={styles.programCategoryText}>{program.difficulty}</Text>
          {program.categories.map((category) => (
            <Text key={category} style={styles.programCategoryText}>
              {category}
            </Text>
          ))}
        </View>
        <Text style={styles.programDescription}>{program.description}</Text>
        <Text style={styles.programStats}>
          {program.workouts.length} workouts • {weekCount}{' '}
          {weekCount === 1 ? 'week' : 'weeks'}
          {sessionsPerWeek > 0 && ` • ${sessionsPerWeek} sessions/week`}
          {program.averageSessionDuration &&
            ` • ${program.averageSessionDuration}`}
        </Text>
      </View>
      <Text style={styles.selectArrow}>→</Text>
    </TouchableOpacity>
  );
}
