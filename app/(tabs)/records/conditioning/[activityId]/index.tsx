import { ConditioningActivityScreen } from '@/src/screens/ConditioningActivityScreen';
import { asStringId } from '@/src/utils/routeParams';
import { useLocalSearchParams } from 'expo-router';

export default function ConditioningActivityRoute() {
  const { activityId: idParam } = useLocalSearchParams();
  const activityId = asStringId(idParam) ?? '';
  return <ConditioningActivityScreen activityId={activityId} />;
}
