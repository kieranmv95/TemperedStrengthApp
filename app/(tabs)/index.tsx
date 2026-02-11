import { ProgramLauncher } from "@/src/screens/ProgramLauncher";
import { WorkoutScreen } from "@/src/screens/WorkoutScreen";
import { getActiveProgramId } from "@/src/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

export default function HomeScreen() {
  const [hasProgram, setHasProgram] = useState<boolean | null>(null);

  const initializeApp = async () => {
    try {
      // Check program status
      const programId = await getActiveProgramId();
      setHasProgram(!!programId);
    } catch (error) {
      console.error("Error initializing app:", error);
      setHasProgram(false);
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
          setHasProgram(!!programId);
        } catch (error) {
          console.error("Error checking program status:", error);
          setHasProgram(false);
        }
      };
      checkProgram();
    }, [])
  );

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
