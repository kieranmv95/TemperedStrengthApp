import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { programs, Program } from '../utils/program';
import { setActiveProgramId, setProgramStartDate } from '../utils/storage';

interface ProgramLauncherProps {
  onProgramSelected: () => void;
}

export const ProgramLauncher: React.FC<ProgramLauncherProps> = ({
  onProgramSelected,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const handleSelectProgram = (program: Program) => {
    setSelectedProgram(program);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setStartDate(date);
      if (Platform.OS === 'android') {
        handleConfirmDate(date);
      }
    }
  };

  const handleConfirmDate = async (date: Date) => {
    if (!selectedProgram) return;

    try {
      await setActiveProgramId(selectedProgram.id);
      await setProgramStartDate(date.toISOString());
      setShowDatePicker(false);
      onProgramSelected();
    } catch (error) {
      console.error('Error saving program selection:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Select a Program</Text>
          <Text style={styles.subtitle}>Choose your training program to get started</Text>
        </View>

        {programs.map((program) => (
          <TouchableOpacity
            key={program.id}
            style={styles.programCard}
            onPress={() => handleSelectProgram(program)}
          >
            <View style={styles.programContent}>
              <Text style={styles.programName}>{program.name}</Text>
              <Text style={styles.programDescription}>{program.description}</Text>
              <Text style={styles.programStats}>
                {program.workouts.length} workouts
              </Text>
            </View>
            <Text style={styles.selectArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {showDatePicker && (
        <>
          {Platform.OS === 'ios' && (
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Select Start Date</Text>
                <TouchableOpacity
                  onPress={() => handleConfirmDate(startDate)}
                  style={styles.confirmButton}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={startDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
                style={styles.datePicker}
              />
            </View>
          )}
          {Platform.OS === 'android' && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingTop: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  programCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  programContent: {
    flex: 1,
  },
  programName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  programDescription: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  programStats: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectArrow: {
    color: '#00E676',
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 16,
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingBottom: 40,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  datePickerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    padding: 8,
  },
  confirmButtonText: {
    color: '#00E676',
    fontSize: 16,
    fontWeight: '700',
  },
  datePicker: {
    backgroundColor: '#1E1E1E',
  },
});

