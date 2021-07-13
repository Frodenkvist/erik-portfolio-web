import * as React from 'react';

import * as styles from './Navbar.scss';

import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { FolderSubmenu } from 'components/FolderSubmenu/FolderSubmenu';

interface Props extends RouteComponentProps {}

interface State {
  folders: Folder[];
  isGalleriOpen: boolean;
}

class NavbarComp extends React.Component<Props, State> {
  private linkRef: React.RefObject<HTMLAnchorElement>;

  constructor(props: Props) {
    super(props);

    this.linkRef = React.createRef();

    this.state = {
      folders: [],
      isGalleriOpen: false
    };

    this.onClickGalleri = this.onClickGalleri.bind(this);
    this.closeGalleri = this.closeGalleri.bind(this);
  }

  componentDidMount() {
    fetch('/api/folder/structure')
      .then(response => response.json())
      .then((folders: Folder[]) => this.setState({ folders }));
  }

  public render() {
    const { isGalleriOpen, folders } = this.state;
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
              <a
                ref={this.linkRef}
                className={
                  hash.startsWith('#/galleri') ? styles.activeLink : styles.link
                }
                onClick={this.onClickGalleri}
              >
                GALLERI
              </a>
              {isGalleriOpen && (
                <FolderSubmenu
                  folders={folders}
                  closeSubmenu={this.closeGalleri}
                  linkRef={this.linkRef}
                />
              )}
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

  private onClickGalleri() {
    this.setState({
      isGalleriOpen: !this.state.isGalleriOpen
    });
  }

  private closeGalleri() {
    this.setState({
      isGalleriOpen: false
    });
  }
}

export const Navbar = withRouter(NavbarComp);
