import * as React from 'react';

import * as styles from './Navbar.scss';

import { Link } from 'react-router-dom';

export class Navbar extends React.Component {
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
                Home
              </Link>
            </li>
            <li>
              <Link
                className={
                  hash === '#/portfolio' ? styles.activeLink : styles.link
                }
                to="/portfolio"
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                className={
                  hash === '#/about-erik' ? styles.activeLink : styles.link
                }
                to="/about-eric"
              >
                About Erik
              </Link>
            </li>
            <li>
              <Link
                className={
                  hash === '#/awards' ? styles.activeLink : styles.link
                }
                to="/awards"
              >
                Awards
              </Link>
            </li>
            <li>
              <Link
                className={
                  hash === '#/contact' ? styles.activeLink : styles.link
                }
                to="/contact"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
