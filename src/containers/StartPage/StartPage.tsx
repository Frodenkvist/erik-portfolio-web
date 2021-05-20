import * as React from 'react';

export class StartPage extends React.Component {
  public render() {
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
      </div>
    );
  }
}
