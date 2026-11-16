import { Badge, FilterChip, NumberField } from '@/src/components/ds';
import {
  ToolScreenShell,
  toolFormStyles as styles,
} from '@/src/components/tools/ToolScreenShell';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { getToolById } from '@/src/data/tools';
import { useGymTimer } from '@/src/hooks/gym-timer-context';
import { useSubscriptionContext } from '@/src/hooks/subscription-context';
import type { GymTimerConfig, GymTimerType } from '@/src/types/gymTimer';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const TOOL = getToolById('timers')!;

type TimerKind =
  | 'REST'
  | 'COUNTDOWN'
  | 'COUNTUP'
  | 'AMRAP'
  | 'EMOM'
  | 'TABATA'
  | 'ROUNDS'
  | 'FOR_TIME'
  | 'INTERVALS';

const KINDS: { id: TimerKind; label: string }[] = [
  { id: 'REST', label: 'Rest' },
  { id: 'COUNTDOWN', label: 'Countdown' },
  { id: 'COUNTUP', label: 'Count up' },
  { id: 'AMRAP', label: 'AMRAP' },
  { id: 'EMOM', label: 'EMOM' },
  { id: 'TABATA', label: 'Tabata' },
  { id: 'ROUNDS', label: 'Rounds' },
  { id: 'FOR_TIME', label: 'For Time' },
  { id: 'INTERVALS', label: 'Intervals' },
];

