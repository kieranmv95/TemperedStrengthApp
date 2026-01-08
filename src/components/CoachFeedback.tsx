import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface CoachFeedbackProps {
  visible: boolean;
  currentWeight: number;
  onClose: () => void;
}

type FeelOption = 'easy' | 'perfect' | 'hard' | null;

export const CoachFeedback: React.FC<CoachFeedbackProps> = ({
  visible,
  currentWeight,
  onClose,
}) => {
  const [selectedFeel, setSelectedFeel] = useState<FeelOption>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleFeelSelect = (feel: FeelOption) => {
    setSelectedFeel(feel);
    setShowFeedback(true);
  };

  const handleClose = () => {
    setSelectedFeel(null);
    setShowFeedback(false);
    onClose();
  };

  const getFeedback = (): string => {
    if (!selectedFeel) return '';
    
    switch (selectedFeel) {
      case 'easy':
        return 'Strong! Add 2.5kg next set.';
      case 'hard':
        const dropWeight = (currentWeight * 0.9).toFixed(1);
        return `Form first. Drop 10% weight (${dropWeight}kg).`;
      case 'perfect':
        return 'Perfect! Maintain this weight for next set.';
      default:
        return '';
    }
  };

  const getFeedbackColor = (): string => {
    if (!selectedFeel) return '#00E676';
    switch (selectedFeel) {
      case 'easy':
        return '#00E676';
      case 'hard':
        return '#FF6B6B';
      case 'perfect':
        return '#4ECDC4';
      default:
        return '#00E676';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {!showFeedback ? (
            <>
              <Text style={styles.title}>How did that feel?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.feelButton, styles.easyButton]}
                  onPress={() => handleFeelSelect('easy')}
                >
                  <Text style={styles.feelButtonText}>Too Easy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.feelButton, styles.perfectButton]}
                  onPress={() => handleFeelSelect('perfect')}
                >
                  <Text style={styles.feelButtonText}>Perfect</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.feelButton, styles.hardButton]}
                  onPress={() => handleFeelSelect('hard')}
                >
                  <Text style={styles.feelButtonText}>Too Hard</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.coachLabel}>Coach:</Text>
              <Text style={[styles.feedbackText, { color: getFeedbackColor() }]}>
                {getFeedback()}
              </Text>
              <TouchableOpacity
                style={[styles.doneButton, { borderColor: getFeedbackColor() }]}
                onPress={handleClose}
              >
                <Text style={[styles.doneButtonText, { color: getFeedbackColor() }]}>
                  Got it
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 32,
    width: '85%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 16,
  },
  feelButton: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  easyButton: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderColor: '#00E676',
  },
  perfectButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderColor: '#4ECDC4',
  },
  hardButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderColor: '#FF6B6B',
  },
  feelButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coachLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
  },
  doneButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

