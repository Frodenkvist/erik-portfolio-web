import * as React from 'react';

interface EncodedPhoto {
  id: number;
  data: string;
}

interface State {
  encodedPhotos: EncodedPhoto[];
}

export class StartPage extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      encodedPhotos: []
    };
  }

  componentDidMount() {
    fetch('/api/photo')
      .then(response => response.json())
      .then((photos: EncodedPhoto[]) =>
        this.setState({
          encodedPhotos: photos
        })
      );
  }

  public render() {
    const { encodedPhotos } = this.state;

    return (
      <div>
        <div
          className="fb-page"
          data-href="https://www.facebook.com/fotograferikkruse"
          data-tabs="timeline"
          data-width=""
          data-height=""
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        >
          <blockquote
            cite="https://www.facebook.com/fotograferikkruse"
            className="fb-xfbml-parse-ignore"
          >
            <a href="https://www.facebook.com/fotograferikkruse">
              Fotograf Erik Kruse
            </a>
          </blockquote>
        </div>
        <div id="pixlee_container"></div>
        {encodedPhotos.map(ep => {
          return <img key={`photo-${ep.id}`} src={ep.data} />;
        })}
      </div>
    );
  }
}
