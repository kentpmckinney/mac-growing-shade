import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import Store from '../../../../state/store'
import { cleanup } from '@testing-library/react'
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
configure({ adapter: new Adapter() })
import Slider from './Slider'

afterEach(cleanup)

describe('Test the Slider component', () => {
  it('Renders without crashing', () => {
    shallow(
      <StrictMode>
        <Provider store={Store}>
          <Slider
            min={0}
            max={100}
            label="Label"
            name="Name"
            width="100px"
            unit=""
            defaultValue={{ min: 50, max: 55 }}
            step={1}
            description=""
            table=""
            column=""
            display={['block']}
          />
        </Provider>
      </StrictMode>
    )
  })
})
