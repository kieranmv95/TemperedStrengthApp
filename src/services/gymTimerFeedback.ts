import { scheduleTimerFinishedNotification } from '@/src/services/localNotifications';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import type { AudioPlayer } from 'expo-audio';

const KEEP_AWAKE_TAG = 'gym-timer';

type BeepKind = 'tick' | 'work' | 'rest' | 'finish';

let audioReady = false;
let players: Partial<Record<BeepKind, AudioPlayer>> = {};

async function ensureAudio(): Promise<void> {
  if (audioReady) return;
  try {
    const { createAudioPlayer } = await import('expo-audio');
    const sources: Record<BeepKind, number> = {
      tick: require('@/assets/sounds/beep-tick.wav'),
      work: require('@/assets/sounds/beep-work.wav'),
      rest: require('@/assets/sounds/beep-rest.wav'),
      finish: require('@/assets/sounds/beep-finish.wav'),
    };
    for (const kind of Object.keys(sources) as BeepKind[]) {
      players[kind] = createAudioPlayer(sources[kind]);
    }
    audioReady = true;
  } catch (error) {
    console.warn('Gym timer audio unavailable:', error);
    audioReady = true;
  }
}

export async function playGymTimerBeep(
  kind: BeepKind,
  muted: boolean
): Promise<void> {
  if (muted) {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
    return;
  }
  await ensureAudio();
  const player = players[kind];
  if (!player) {
    try {
      await Haptics.notificationAsync(
        kind === 'finish'
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );
    } catch {
      // ignore
    }
    return;
  }
  try {
    await player.seekTo(0);
    player.play();
  } catch (error) {
    console.warn('Gym timer beep failed:', error);
  }
}

export async function gymTimerHapticPhaseChange(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {
    // ignore
  }
}

export async function activateGymTimerKeepAwake(): Promise<void> {
  try {
    await activateKeepAwakeAsync(KEEP_AWAKE_TAG);
  } catch {
    // ignore
  }
}

export async function deactivateGymTimerKeepAwake(): Promise<void> {
  try {
    deactivateKeepAwake(KEEP_AWAKE_TAG);
  } catch {
    // ignore
  }
}

export async function scheduleGymTimerFinishNotification(
  secondsFromNow: number
): Promise<void> {
  await cancelGymTimerFinishNotification();
  if (secondsFromNow <= 0) return;
  await scheduleTimerFinishedNotification(secondsFromNow);
}

export async function cancelGymTimerFinishNotification(): Promise<void> {
  try {
    const { cancelTimerFinishedNotifications } = await import(
      '@/src/services/localNotifications'
    );
    await cancelTimerFinishedNotifications();
  } catch {
    // ignore
  }
}
