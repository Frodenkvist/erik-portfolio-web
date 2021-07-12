import * as React from 'react';

import { Base64 } from 'js-base64';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Navbar } from 'components/Navbar/Navbar';
import { Footer } from 'components/Footer/Footer';
import { PrivateRoute } from 'components/PrivateRoute/PrivateRoute';
import { Glass } from 'components/Glass/Glass';

import { StartPage } from 'containers/StartPage/StartPage';
import { LoginPage } from 'containers/LoginPage/LoginPage';
import { AdminPage } from 'containers/AdminPage/AdminPage';
import { GalleryPage } from 'containers/GalleryPage/GalleryPage';

import { AppContextProvider, UserContext } from 'components/utils/AppContext';

import * as styles from './App.scss';
import {
  ScreenNotification,
  ScreenNotificationWrapper
} from 'components/ScreenNotification/ScreenNotification';

const getCookie = (name: string): string | null => {
  const nameLenPlus = name.length + 1;
  return (
    document.cookie
      .split(';')
      .map(c => c.trim())
      .filter(cookie => {
        return cookie.substring(0, nameLenPlus) == `${name}=`;
      })
      .map(cookie => {
        return decodeURIComponent(cookie.substring(nameLenPlus));
      })[0] || null
  );
};

interface State {
  userContext: UserContext | null;
  glassCount: number;
  notification: ScreenNotificationWrapper | null;
}

export class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      userContext: null,
      glassCount: 0,
      notification: null
    };

    this.addGlass = this.addGlass.bind(this);
    this.removeGlass = this.removeGlass.bind(this);
    this.setUserContext = this.setUserContext.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
  }

  public componentDidMount() {
    const JWTString = getCookie('JWT');
    if (JWTString !== null) {
      this.setState({
        userContext: {
          ...JSON.parse(Base64.decode(JWTString.split('.')[1])),
          token: JWTString
        }
      });
    }
  }

  public render() {
    const { glassCount, userContext, notification } = this.state;

    if (location.hash === '') {
      window.history.pushState({}, '', `${location.pathname}#/`);
    }

    return (
      <BrowserRouter basename={`${location.pathname}#`}>
        <AppContextProvider
          value={{
            addGlass: this.addGlass,
            removeGlass: this.removeGlass,
            setUserContext: this.setUserContext,
            addNotification: this.addNotification,
            removeNotification: this.removeNotification
          }}
        >
          <div className={styles.container}>
            {glassCount > 0 ? <Glass /> : null}
            {notification ? (
              <ScreenNotification notification={notification} />
            ) : null}
            <Navbar />
            <div>
              <Switch>
                <Route path="/" component={StartPage} exact={true} />
                <Route path="/login" component={LoginPage} />
                <PrivateRoute
                  path="/admin"
                  component={AdminPage}
                  access={!!userContext}
                />
                <Route path="/galleri/:folderId" component={GalleryPage} />
              </Switch>
            </div>
            <Footer />
          </div>
        </AppContextProvider>
      </BrowserRouter>
    );
  }

  private addGlass() {
    this.setState({
      glassCount: this.state.glassCount + 1
    });
  }

  private removeGlass() {
    this.setState({
      glassCount: Math.max(this.state.glassCount - 1, 0)
    });
  }

  private setUserContext(userContext: UserContext, callback: () => void) {
    this.setState(
      {
        userContext
      },
      callback
    );
  }

  private addNotification(notification: ScreenNotificationWrapper) {
    this.setState({
      notification
    });
  }

  private removeNotification() {
    this.setState({
      notification: null
    });
  }
}
