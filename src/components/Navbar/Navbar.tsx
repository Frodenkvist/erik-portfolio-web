import * as React from 'react';

import * as styles from './Navbar.scss';

import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

interface Props extends RouteComponentProps {}

class NavbarComp extends React.Component<Props> {
  public render() {
    const hash = location.hash;

    return (
      <div>
        <nav>
          <ul className={styles.linksContainers}>
            <li>
              <Link
                className={hash === '#/' ? styles.activeLink : styles.link}
                to="/"
              >
                HEM
              </Link>
            </li>
            <li>
              <Link
                className={
                  hash === '#/galleri' ? styles.activeLink : styles.link
                }
                to="/galleri"
              >
                GALLERI
              </Link>
            </li>
            <li>
              <Link
                className={
                  hash === '#/portfolio' ? styles.activeLink : styles.link
                }
                to="/portfolio"
              >
                PORTFOLIO
              </Link>
            </li>
            <li>
              <Link
                className={hash === '#/info' ? styles.activeLink : styles.link}
                to="/info"
              >
                INFO
              </Link>
            </li>
            <li>
              <Link
                className={
                  hash === '#/kontakt' ? styles.activeLink : styles.link
                }
                to="/kontakt"
              >
                KONTAKT
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export const Navbar = withRouter(NavbarComp);
