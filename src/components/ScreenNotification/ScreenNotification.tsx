import * as React from 'react';
import * as styles from './ScreenNotification.scss';
import { AppContext, withAppContext } from 'components/utils/AppContext';
import { RouteComponentProps, withRouter } from 'react-router-dom';

export interface ScreenNotificationWrapper {
  content: string | JSX.Element;
  title?: string;
  autoCloseOnClick?: boolean;
}

interface Props extends RouteComponentProps {
  notification: ScreenNotificationWrapper;
  appContext: AppContext;
}

class ScreenNotificationComp extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.onClickNotification = this.onClickNotification.bind(this);
  }

  public componentDidUpdate(prevProps: Props) {
    const { location, appContext } = this.props;

    if (prevProps.location.pathname !== location.pathname) {
      appContext.removeNotification();
    }
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

export const ScreenNotification = withRouter(
  withAppContext(ScreenNotificationComp)
);
