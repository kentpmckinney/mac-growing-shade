import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Store from './state/store'
import App from './components/App'
import './index.scss'

render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
