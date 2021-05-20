import * as React from 'react';

import { Photo } from 'containers/AdminPage/AdminPage';

import * as styles from './PhotoStructure.scss';

interface Props {
  photos: Photo[];
  selectedPhoto: Photo | null;
  setSelectedPhoto: (photo: Photo) => void;
}

export class PhotoStructure extends React.Component<Props> {
  public render() {
    const { photos, selectedPhoto } = this.props;

    return (
      <div>
        <table className={styles.photoTable}>
          <tbody>
            {photos.map(photo => {
              return (
                <tr
                  key={photo.id}
                  className={
                    selectedPhoto?.id !== photo.id
                      ? styles.photoRow
                      : styles.selectedPhotoRow
                  }
                  onClick={this.onClickPhoto(photo)}
                >
                  <td className={styles.photoCell}>{photo.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  private onClickPhoto(photo: Photo) {
    return () => {
      const { setSelectedPhoto } = this.props;

      setSelectedPhoto(photo);
    };
  }
}
