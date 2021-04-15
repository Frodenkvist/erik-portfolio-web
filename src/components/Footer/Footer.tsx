import * as React from 'react';

import * as styles from './Footer.scss';

export class Footer extends React.Component {
  public render() {
    return (
      <div className={styles.container}>
        <div>
          <a
            href="https://www.facebook.com/fotograferikkruse"
            className={styles.facebookIcon}
          ></a>
          <a
            href="https://www.instagram.com/fotograferikkruse/"
            className={styles.instagramIcon}
          ></a>
        </div>
        <div>Copyright Erik Kruse 2021. All Rights Reserved.</div>
      </div>
    );
  }
}
