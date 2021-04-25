import * as React from 'react';

import { Route, RouteProps } from 'react-router-dom';
import { StartPage } from 'containers/StartPage/StartPage';

interface Props extends RouteProps {
  access: boolean;
}

export class PrivateRoute extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.renderComponent = this.renderComponent.bind(this);
  }

  public render() {
    const { component, ...rest } = this.props;

    return <Route {...rest} render={this.renderComponent} />;
  }

  private renderComponent(props: any) {
    const { access, component: Component, render } = this.props;

    if (access) {
      if (Component) {
        return <Component {...props} />;
      } else if (render) {
        return render(props);
      }
    } else {
      return <StartPage />;
    }
  }
}
