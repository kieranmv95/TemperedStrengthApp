import { useEffect, useState } from 'react';
import { WorkoutScreen } from '@/src/screens/WorkoutScreen';
import { ProgramLauncher } from '@/src/screens/ProgramLauncher';
import { getActiveProgramId } from '@/src/utils/storage';

export default function HomeScreen() {
  const [hasProgram, setHasProgram] = useState<boolean | null>(null);

  useEffect(() => {
    checkProgramStatus();
  }, []);

  const checkProgramStatus = async () => {
    try {
      const programId = await getActiveProgramId();
      setHasProgram(!!programId);
    } catch (error) {
      console.error('Error checking program status:', error);
      setHasProgram(false);
    }
  };

  const handleProgramSelected = () => {
    setHasProgram(true);
  };

  const handleProgramReset = () => {
    setHasProgram(false);
  };

  if (hasProgram === null) {
    // Loading state - could show a loading indicator
    return null;
  }

  if (!hasProgram) {
    return <ProgramLauncher onProgramSelected={handleProgramSelected} />;
  }

  return <WorkoutScreen onProgramReset={handleProgramReset} />;
}
