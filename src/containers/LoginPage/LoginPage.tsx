import * as React from 'react';

import * as styles from './LoginPage.scss';

import { Base64 } from 'js-base64';
import { AppContext, withAppContext } from 'components/utils/AppContext';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface Props extends RouteComponentProps {
  appContext: AppContext;
}

interface State {
  username: string;
  password: string;
}

export class LoginPageComp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  public render() {
    const { username, password } = this.state;

    return (
      <div className={styles.container}>
        <label htmlFor="username-input">Username</label>
        <input
          className={styles.input}
          id="username-input"
          type="text"
          value={username}
          onChange={this.onChangeUsername}
          onKeyDown={this.onKeyDown}
        />
        <label htmlFor="password-input">Password</label>
        <input
          className={styles.input}
          id="password-input"
          type="password"
          value={password}
          onChange={this.onChangePassword}
          onKeyDown={this.onKeyDown}
        />
        <button className={styles.button} onClick={this.onClickLogin}>
          Login
        </button>
      </div>
    );
  }

  public onChangeUsername(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ username: event.currentTarget.value });
  }

  public onChangePassword(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ password: event.currentTarget.value });
  }

  public onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      this.onClickLogin();
    }
  }

  public onClickLogin() {
    const { appContext } = this.props;
    const { username, password } = this.state;

    appContext.addGlass();
    fetch('/api/auth/login', {
      body: JSON.stringify({
        username,
        password
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((json: { token: string }) => {
        const { appContext } = this.props;

        const date = new Date();
        date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
        document.cookie = `JWT=${
          json.token
        };expires=${date.toUTCString()};path=/`;

        appContext.setUserContext(
          {
            ...JSON.parse(Base64.decode(json.token.split('.')[1])),
            jwt: json.token
          },
          () => {
            const { history } = this.props;

            history.push('/admin');
          }
        );
      })
      .finally(() => {
        appContext.removeGlass();
      });
  }
}

export const LoginPage = withAppContext(withRouter(LoginPageComp));
