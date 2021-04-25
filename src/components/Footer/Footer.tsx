import * as React from 'react';

import * as styles from './Footer.scss';

import instagramIcon from './instagram-icon.png';
import facebookIcon from './facebook-icon.png';

export class Footer extends React.Component {
  public render() {
    return (
      <div className={styles.container}>
        <div>
          <a href="https://www.facebook.com/fotograferikkruse">
            <img src={facebookIcon} className={styles.icon} />
          </a>
          <a href="https://www.instagram.com/fotograferikkruse/">
            <img src={instagramIcon} className={styles.icon} />
          </a>
        </div>
        <div>Copyright Erik Kruse 2021. All Rights Reserved.</div>
      </div>
    );
  }
}
