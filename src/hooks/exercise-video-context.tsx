import { ExerciseVideoSheet } from '@/src/components/exercise/ExerciseVideoSheet';
import { getExerciseById } from '@/src/data/exercises';
import { exerciseHasVideo } from '@/src/utils/youtube';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ExerciseVideoContextValue = {
  openExerciseVideo: (exerciseId: number) => void;
  close: () => void;
};

const ExerciseVideoContext = createContext<ExerciseVideoContextValue | null>(
  null
);

export function ExerciseVideoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [exerciseId, setExerciseId] = useState<number | null>(null);

  const openExerciseVideo = useCallback((id: number) => {
    const exercise = getExerciseById(id);
    if (!exerciseHasVideo(exercise)) return;
    setExerciseId(id);
  }, []);

  const close = useCallback(() => {
    setExerciseId(null);
  }, []);

  const value = useMemo(
    () => ({
      openExerciseVideo,
      close,
    }),
    [openExerciseVideo, close]
  );

  return (
    <ExerciseVideoContext.Provider value={value}>
      {children}
      <ExerciseVideoSheet exerciseId={exerciseId} onClose={close} />
    </ExerciseVideoContext.Provider>
  );
}

export function useExerciseVideo(): ExerciseVideoContextValue {
  const context = useContext(ExerciseVideoContext);
  if (!context) {
    throw new Error(
      'useExerciseVideo must be used within ExerciseVideoProvider'
    );
  }
  return context;
}
