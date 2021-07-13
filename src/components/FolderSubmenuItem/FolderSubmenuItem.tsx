import * as React from 'react';

import * as styles from './FolderSubmenuItem.scss';

import { Link } from 'react-router-dom';

interface Props {
  folder: Folder;
  setActiveMenu: (menu: string) => void;
  closeSubmenu: () => void;
}

export class FolderSubmenuItem extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onClickAnchor = this.onClickAnchor.bind(this);
    this.onClickLink = this.onClickLink.bind(this);
  }

  public render() {
    const { folder } = this.props;
    const hasChildren = folder.children.length > 0;

    return (
      <>
        {!hasChildren && (
          <Link
            className={styles.menuLink}
            to={`/galleri/${folder.id}`}
            onClick={this.onClickLink}
          >
            {folder.name}
          </Link>
        )}
        {hasChildren && (
          <a className={styles.menuLink} onClick={this.onClickAnchor}>
            {folder.name}
          </a>
        )}
      </>
    );
  }

  private onClickAnchor() {
    const { setActiveMenu, folder } = this.props;

    setActiveMenu(folder.id.toString());
  }

  private onClickLink() {
    const { closeSubmenu } = this.props;

    closeSubmenu();
  }
}
