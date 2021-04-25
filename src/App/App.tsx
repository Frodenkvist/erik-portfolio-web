import * as React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Navbar } from 'components/Navbar/Navbar';
import { Footer } from 'components/Footer/Footer';
import { PrivateRoute } from 'components/PrivateRoute/PrivateRoute';
import { Glass } from 'components/Glass/Glass';

import { StartPage } from 'containers/StartPage/StartPage';
import { LoginPage } from 'containers/LoginPage/LoginPage';

import { AppContextProvider, UserContext } from 'components/utils/AppContext';

import * as styles from './App.scss';

interface State {
  userContext: UserContext | null;
  glassCount: number;
}

export class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      userContext: null,
      glassCount: 0
    };

    this.addGlass = this.addGlass.bind(this);
    this.removeGlass = this.removeGlass.bind(this);
    this.setUserContext = this.setUserContext.bind(this);
  }

  public render() {
    const { glassCount, userContext } = this.state;

    if (location.hash === '') {
      window.history.pushState({}, '', `${location.pathname}#/`);
    }

    return (
      <BrowserRouter basename={`${location.pathname}#`}>
        <AppContextProvider
          value={{
            addGlass: this.addGlass,
            removeGlass: this.removeGlass,
            setUserContext: this.setUserContext
          }}
        >
          <div className={styles.container}>
            {glassCount > 0 ? <Glass /> : null}
            <Navbar />
            <div>
              <Switch>
                <Route path="/" component={StartPage} exact={true} />
                <Route path="/login" component={LoginPage} />
                <PrivateRoute
                  path="/secret"
                  component={LoginPage}
                  access={!!userContext}
                />
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

  private setUserContext(userContext: UserContext) {
    this.setState({
      userContext
    });
  }
}
