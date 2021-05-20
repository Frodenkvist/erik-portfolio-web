import * as React from 'react';

import * as styles from './AdminPage.scss';

import { FolderStructure } from 'components/AdminPage/FolderStructure/FolderStructure';
import { AppContext, withAppContext } from 'components/utils/AppContext';

export interface Folder {
  id: number;
  name: string;
  children: Folder[];
}

interface Props {
  appContext: AppContext;
}

interface State {
  folders: Folder[];
  selectedFolder: Folder | null;
  addFolderName: string;
}

class AdminPageComp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      folders: [],
      selectedFolder: null,
      addFolderName: ''
    };

    this.onClickAdd = this.onClickAdd.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onClickAddFolder = this.onClickAddFolder.bind(this);
    this.onChangeAddFolderName = this.onChangeAddFolderName.bind(this);
    this.setSelectedFolder = this.setSelectedFolder.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    this.onClickRemoveFolder = this.onClickRemoveFolder.bind(this);
    this.onKeyDownAddFolder = this.onKeyDownAddFolder.bind(this);
  }

  public componentDidMount() {
    this.fetchFolders();
  }

  public render() {
    const { folders, selectedFolder } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <button className={styles.button} onClick={this.onClickAdd}>
            + Add
          </button>
          <button disabled={!selectedFolder} onClick={this.onClickRemove}>
            - Remove
          </button>
          <div className={styles.folderContainer}>
            <FolderStructure
              folders={folders}
              setSelectedFolder={this.setSelectedFolder}
              selectedFolder={selectedFolder}
            />
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

  private setSelectedFolder(folder: Folder) {
    this.setState({
      selectedFolder: folder
    });
  }

  private onClickAdd() {
    const { appContext } = this.props;

    appContext.addNotification({
      autoCloseOnClick: false,
      content: (
        <div>
          <h3>Add Folder</h3>
          <div>
            <label htmlFor="addFolderName">Folder Name: </label>
            <input
              id="addFolderName"
              onChange={this.onChangeAddFolderName}
              type="text"
              onKeyDown={this.onKeyDownAddFolder}
              autoFocus={true}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={this.onClickAddFolder} className={styles.button}>
              Add Folder
            </button>
            <button onClick={this.onClickCancel}>Cancel</button>
          </div>
        </div>
      )
    });
  }

  private onClickRemove() {
    const { appContext } = this.props;
    const { selectedFolder } = this.state;

    appContext.addNotification({
      autoCloseOnClick: false,
      content: (
        <div>
          <h3>
            Are you sure you want to remove folder: {selectedFolder?.name}?
          </h3>
          <div className={styles.buttonContainer}>
            <button
              onClick={this.onClickRemoveFolder}
              className={styles.button}
            >
              Remove Folder
            </button>
            <button onClick={this.onClickCancel}>Cancel</button>
          </div>
        </div>
      )
    });
  }

  private onChangeAddFolderName(event: React.FormEvent<HTMLInputElement>) {
    this.setState({
      addFolderName: event.currentTarget.value
    });
  }

  private onClickAddFolder() {
    const { appContext } = this.props;
    const { addFolderName, selectedFolder } = this.state;

    fetch('/api/folder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: addFolderName,
        parentFolderId: selectedFolder?.id
      })
    })
      .then(response => response.json())
      .then(() => {
        this.fetchFolders();
        appContext.removeNotification();
      });
  }

  private onClickRemoveFolder() {
    const { appContext } = this.props;
    const { selectedFolder } = this.state;

    fetch(`/api/folder/${selectedFolder?.id}`, {
      method: 'DELETE'
    }).then(response => {
      if (response.status !== 204) {
        console.error('something went wrong!');
      }

      this.fetchFolders();
      appContext.removeNotification();
    });
  }

  private onClickCancel() {
    const { appContext } = this.props;

    appContext.removeNotification();
  }

  private onKeyDownAddFolder(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      this.onClickAddFolder();
    }
  }
}

export const AdminPage = withAppContext(AdminPageComp);
