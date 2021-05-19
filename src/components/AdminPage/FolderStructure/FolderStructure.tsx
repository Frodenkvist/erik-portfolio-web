import * as React from 'react';

import { Folder } from 'containers/AdminPage/AdminPage';

import * as styles from './FolderStructure.scss';

import expandedButton from './expanded-button.svg';
import unexpandedButton from './unexpanded-button.svg';

interface Props {
  folders: Folder[];
}

interface State {
  expandedFolders: number[];
  selectedFolder: Folder | null;
}

export class FolderStructure extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      expandedFolders: [],
      selectedFolder: null
    };

    this.onClickFolder = this.onClickFolder.bind(this);
    this.renderFolder = this.renderFolder.bind(this);
  }

  public render() {
    const { folders } = this.props;

    return (
      <div>
        <table className={styles.folderTable}>
          <tbody>
            {folders.map(folder => {
              return this.renderFolder(folder);
            })}
          </tbody>
        </table>
      </div>
    );
  }

  private renderFolder(folder: Folder, depth: number = 0) {
    const { expandedFolders, selectedFolder } = this.state;

    const isExpanded = expandedFolders.includes(folder.id);
    const hasChildren = folder.children.length > 0;

    return (
      <React.Fragment key={folder.id}>
        <tr
          className={
            selectedFolder?.id !== folder.id
              ? styles.folderRow
              : styles.selectedFolderRow
          }
          onClick={this.onClickFolder(folder)}
        >
          <td
            className={styles.folderCell}
            style={{
              marginLeft: `${1 * depth + (!hasChildren && depth > 0 ? 1 : 0)}em`
            }}
          >
            {hasChildren ? (
              <img
                className={styles.folderButtonImg}
                height={12}
                width={12}
                src={
                  expandedFolders.includes(folder.id)
                    ? expandedButton
                    : unexpandedButton
                }
              />
            ) : null}
            {folder.name}
          </td>
        </tr>
        {isExpanded
          ? folder.children.map(cf => this.renderFolder(cf, depth + 1))
          : null}
      </React.Fragment>
    );
  }

  private onClickFolder(folder: Folder) {
    return () => {
      const { expandedFolders } = this.state;

      if (folder.children.length > 0) {
        const index = expandedFolders.indexOf(folder.id);
        if (index !== -1) {
          expandedFolders.splice(index, 1);
        } else {
          expandedFolders.push(folder.id);
        }

        this.setState({
          expandedFolders
        });

        return;
      }

      this.setState({
        selectedFolder: folder
      });
    };
  }
}
