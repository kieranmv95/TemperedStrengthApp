import { ProgramLauncher } from '@/src/screens/ProgramLauncher';
import { WorkoutScreen } from '@/src/screens/WorkoutScreen';
import { getActiveProgramId, getProgramStartDate } from '@/src/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

export default function HomeScreen() {
  const [hasProgram, setHasProgram] = useState<boolean | null>(null);
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);
  const [programStartDate, setProgramStartDate] = useState<string | null>(null);

  const initializeApp = async () => {
    try {
      // Check program status
      const programId = await getActiveProgramId();
      const startDate = programId ? await getProgramStartDate() : null;
      setHasProgram(!!programId);
      setActiveProgramId(programId);
      setProgramStartDate(startDate);
    } catch (error) {
      console.error('Error initializing app:', error);
      setHasProgram(false);
      setActiveProgramId(null);
      setProgramStartDate(null);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  // Re-check program status when tab is focused
  useFocusEffect(
    useCallback(() => {
      const checkProgram = async () => {
        try {
          const programId = await getActiveProgramId();
          const startDate = programId ? await getProgramStartDate() : null;
          setHasProgram(!!programId);
          setActiveProgramId(programId);
          setProgramStartDate(startDate);
        } catch (error) {
          console.error('Error checking program status:', error);
          setHasProgram(false);
          setActiveProgramId(null);
          setProgramStartDate(null);
        }
      };
      checkProgram();
    }, [])
  );

  const handleProgramSelected = () => {
    void (async () => {
      const programId = await getActiveProgramId();
      const startDate = programId ? await getProgramStartDate() : null;
      setHasProgram(!!programId);
      setActiveProgramId(programId);
      setProgramStartDate(startDate);
    })();
  };

  const handleProgramReset = () => {
    setHasProgram(false);
    setActiveProgramId(null);
    setProgramStartDate(null);
  };

  if (hasProgram === null) {
    // Loading state - could show a loading indicator
    return null;
  }

  if (!hasProgram) {
    return <ProgramLauncher onProgramSelected={handleProgramSelected} />;
  }

  // Key off program + start date so changes made in Settings remount WorkoutScreen.
  const workoutKey = `${activeProgramId ?? 'none'}-${programStartDate ?? 'no-start'}`;
  return <WorkoutScreen key={workoutKey} onProgramReset={handleProgramReset} />;
}
