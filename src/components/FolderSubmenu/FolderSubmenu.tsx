import * as React from 'react';
import * as styles from './FolderSubmenu.scss';

import { CSSTransition } from 'react-transition-group';

import { FolderSubmenuItem } from 'components/FolderSubmenuItem/FolderSubmenuItem';

interface Menu {
  folders: Folder[];
  parentId: string;
}

interface Props {
  folders: Folder[];
  closeSubmenu: () => void;
  linkRef: React.RefObject<HTMLAnchorElement>;
}

interface State {
  activeMenu: string;
  menuHeight: number;
  menuMap: Map<string, Menu>;
}

export class FolderSubmenu extends React.Component<Props, State> {
  private containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.containerRef = React.createRef<HTMLDivElement>();

    const menuMap = this.getAllMenus(props.folders, 'main');
    menuMap.delete('main');

    this.state = {
      activeMenu: 'main',
      menuHeight: -1,
      menuMap: menuMap
    };

    this.setActiveMenu = this.setActiveMenu.bind(this);
    this.calcHeight = this.calcHeight.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutside, true);
  }

  public render() {
    const { folders, closeSubmenu } = this.props;
    const { activeMenu, menuMap, menuHeight } = this.state;

    return (
      <div
        className={styles.container}
        style={{ height: menuHeight }}
        ref={this.containerRef}
      >
        <CSSTransition
          in={activeMenu === 'main'}
          timeout={500}
          unmountOnExit={true}
          onEnter={this.calcHeight}
          classNames={{
            enter: styles.menuPrimaryEnter,
            enterActive: styles.menuPrimaryEnterActive,
            exit: styles.menuPrimaryExit,
            exitActive: styles.menuPrimaryExitActive
          }}
        >
          <div className={styles.menu}>
            {folders.map(folder => {
              return (
                <React.Fragment key={folder.id}>
                  <FolderSubmenuItem
                    closeSubmenu={closeSubmenu}
                    setActiveMenu={this.setActiveMenu}
                    folder={folder}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </CSSTransition>
        {[...menuMap.keys()].map(key => {
          return (
            <CSSTransition
              key={key}
              in={activeMenu == key}
              timeout={500}
              unmountOnExit={true}
              onEnter={this.calcHeight}
              classNames={{
                enter: styles.menuSecondaryEnter,
                enterActive: styles.menuSecondaryEnterActive,
                exit: styles.menuSecondaryExit,
                exitActive: styles.menuSecondaryExitActive
              }}
            >
              <div className={styles.menu}>
                <a
                  className={styles.menuLink}
                  onClick={this.onClickBack(menuMap.get(key)?.parentId || '')}
                >
                  Back
                </a>
                {menuMap.get(key)?.folders?.map(folder => {
                  return (
                    <React.Fragment key={folder.id}>
                      <FolderSubmenuItem
                        closeSubmenu={closeSubmenu}
                        setActiveMenu={this.setActiveMenu}
                        folder={folder}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            </CSSTransition>
          );
        })}
      </div>
    );
  }

  public setActiveMenu(menu: string) {
    this.setState({
      activeMenu: menu
    });
  }

  private onClickBack(menuId: string) {
    return () => {
      this.setState({
        activeMenu: menuId
      });
    };
  }

  private onClickOutside(event: Event) {
    const { closeSubmenu, linkRef } = this.props;

    if (
      this.containerRef.current &&
      !this.containerRef.current.contains(event.target as Node) &&
      !linkRef.current?.contains(event.target as Node)
    ) {
      closeSubmenu();
    }
  }

  private getAllMenus(
    folders: Folder[],
    key: string,
    map: Map<string, Menu> = new Map<string, Menu>(),
    parentId: string = ''
  ): Map<string, Menu> {
    map.set(key, { folders, parentId });

    folders.forEach(folder => {
      if (folder.children.length > 0) {
        map = this.getAllMenus(folder.children, folder.id.toString(), map, key);
      }
    });

    return map;
  }

  private calcHeight(element: HTMLElement) {
    this.setState({
      menuHeight: element.offsetHeight
    });
  }
}
