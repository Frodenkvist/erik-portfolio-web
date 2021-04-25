import * as React from 'react';

interface State {
  username: string;
  password: string;
}

export class LoginPage extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
  }

  public render() {
    const { username, password } = this.state;

    return (
      <div>
        <input type="text" value={username} onChange={this.onChangeUsername} />
        <input type="text" value={password} onChange={this.onChangePassword} />
        <button onClick={this.onClickLogin}>Login</button>
      </div>
    );
  }

  public onChangeUsername(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ username: event.currentTarget.value });
  }

  public onChangePassword(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ password: event.currentTarget.value });
  }

  public onClickLogin() {
    const { username, password } = this.state;

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
      .then(json => console.log(json));
  }
}
