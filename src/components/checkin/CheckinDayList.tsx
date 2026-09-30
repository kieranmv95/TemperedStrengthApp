import { CheckinBehaviourRow } from '@/src/components/checkin/CheckinBehaviourRow';
import { CheckinDoseRow } from '@/src/components/checkin/CheckinDoseRow';
import { checkinStyles as styles } from '@/src/components/checkin/checkinStyles';
import type {
  BehaviourEntry,
  CatalogueBehaviour,
  CheckinSettings,
  TrackedBehaviour,
} from '@/src/types/checkin';
import type {
  DerivedSupplementDose,
  Supplement,
  SupplementLogStatus,
} from '@/src/types/supplements';
import {
  isBehaviourEditable,
  isSupplementEditable,
} from '@/src/utils/checkin/caps';
import React from 'react';
import { Text, View } from 'react-native';

type CheckinDayListProps = {
  tracked: readonly TrackedBehaviour[];
  behavioursById: ReadonlyMap<string, CatalogueBehaviour>;
  entries: readonly BehaviourEntry[];
  doses: readonly DerivedSupplementDose[];
  supplements: readonly Supplement[];
  settings: CheckinSettings;
  isPro: boolean;
  onPressBehaviour: (behaviour: CatalogueBehaviour) => void;
  onSetDoseStatus: (
    dose: DerivedSupplementDose,
    status: SupplementLogStatus
  ) => void;
};

/**
 * Behaviours the user still tracks and can see. Deprecated catalogue entries are
 * hidden here, but their logged history stays in storage untouched.
 */
export function visibleTrackedBehaviours(
  tracked: readonly TrackedBehaviour[],
  behavioursById: ReadonlyMap<string, CatalogueBehaviour>
): CatalogueBehaviour[] {
  const visible: CatalogueBehaviour[] = [];
  for (const item of tracked) {
    const behaviour = behavioursById.get(item.behaviourId);
    if (!behaviour || behaviour.deprecated) {
      continue;
    }
    visible.push(behaviour);
  }
  return visible;
}

export function CheckinDayList({
  tracked,
  behavioursById,
  entries,
  doses,
  supplements,
  settings,
  isPro,
  onPressBehaviour,
  onSetDoseStatus,
}: CheckinDayListProps) {
  const behaviours = visibleTrackedBehaviours(tracked, behavioursById);
  const entryByBehaviourId = new Map(entries.map((e) => [e.behaviourId, e]));

  return (
    <View style={styles.section}>
      {behaviours.length > 0 ? (
        <View style={styles.listSection}>
          <Text style={styles.listSectionTitle}>Behaviours</Text>
          {behaviours.map((behaviour) => (
            <CheckinBehaviourRow
              key={behaviour.id}
              behaviour={behaviour}
              entry={entryByBehaviourId.get(behaviour.id)}
              editable={isBehaviourEditable({
                isPro,
                behaviourId: behaviour.id,
                sensitive: behaviour.sensitive,
                lapsePending: settings.lapsePending,
                editableBehaviourIds: settings.editableBehaviourIds,
              })}
              onPress={() => onPressBehaviour(behaviour)}
            />
          ))}
        </View>
      ) : null}

      {doses.length > 0 ? (
        <View style={styles.listSection}>
          <Text style={styles.listSectionTitle}>Supplements</Text>
          {doses.map((dose) => {
            const supplement = supplements.find(
              (s) => s.id === dose.supplementId
            );
            return (
              <CheckinDoseRow
                key={`${dose.supplementId}-${dose.scheduledTime}`}
                dose={dose}
                editable={isSupplementEditable({
                  isPro,
                  supplementId: dose.supplementId,
                  status: supplement?.status ?? 'active',
                  lapsePending: settings.lapsePending,
                  editableSupplementId: settings.editableSupplementId,
                })}
                onSetStatus={(status) => onSetDoseStatus(dose, status)}
              />
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
