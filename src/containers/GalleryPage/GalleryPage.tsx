import * as React from 'react';
import * as styles from './GalleryPage.scss';

import { RouteComponentProps, withRouter } from 'react-router-dom';

interface Params {
  folderId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface State {
  photos: EncodedPhoto[];
}

class GalleryPageComp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      photos: []
    };
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
              style={{ background: `#eee url(${photo.data}) center center` }}
            >
              {/* <img key={photo.id} src={photo.data}></img> */}
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
}

export const GalleryPage = withRouter(GalleryPageComp);
