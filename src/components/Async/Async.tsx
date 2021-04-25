import * as React from 'react';

interface Props {
  load: Promise<any>;
  componentProps: any;
}

export class Async extends React.Component<Props> {
  private cancelUpdate: boolean;
  private C: any;

  constructor(props: Props) {
    super(props);

    this.cancelUpdate = false;
  }

  public componentDidMount() {
    this.cancelUpdate = false;
    this.props.load.then(c => {
      this.C = c;
      if (!this.cancelUpdate) {
        this.forceUpdate();
      }
    });
  }

  public componentWillUnmount() {
    this.cancelUpdate = true;
  }

  public render() {
    const { componentProps } = this.props;
    return this.C ? (
      this.C.default ? (
        <this.C.default {...componentProps} />
      ) : (
        <this.C {...componentProps} />
      )
    ) : null;
  }
}
