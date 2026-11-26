import { ConditioningDistanceScreen } from '@/src/screens/ConditioningDistanceScreen';
import { asStringId } from '@/src/utils/routeParams';
import { useLocalSearchParams } from 'expo-router';

export default function ConditioningDistanceRoute() {
  const { activityId: idParam, distanceM: distanceParam } =
    useLocalSearchParams();
  const activityId = asStringId(idParam) ?? '';
  const distanceRaw = asStringId(distanceParam);
  const distanceM = distanceRaw ? Number(distanceRaw) : NaN;
  return (
    <ConditioningDistanceScreen
      activityId={activityId}
      distanceM={Number.isFinite(distanceM) ? distanceM : 0}
    />
  );
}
