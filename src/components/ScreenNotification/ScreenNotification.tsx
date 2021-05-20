import * as React from 'react';
import * as styles from './ScreenNotification.scss';
import { AppContext, withAppContext } from 'components/utils/AppContext';

export interface ScreenNotificationWrapper {
  content: string | JSX.Element;
  title?: string;
  autoCloseOnClick?: boolean;
}

interface Props {
  notification: ScreenNotificationWrapper;
  appContext: AppContext;
}

class ScreenNotificationComp extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.onClickNotification = this.onClickNotification.bind(this);
  }

  public render() {
    const { notification } = this.props;

    return (
      <>
        <div
          className={styles.backgroundScreen}
          onClick={this.onClickNotification}
        />
        <div className={styles.notificationCenter}>
          <div
            className={styles.notificationContainerNone}
            onClick={this.onClickNotification}
          >
            <div className={styles.notificationContainer}>
              {notification.title && <h3>{notification.title}</h3>}
              <div>{notification.content}</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  private onClickNotification() {
    const { notification } = this.props;

    if (notification.autoCloseOnClick === false) {
      return;
    }

    this.props.appContext.removeNotification();
  }
}

export const ScreenNotification = withAppContext(ScreenNotificationComp);
