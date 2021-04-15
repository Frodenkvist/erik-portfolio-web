import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'file-loader?name=[name].[ext]!../public/index.html';

import { App } from './App/App';

ReactDOM.render(<App />, document.getElementById('app'));
