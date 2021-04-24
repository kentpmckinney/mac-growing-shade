import { StrictMode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Store from './state/store';
import App from './components/App';
import './index.scss';

render(
  <StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);