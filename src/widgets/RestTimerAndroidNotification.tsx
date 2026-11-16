import { Row, Text } from '@expo/ui/jetpack-compose';
import { createCustomNotification } from 'expo-widgets';

export type RestTimerAndroidNotificationProps = {
  label: string;
  untilLabel: string;
  status: 'running' | 'complete';
  title?: string;
};

const RestTimerAndroidNotificationLayout = (
  props: RestTimerAndroidNotificationProps
) => {
  'widget';

  const title = props.title && props.title.length > 0 ? props.title : 'Rest';
  const line =
    props.status === 'complete'
      ? title === 'Rest'
        ? 'Rest complete'
        : `${title} done`
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