export function GymTimersScreen() {
  const { startGymTimer, startAndBeginGymTimer, presets, savePreset, deletePreset, settings } =
    useGymTimer();
  const { isPro } = useSubscriptionContext();
  const params = useLocalSearchParams<{ quick?: string }>();
  const quickHandled = useRef(false);
  const [kind, setKind] = useState<TimerKind>('TABATA');
  const [minutes, setMinutes] = useState('10');
  const [seconds, setSeconds] = useState('0');
  const [rounds, setRounds] = useState('8');
  const [workSec, setWorkSec] = useState('20');
  const [restSec, setRestSec] = useState('10');
  const [intervalSec, setIntervalSec] = useState('60');
  const [capMinutes, setCapMinutes] = useState('');

  const durationSec = useMemo(() => {
    const m = Number.parseInt(minutes, 10);
    const s = Number.parseInt(seconds, 10);
    const mm = Number.isFinite(m) ? Math.max(0, m) : 0;
    const ss = Number.isFinite(s) ? Math.max(0, s) : 0;
    return mm * 60 + ss;
  }, [minutes, seconds]);

  // Home-screen / deep-link quick actions: ?quick=rest90 | tabata
  useEffect(() => {
    if (quickHandled.current) return;
    const quick = typeof params.quick === 'string' ? params.quick : null;
    if (!quick) return;
    quickHandled.current = true;
    if (quick === 'rest90') {
      startAndBeginGymTimer({
        v: 1,
        leadInSec: 0,
        source: { kind: 'quick_action' },
        type: 'REST',
        config: { durationSec: 90 },
      });
      return;
    }
    if (quick === 'tabata') {
      startAndBeginGymTimer({
        v: 1,
        source: { kind: 'quick_action' },
        type: 'TABATA',
        config: { rounds: 8, workSec: 20, restSec: 10 },
      });
    }
  }, [params.quick, startAndBeginGymTimer]);

  const buildConfig = (): GymTimerConfig | null => {
    const leadInSec = settings.leadInSec;
    const source = { kind: 'manual' as const };
    switch (kind) {
      case 'REST':
      case 'COUNTDOWN': {
        if (durationSec <= 0) return null;
        return {
          v: 1,
          leadInSec: kind === 'REST' ? 0 : leadInSec,
          source,
          type: kind,
          config: { durationSec },
        };
      }
      case 'COUNTUP':
        return {
          v: 1,
          leadInSec,
          source,
          type: 'COUNTUP',
          config: {},
        };
      case 'AMRAP': {
        if (durationSec <= 0) return null;
        return {
          v: 1,
          leadInSec,
          source,
          type: 'AMRAP',
          config: { durationSec },
        };
      }
      case 'EMOM': {
        const r = Number.parseInt(rounds, 10);
        const interval = Number.parseInt(intervalSec, 10);
        if (!Number.isFinite(r) || r <= 0 || !Number.isFinite(interval) || interval <= 0) {
          return null;
        }
        return {
          v: 1,
          leadInSec,
          source,
          type: 'EMOM',
          config: { rounds: r, intervalSec: interval },
        };
      }
      case 'TABATA': {
        const r = Number.parseInt(rounds, 10);
        const work = Number.parseInt(workSec, 10);
        const rest = Number.parseInt(restSec, 10);
        if (
          !Number.isFinite(r) ||
          r <= 0 ||
          !Number.isFinite(work) ||
          work <= 0 ||
          !Number.isFinite(rest) ||
          rest < 0
        ) {
          return null;
        }
        return {
          v: 1,
          leadInSec,
          source,
          type: 'TABATA',
          config: { rounds: r, workSec: work, restSec: rest },
        };
      }
      case 'ROUNDS': {
        const r = Number.parseInt(rounds, 10);
        const work = Number.parseInt(workSec, 10);
        const rest = Number.parseInt(restSec, 10);
        if (!Number.isFinite(r) || r <= 0) return null;
        return {
          v: 1,
          leadInSec,
          source,
          type: 'ROUNDS',
          config: {
            rounds: r,
            workSec: Number.isFinite(work) ? Math.max(0, work) : 0,
            restSec: Number.isFinite(rest) ? Math.max(0, rest) : 0,
          },
        };
      }
      case 'FOR_TIME': {
        const cap = Number.parseInt(capMinutes, 10);
        return {
          v: 1,
          leadInSec,
          source,
          type: 'FOR_TIME',
          config: {
            capSec:
              Number.isFinite(cap) && cap > 0 ? cap * 60 : undefined,
          },
        };
      }
      case 'INTERVALS': {
        const work = Number.parseInt(workSec, 10);
        const rest = Number.parseInt(restSec, 10);
        const r = Number.parseInt(rounds, 10);
        if (
          !Number.isFinite(work) ||
          work <= 0 ||
          !Number.isFinite(rest) ||
          rest < 0 ||
          !Number.isFinite(r) ||
          r <= 0
        ) {
          return null;
        }
        return {
          v: 1,
          leadInSec,
          source,
          type: 'INTERVALS',
          config: {
            segments: [
              { phase: 'WORK', durationSec: work },
              ...(rest > 0
                ? [{ phase: 'REST' as const, durationSec: rest }]
                : []),
            ],
            repeats: r,
          },
        };
      }
      default:
        return null;
    }
  };

  const handleStart = () => {
    const config = buildConfig();
    if (!config) {
      Alert.alert('Check your settings', 'Enter valid timer values.');
      return;
    }
    startGymTimer(config);
  };

  const handleSavePreset = () => {
    if (!isPro) {
      router.push('/paywall');
      return;
    }
    const config = buildConfig();
    if (!config) {
      Alert.alert('Check your settings', 'Enter valid timer values.');
      return;
    }
    const name = `${kind} preset`;
    void savePreset({ ...config, name });
    Alert.alert('Saved', 'Preset synced to your account backup.');
  };

  const showDuration =
    kind === 'REST' ||
    kind === 'COUNTDOWN' ||
    kind === 'AMRAP';
  const showRounds =
    kind === 'EMOM' ||
    kind === 'TABATA' ||
    kind === 'ROUNDS' ||
    kind === 'INTERVALS';
  const showWorkRest =
    kind === 'TABATA' || kind === 'ROUNDS' || kind === 'INTERVALS';

  return (
    <ToolScreenShell title={TOOL.title}>
      <Text style={styles.cardDescription}>
        Set up a gym clock, then start. Minimise anytime to keep reading your
        workout.
      </Text>

      <View style={local.chipRow}>
        {KINDS.map((item) => (
          <FilterChip
            key={item.id}
            label={item.label}
            selected={kind === item.id}
            onPress={() => setKind(item.id)}
          />
        ))}
      </View>

      {kind === 'REST' ? (
        <View style={local.quickRow}>
          {[60, 90, 120].map((sec) => (
            <Pressable
              key={sec}
              style={local.quickBtn}
              onPress={() => {
                startGymTimer({
                  v: 1,
                  leadInSec: 0,
                  source: { kind: 'manual' },
                  type: 'REST',
                  config: { durationSec: sec },
                });
              }}
              accessibilityRole="button"
              accessibilityLabel={`Rest ${sec} seconds`}
            >
              <Text style={local.quickLabel}>{sec}s</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {showDuration ? (
        <View style={local.fields}>
          <NumberField
            label="Minutes"
            value={minutes}
            onChangeText={setMinutes}
          />
          <NumberField
            label="Seconds"
            value={seconds}
            onChangeText={setSeconds}
          />
        </View>
      ) : null}

      {kind === 'EMOM' ? (
        <View style={local.fields}>
          <NumberField label="Rounds" value={rounds} onChangeText={setRounds} />
          <NumberField
            label="Interval (sec)"
            value={intervalSec}
            onChangeText={setIntervalSec}
          />
        </View>
      ) : null}

      {showRounds && kind !== 'EMOM' ? (
        <NumberField label="Rounds" value={rounds} onChangeText={setRounds} />
      ) : null}

      {showWorkRest ? (
        <View style={local.fields}>
          <NumberField
            label={kind === 'ROUNDS' ? 'Work sec (0 = open)' : 'Work (sec)'}
            value={workSec}
            onChangeText={setWorkSec}
          />
          <NumberField
            label="Rest (sec)"
            value={restSec}
            onChangeText={setRestSec}
          />
        </View>
      ) : null}

      {kind === 'FOR_TIME' ? (
        <NumberField
          label="Time cap (min, optional)"
          value={capMinutes}
          onChangeText={setCapMinutes}
        />
      ) : null}

      <View style={local.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            local.startBtn,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={handleStart}
          accessibilityRole="button"
          accessibilityLabel="Start timer"
        >
          <Ionicons name="play" size={18} color={color.onGold} />
          <Text style={styles.primaryButtonText}>Start timer</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            local.secondaryBtn,
            pressed && local.secondaryBtnPressed,
          ]}
          onPress={handleSavePreset}
          accessibilityRole="button"
          accessibilityLabel="Save as Pro preset"
        >
          <Text style={local.secondaryLabel}>Save preset</Text>
          {!isPro ? <Badge label="PRO" /> : null}
        </Pressable>
      </View>

      {presets.length > 0 ? (
        <View style={local.presetBlock}>
          <Text style={local.presetTitle}>Saved presets</Text>
          {!isPro ? (
            <Pressable onPress={() => router.push('/paywall')}>
              <Text style={local.upsell}>Upgrade to Pro to launch presets.</Text>
            </Pressable>
          ) : null}
          {presets.map((preset) => (
            <View key={preset.id} style={local.presetRow}>
              <Pressable
                style={local.presetMain}
                onPress={() => {
                  if (!isPro) {
                    router.push('/paywall');
                    return;
                  }
                  startGymTimer(preset.config);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Start ${preset.config.name ?? preset.config.type}`}
              >
                <Text style={local.presetName}>
                  {preset.config.name ?? presetLabel(preset.config.type)}
                </Text>
                <Text style={local.presetMeta}>{preset.config.type}</Text>
              </Pressable>
              {isPro ? (
                <Pressable
                  onPress={() => void deletePreset(preset.id)}
                  accessibilityLabel="Delete preset"
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={color.danger}
                  />
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
    </ToolScreenShell>
  );
}

function presetLabel(type: GymTimerType): string {
  return type.replace('_', ' ');
}

const local = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  quickRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
  quickBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: color.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    ...typography.headline,
    color: color.textPrimary,
  },
  fields: {
    gap: space.sm,
  },
  actions: {
    gap: space.sm,
    marginTop: space.xs,
  },
  startBtn: {
    flexDirection: 'row',
    gap: space.xs,
  },
  secondaryBtn: {
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
  },
  secondaryBtnPressed: {
    backgroundColor: color.surface3,
  },
  secondaryLabel: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  presetBlock: {
    gap: space.sm,
    marginTop: space.md,
  },
  presetTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  upsell: {
    ...typography.body,
    color: color.gold,
  },
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.sm,
    borderRadius: radius.md,
    backgroundColor: color.surface1,
  },
  presetMain: {
    flex: 1,
    gap: 2,
  },
  presetName: {
    ...typography.headline,
    color: color.textPrimary,
  },
  presetMeta: {
    ...typography.caption,
    color: color.textSecondary,
  },
});
