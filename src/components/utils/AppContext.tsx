import * as React from 'react';

import { ScreenNotificationWrapper } from 'components/ScreenNotification/ScreenNotification';

export interface UserContext {
  jwt: string;
  username: string;
}

export interface AppContext {
  addGlass: () => void;
  removeGlass: () => void;
  setUserContext: (userContext: UserContext, callback: () => void) => void;
  addNotification: (notificaiton: ScreenNotificationWrapper) => void;
  removeNotification: () => void;
}

const context = React.createContext<AppContext>({
  addGlass: () => {
    //default body
  },
  removeGlass: () => {
    //default body
  },
  setUserContext: (userContext: UserContext, callback: () => void) => {
    //default body
  },
  addNotification: (notification: ScreenNotificationWrapper) => {
    //default body
  },
  removeNotification: () => {
    //default body
  }
});

export const AppContextProvider = context.Provider;

export const AppContextConsumer = context.Consumer;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Inject:ar AppContext till komponenten i dens Props.
 *
 * @param Component Komponenten som ska ha AppContext.
 *
 * @return Komponenten med inject:at AppContext
 */
export const withAppContext = <
  P extends { appContext?: AppContext },
  R = Omit<P, 'appContext'>
>(
  Component: React.ComponentClass<P>
) => {
  type ComponentInstance = InstanceType<typeof Component>;

  type WrapperComponentPropsWIthForwardedRef = R & {
    forwardedRef: React.Ref<ComponentInstance>;
  };

  class WrapperComponent extends React.Component<
    WrapperComponentPropsWIthForwardedRef
  > {
    public render() {
      const { forwardedRef, ...composedComponentProps } = this.props;

      return (
        <AppContextConsumer>
          {appContext => (
            <Component
              {...(composedComponentProps as any)}
              ref={forwardedRef}
              appContext={appContext}
            />
          )}
        </AppContextConsumer>
      );
    }
  }

  return React.forwardRef<ComponentInstance, R>((props, ref) => (
    <WrapperComponent forwardedRef={ref} {...props} />
  ));
};
