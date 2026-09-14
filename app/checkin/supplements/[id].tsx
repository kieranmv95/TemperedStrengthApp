import { CheckinSupplementEditScreen } from '@/src/screens/checkin/CheckinSupplementEditScreen';
import { asStringId } from '@/src/utils/routeParams';
import { useLocalSearchParams } from 'expo-router';

export default function CheckinSupplementEditRoute() {
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const supplementId = asStringId(idParam) ?? undefined;

  return <CheckinSupplementEditScreen supplementId={supplementId} />;
}
