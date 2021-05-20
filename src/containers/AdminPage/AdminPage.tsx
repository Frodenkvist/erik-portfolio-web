import * as React from 'react';

import * as styles from './AdminPage.scss';

import { FolderStructure } from 'components/AdminPage/FolderStructure/FolderStructure';
import { AppContext, withAppContext } from 'components/utils/AppContext';
import { PhotoStructure } from 'components/AdminPage/PhotoStructure/PhotoStructure';

export interface Photo {
  id: number;
  name: string;
}

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
  photos: Photo[];
  selectedPhoto: Photo | null;
}

class AdminPageComp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      folders: [],
      selectedFolder: null,
      addFolderName: '',
      photos: [],
      selectedPhoto: null
    };

    this.onClickAdd = this.onClickAdd.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onClickAddFolder = this.onClickAddFolder.bind(this);
    this.onChangeAddFolderName = this.onChangeAddFolderName.bind(this);
    this.setSelectedFolder = this.setSelectedFolder.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    this.onClickRemoveFolder = this.onClickRemoveFolder.bind(this);
    this.onKeyDownAddFolder = this.onKeyDownAddFolder.bind(this);
    this.setSelectedPhoto = this.setSelectedPhoto.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onClickRemovePhotoButton = this.onClickRemovePhotoButton.bind(this);
    this.onClickRemovePhoto = this.onClickRemovePhoto.bind(this);
  }

  public componentDidMount() {
    this.fetchFolders();
  }

  public render() {
    const { folders, selectedFolder, photos, selectedPhoto } = this.state;

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
        <div
          className={styles.rightContainer}
          onDragEnter={this.onDragEnter}
          onDragOver={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
        >
          <button
            disabled={!selectedPhoto}
            onClick={this.onClickRemovePhotoButton}
          >
            - Remove
          </button>
          <div className={styles.photoContainer}>
            <PhotoStructure
              photos={photos}
              selectedPhoto={selectedPhoto}
              setSelectedPhoto={this.setSelectedPhoto}
            />
          </div>
        </div>
      </div>
    );
  }

  private fetchFolders() {
    fetch('/api/folder/structure')
      .then(response => response.json())
      .then((json: Folder[]) => this.setState({ folders: json }));
  }

  private fetchPhotos() {
    const { selectedFolder } = this.state;

    if (selectedFolder === null) return;

    fetch(`/api/photo/${selectedFolder.id}`)
      .then(response => response.json())
      .then((photos: Photo[]) => this.setState({ photos }));
  }

  private setSelectedFolder(folder: Folder) {
    this.setState(
      {
        selectedFolder: folder
      },
      () => this.fetchPhotos()
    );
  }

  private setSelectedPhoto(photo: Photo) {
    this.setState({
      selectedPhoto: photo
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

  private onClickRemovePhotoButton() {
    const { appContext } = this.props;
    const { selectedPhoto } = this.state;

    appContext.addNotification({
      autoCloseOnClick: false,
      content: (
        <div>
          <h3>Are you sure you want to remove photo: {selectedPhoto?.name}?</h3>
          <div className={styles.buttonContainer}>
            <button onClick={this.onClickRemovePhoto} className={styles.button}>
              Remove Photo
            </button>
            <button onClick={this.onClickCancel}>Cancel</button>
          </div>
        </div>
      )
    });
  }

  private onClickRemovePhoto() {
    const { appContext } = this.props;
    const { selectedPhoto } = this.state;

    fetch(`/api/photo/${selectedPhoto?.id}`, {
      method: 'DELETE'
    }).then(response => {
      if (response.status !== 204) {
        console.error('something went wrong!');
      }

      this.fetchPhotos();
      appContext.removeNotification();
    });
  }

  private onDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  private onDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  private onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  private onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    const { selectedFolder } = this.state;

    if (selectedFolder === null) return;

    const dataTransfer = event.dataTransfer;
    const files = event.dataTransfer.files;

    const uploads: Promise<any>[] = [];

    Array.from(files).forEach(file => {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('parentFolderId', selectedFolder.id.toString());

      uploads.push(
        fetch('/api/photo', {
          method: 'POST',
          body: formData
        }).then(response => response.json())
      );
    });

    Promise.all(uploads).then(() => {
      this.fetchPhotos();
    });
  }
}

export const AdminPage = withAppContext(AdminPageComp);
