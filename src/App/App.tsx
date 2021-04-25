import * as React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Navbar } from 'components/Navbar/Navbar';
import { Footer } from 'components/Footer/Footer';
import { PrivateRoute } from 'components/PrivateRoute/PrivateRoute';

import { StartPage } from 'containers/StartPage/StartPage';
import { LoginPage } from 'containers/LoginPage/LoginPage';

import * as styles from './App.scss';

export class App extends React.Component {
  public render() {
    if (location.hash === '') {
      window.history.pushState({}, '', `${location.pathname}#/`);
    }

    return (
      <BrowserRouter basename={`${location.pathname}#`}>
        <div className={styles.container}>
          <Navbar />
          <div>
            <Switch>
              <Route path="/" component={StartPage} exact={true} />
              <Route path="/login" component={LoginPage} />
              <PrivateRoute
                path="/secret"
                component={LoginPage}
                access={false}
              />
            </Switch>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}
