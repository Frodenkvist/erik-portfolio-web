import * as React from 'react';
import * as styles from './GalleryPage.scss';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AppContext, withAppContext } from 'components/utils/AppContext';

interface Params {
  folderId: string;
}

interface Props extends RouteComponentProps<Params> {
  appContext: AppContext;
}

interface State {
  photos: EncodedPhoto[];
}

class GalleryPageComp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      photos: []
    };

    this.closeBigPhoto = this.closeBigPhoto.bind(this);
  }

  componentDidMount() {
    this.fetchPhotos();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.match.params.folderId !== prevProps.match.params.folderId) {
      this.setState({
        photos: []
      });

      this.fetchPhotos();
    }
  }

  public render() {
    const { photos } = this.state;

    return (
      <div className={styles.container}>
        {photos.map(photo => {
          return (
            <div
              className={styles.photoContainer}
              onClick={this.onClickPhoto(photo)}
            >
              <img src={photo.data} className={styles.photoImage} />
            </div>
          );
        })}
      </div>
    );
  }

  private fetchPhotos() {
    const { folderId } = this.props.match.params;

    fetch(`/api/photo/present/${folderId}`)
      .then(response => response.json())
      .then((json: { id: number }[]) => {
        json.forEach(j => {
          fetch(`/api/photo/encoded/${j.id}`)
            .then(response => response.json())
            .then((photo: EncodedPhoto) => {
              const photos = this.state.photos;
              photos.push(photo);
              this.setState({
                photos: photos.sort(
                  (a: EncodedPhoto, b: EncodedPhoto) => a.order - b.order
                )
              });
            });
        });
      });
  }

  private onClickPhoto(photo: EncodedPhoto) {
    return () => {
      const { appContext } = this.props;

      appContext.addNotification({
        autoCloseOnClick: false,
        content: (
          <div className={styles.bigPhotoContainer}>
            <img src={photo.data} />
            <span
              className={styles.closeButton}
              onClick={this.closeBigPhoto}
            ></span>
          </div>
        )
      });
    };
  }

  private closeBigPhoto() {
    const { appContext } = this.props;

    appContext.removeNotification();
  }
}

export const GalleryPage = withAppContext(withRouter(GalleryPageComp));
