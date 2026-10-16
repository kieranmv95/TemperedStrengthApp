import { Row, Text } from '@expo/ui/jetpack-compose';
import { createCustomNotification } from 'expo-widgets';

export type RestTimerAndroidNotificationProps = {
  label: string;
  untilLabel: string;
  status: 'running' | 'complete';
};

const RestTimerAndroidNotificationLayout = (
  props: RestTimerAndroidNotificationProps
) => {
  'widget';

  const line =
    props.status === 'complete'
      ? 'Rest complete'
      : `${props.label} until ${props.untilLabel}`;

  return {
    collapsed: (
      <Row>
        <Text>{line}</Text>
      </Row>
    ),
  };
};

export default createCustomNotification(
  'RestTimerAndroidNotification',
  RestTimerAndroidNotificationLayout
);
