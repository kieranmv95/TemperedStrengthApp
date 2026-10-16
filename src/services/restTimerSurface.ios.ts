import { isRunningInExpoGo } from 'expo';
import {
  REST_TIMER_DEEP_LINK,
  type RestTimerSurfacePayload,
  type RestTimerSurfaceStatus,
} from './restTimerSurfaceTypes';

type RestTimerLiveActivityProps = {
  endTimeMs: number;
  startedAtMs: number;
  label: string;
  status: RestTimerSurfaceStatus;
};

type LiveActivityInstance = {
  update: (
    props: RestTimerLiveActivityProps,
    staleDate?: Date
  ) => Promise<void>;
  end: (
    dismissalPolicy?: 'immediate' | 'default',
    props?: RestTimerLiveActivityProps,
    contentDate?: Date
  ) => Promise<void>;
};

type LiveActivityFactory = {
  start: (
    props: RestTimerLiveActivityProps,
    url?: string,
    staleDate?: Date
  ) => LiveActivityInstance;
  getInstances: () => LiveActivityInstance[];
};

let factoryCache: LiveActivityFactory | null | undefined;
let activeInstance: LiveActivityInstance | null = null;

/**
 * Live Activities are unavailable in Expo Go. Use a development build that
 * includes expo-widgets. Avoid importing the widget module at load time so
 * Expo Go does not throw on app start.
 */
function getLiveActivityFactory(): LiveActivityFactory | null {
  if (isRunningInExpoGo()) {
    return null;
  }
  if (factoryCache !== undefined) {
    return factoryCache;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    factoryCache = require('@/src/widgets/RestTimerLiveActivity')
      .default as LiveActivityFactory;
  } catch (error) {
    console.warn(
      'Rest timer Live Activity unavailable (rebuild the native app with expo-widgets):',
      error
    );
    factoryCache = null;
  }
  return factoryCache;
}

function toProps(payload: RestTimerSurfacePayload): RestTimerLiveActivityProps {
  return {
    endTimeMs: payload.endTimeMs,
    startedAtMs: payload.startedAtMs,
    label: payload.label,
    status: payload.status,
  };
}

async function endAllInstances(
  factory: LiveActivityFactory,
  props?: RestTimerLiveActivityProps
): Promise<void> {
  const instances = factory.getInstances();
  await Promise.all(
    instances.map((instance) =>
      instance.end('immediate', props, props ? new Date() : undefined)
    )
  );
  activeInstance = null;
}

export async function startRestTimerSurface(
  payload: RestTimerSurfacePayload
): Promise<void> {
  const factory = getLiveActivityFactory();
  if (!factory) return;

  try {
    await endAllInstances(factory);
    const props = toProps(payload);
    const staleDate = new Date(payload.endTimeMs);
    activeInstance = factory.start(props, REST_TIMER_DEEP_LINK, staleDate);
  } catch (error) {
    console.warn('Failed to start rest timer Live Activity:', error);
    activeInstance = null;
  }
}

export async function updateRestTimerSurface(
  payload: RestTimerSurfacePayload
): Promise<void> {
  const factory = getLiveActivityFactory();
  if (!factory) return;

  try {
    const props = toProps(payload);
    const staleDate = new Date(payload.endTimeMs);
    const instances = factory.getInstances();
    const instance = activeInstance ?? instances[0] ?? null;

    if (!instance) {
      await startRestTimerSurface(payload);
      return;
    }

    await instance.update(props, staleDate);
    activeInstance = instance;
  } catch (error) {
    console.warn('Failed to update rest timer Live Activity:', error);
  }
}

export async function endRestTimerSurface(
  payload?: RestTimerSurfacePayload
): Promise<void> {
  const factory = getLiveActivityFactory();
  if (!factory) return;

  try {
    const props = payload ? toProps(payload) : undefined;
    await endAllInstances(factory, props);
  } catch (error) {
    console.warn('Failed to end rest timer Live Activity:', error);
    activeInstance = null;
  }
}

export async function syncRestTimerSurface(
  payload: RestTimerSurfacePayload | null
): Promise<void> {
  const factory = getLiveActivityFactory();
  if (!factory) return;

  if (!payload || payload.status !== 'running') {
    await endRestTimerSurface(
      payload ? { ...payload, status: 'complete' } : undefined
    );
    return;
  }

  if (payload.endTimeMs <= Date.now()) {
    await endRestTimerSurface({ ...payload, status: 'complete' });
    return;
  }

  try {
    const instances = factory.getInstances();
    if (instances.length > 0) {
      activeInstance = instances[0] ?? null;
      await updateRestTimerSurface(payload);
      return;
    }
    await startRestTimerSurface(payload);
  } catch (error) {
    console.warn('Failed to sync rest timer Live Activity:', error);
  }
}
