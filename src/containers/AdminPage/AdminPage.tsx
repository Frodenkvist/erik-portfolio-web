import * as React from 'react';

import * as styles from './AdminPage.scss';

import { FolderStructure } from 'components/AdminPage/FolderStructure/FolderStructure';

export interface Folder {
  id: number;
  name: string;
  children: Folder[];
}

interface Props {}

interface State {
  folders: Folder[];
  selectedFolder: Folder | null;
}

export class AdminPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      folders: [],
      selectedFolder: null
    };
  }

  public componentDidMount() {
    this.fetchFolders();
  }

  public render() {
    const { folders } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <button>+ Add</button>
          <div className={styles.folderContainer}>
            <FolderStructure folders={folders} />
          </div>
        </div>
        <div></div>
      </div>
    );
  }

  private fetchFolders() {
    fetch('/api/folder/structure')
      .then(response => response.json())
      .then((json: Folder[]) => this.setState({ folders: json }));
  }
}
