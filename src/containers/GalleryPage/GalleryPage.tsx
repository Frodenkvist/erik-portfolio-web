import * as React from 'react';

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

  componentDidUpdate(prevProps: Props) {
    if (this.props.match.params.folderId !== prevProps.match.params.folderId) {
      this.setState({
        photos: []
      });

      fetch(`/api/photo/encoded/${this.props.match.params.folderId}`)
        .then(response => response.json())
        .then((json: EncodedPhoto[]) => this.setState({ photos: json }));
    }
  }

  public render() {
    const { photos } = this.state;

    return (
      <div>
        {photos.map(photo => {
          return <img key={photo.id} src={photo.data}></img>;
        })}
      </div>
    );
  }
}

export const GalleryPage = withRouter(GalleryPageComp);
