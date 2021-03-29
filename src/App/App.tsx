import * as React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Navbar } from 'components/Navbar/Navbar';
import { StartPage } from 'containers/StartPage/StartPage';

export class App extends React.Component {
  public render() {
    if (location.hash === '') {
      window.history.pushState({}, '', `${location.pathname}#/`);
    }

    return (
      <BrowserRouter basename={`${location.pathname}#`}>
        <Navbar />
        <div>
          <Switch>
            <Route path="/" component={StartPage} exact={true} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
