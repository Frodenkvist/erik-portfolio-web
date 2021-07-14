import * as React from 'react';

import * as styles from './AdminPage.scss';

import { FolderStructure } from 'components/AdminPage/FolderStructure/FolderStructure';
import { AppContext, withAppContext } from 'components/utils/AppContext';
import { PhotoStructure } from 'components/AdminPage/PhotoStructure/PhotoStructure';
import { flattenFolderStructure } from 'utils/utils';

interface Props {
  appContext: AppContext;
}

interface State {
  folders: Folder[];
  selectedFolder: Folder | null;
  addFolderName: string;
  photos: Photo[];
  selectedPhoto: Photo | null;
  uploading: boolean;
  amountUploading: number;
  amountUploaded: number;
  renameFolderName: string;
}

class AdminPageComp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      folders: [],
      selectedFolder: null,
      addFolderName: '',
      photos: [],
      selectedPhoto: null,
      uploading: false,
      amountUploading: 0,
      amountUploaded: 0,
      renameFolderName: ''
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
    this.onChangeRenameFolderName = this.onChangeRenameFolderName.bind(this);
    this.onKeyDownRenameFolder = this.onKeyDownRenameFolder.bind(this);
    this.onClickRename = this.onClickRename.bind(this);
    this.onClickRenameFolder = this.onClickRenameFolder.bind(this);
    this.onClickFolderUp = this.onClickFolderUp.bind(this);
    this.onClickFolderDown = this.onClickFolderDown.bind(this);
    this.onClickPhotoUp = this.onClickPhotoUp.bind(this);
    this.onClickPhotoDown = this.onClickPhotoDown.bind(this);
  }

  public componentDidMount() {
    this.fetchFolders();
  }

  public render() {
    const {
      folders,
      selectedFolder,
      photos,
      selectedPhoto,
      uploading,
      amountUploaded,
      amountUploading
    } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <button className={styles.button} onClick={this.onClickAdd}>
            + Add
          </button>
          <button
            className={styles.button}
            disabled={!selectedFolder}
            onClick={this.onClickRemove}
          >
            - Remove
          </button>
          <button
            className={styles.button}
            disabled={!selectedFolder}
            onClick={this.onClickRename}
          >
            Rename
          </button>
          <button
            className={styles.button}
            disabled={!selectedFolder}
            onClick={this.onClickFolderUp}
          >
            Up
          </button>
          <button disabled={!selectedFolder} onClick={this.onClickFolderDown}>
            Down
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
            className={styles.button}
            disabled={!selectedPhoto}
            onClick={this.onClickRemovePhotoButton}
          >
            - Remove
          </button>
          <button
            className={styles.button}
            disabled={!selectedPhoto}
            onClick={this.onClickPhotoUp}
          >
            Up
          </button>
          <button disabled={!selectedPhoto} onClick={this.onClickPhotoDown}>
            Down
          </button>
          <div className={styles.photoContainer}>
            {uploading ? (
              <progress
                max={100}
                value={(amountUploading / amountUploaded) * 100}
              />
            ) : null}
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
    const { selectedFolder } = this.state;

    fetch('/api/folder/structure')
      .then(response => response.json())
      .then((json: Folder[]) => {
        console.log(json);
        this.setState({
          folders: json,
          selectedFolder: selectedFolder
            ? flattenFolderStructure(json).find(
                f => f.id === selectedFolder.id
              ) || null
            : null
        });
      });
  }

  private fetchPhotos() {
    const { selectedFolder, selectedPhoto } = this.state;

    if (selectedFolder === null) return;

    fetch(`/api/photo/present/${selectedFolder.id}`)
      .then(response => response.json())
      .then((photos: Photo[]) =>
        this.setState({
          photos,
          selectedPhoto: selectedPhoto
            ? photos.find(p => p.id === selectedPhoto.id) || null
            : null
        })
      );
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

  private onClickFolderUp() {
    const { selectedFolder } = this.state;

    if (!selectedFolder) return;

    fetch(`/api/folder/${selectedFolder.id}/order`, {
      method: 'PUT',
      body: JSON.stringify({
        order: Math.max(selectedFolder.order - 1, 0)
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => this.fetchFolders());
  }

  private onClickFolderDown() {
    const { selectedFolder, folders } = this.state;

    if (!selectedFolder) return;

    const size = flattenFolderStructure(folders).filter(
      f => f.parentFolderId === selectedFolder.parentFolderId
    ).length;

    fetch(`/api/folder/${selectedFolder.id}/order`, {
      method: 'PUT',
      body: JSON.stringify({
        order: Math.min(selectedFolder.order + 1, size - 1)
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => this.fetchFolders());
  }

  private onClickPhotoUp() {
    const { selectedPhoto } = this.state;

    if (!selectedPhoto) return;

    fetch(`/api/photo/${selectedPhoto.id}/order`, {
      method: 'PUT',
      body: JSON.stringify({
        order: Math.max(selectedPhoto.order - 1, 0)
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => this.fetchPhotos());
  }

  private onClickPhotoDown() {
    const { selectedPhoto, selectedFolder, photos } = this.state;

    if (!selectedPhoto || !selectedFolder) return;

    fetch(`/api/photo/${selectedPhoto.id}/order`, {
      method: 'PUT',
      body: JSON.stringify({
        order: Math.min(selectedPhoto.order + 1, photos.length - 1)
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => this.fetchPhotos());
  }

  private onClickRename() {
    const { appContext } = this.props;
    const { selectedFolder } = this.state;

    appContext.addNotification({
      autoCloseOnClick: false,
      content: (
        <div>
          <h3>Rename Folder {selectedFolder?.name}</h3>
          <div>
            <label htmlFor="renameFolderName">Folder Name: </label>
            <input
              id="renameFolderName"
              onChange={this.onChangeRenameFolderName}
              type="text"
              onKeyDown={this.onKeyDownRenameFolder}
              autoFocus={true}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              onClick={this.onClickRenameFolder}
              className={styles.button}
            >
              Rename Folder
            </button>
            <button onClick={this.onClickCancel}>Cancel</button>
          </div>
        </div>
      )
    });
  }

  private onClickRenameFolder() {
    const { appContext } = this.props;
    const { renameFolderName, selectedFolder } = this.state;

    fetch(`/api/folder/${selectedFolder?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: renameFolderName
      })
    }).then(() => {
      this.fetchFolders();
      appContext.removeNotification();
    });
  }

  private onChangeRenameFolderName(event: React.FormEvent<HTMLInputElement>) {
    this.setState({
      renameFolderName: event.currentTarget.value
    });
  }

  private onKeyDownRenameFolder(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      this.onClickRenameFolder();
    }
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

      this.setState({
        selectedFolder: null,
        photos: []
      });
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

      this.setState({
        selectedPhoto: null
      });
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

    const files = event.dataTransfer.files;

    this.setState({
      uploading: true,
      amountUploaded: 0,
      amountUploading: files.length
    });

    // const uploads: Promise<any>[] = [];

    this.uploadFiles(Array.from(files));

    // Array.from(files).forEach(file => {
    //   const formData = new FormData();

    //   formData.append('file', file);
    //   formData.append('parentFolderId', selectedFolder.id.toString());

    //   uploads.push(
    //     fetch('/api/photo', {
    //       method: 'POST',
    //       body: formData
    //     })
    //       .then(response => response.json())
    //       .then(() =>
    //         this.setState({ amountUploaded: this.state.amountUploaded + 1 })
    //       )
    //   );
    // });

    // Promise.all(uploads).then(() => {
    //   this.setState({ uploading: false });
    //   this.fetchPhotos();
    // });
  }

  private uploadFiles(files: File[], currentIndex: number = 0) {
    console.log(files, currentIndex);

    const { selectedFolder } = this.state;

    if (!selectedFolder) return;

    if (currentIndex >= files.length) {
      this.setState({ uploading: false });
      this.fetchPhotos();
      return;
    }

    const formData = new FormData();

    formData.append('file', files[currentIndex]);
    formData.append('parentFolderId', selectedFolder.id.toString());

    fetch('/api/photo', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(() => {
        this.setState({ amountUploaded: this.state.amountUploaded + 1 });
        this.uploadFiles(files, ++currentIndex);
      });
  }
}

export const AdminPage = withAppContext(AdminPageComp);
