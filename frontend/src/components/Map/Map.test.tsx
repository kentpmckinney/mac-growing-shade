import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import Store from '../../state/store'
import { cleanup } from '@testing-library/react'
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
configure({ adapter: new Adapter() })
import Map from './Map'

afterEach(cleanup)

describe('Test the Map component', () => {
  it('Renders without crashing', () => {
    shallow(
      <StrictMode>
        <Provider store={Store}>
          <Map />
        </Provider>
      </StrictMode>
    )
  })
})
