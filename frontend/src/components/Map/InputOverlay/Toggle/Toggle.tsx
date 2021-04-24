import { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useMount } from 'react-use'
import { useAppDispatch } from '../../../../state/store'
import { RootState } from '../../../../state/rootReducer'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import { updateToggleValue, ToggleItem, ToggleCollection } from './ToggleStateSlice'
import './Toggle.scss'

export type ToggleProps = {
  label: string
  description: string
  name: string
  left: string
  center: string
  right: string
  table: string
  column: string
}

function Toggle(props: ToggleProps) {
  const name = props.name || ''
  const table = props.table || ''
  const column = props.column || ''
  const type = 'toggle'
  let value = ''
  const dispatch = useAppDispatch()

  /* Write the slider's default value to the Redux store on component mount */
  useMount((): void => {
    dispatch(updateToggleValue({ name, value, table, column, type }))
  })

  /* Read the slider's value from the Redux store */
  const { toggles } = useSelector((state: RootState): ToggleCollection => state.toggles)
  const toggle = toggles.filter((x: ToggleItem): boolean => x.name === props.name)[0]
  if (toggle !== undefined) value = toggle.value

  /* Write the slider's value to the Redux store as the value changes */
  const onChange = (e: any): void => {
    const value = e.currentTarget.value
    dispatch(updateToggleValue({ name, value, table, column, type }))
  }

  /* Define a popover that lets the user click to see a description for the toggle's value */
  const popover: JSX.Element = useMemo(
    () => (
      <Popover id="popover-basic">
        <Popover.Title as="h3">{props.label}</Popover.Title>
        <Popover.Content>{props.description}</Popover.Content>
      </Popover>
    ),
    [props.label, props.description]
  )

  return (
    <div className="toggle-container">
      <fieldset className="toggle-fieldset">
        <legend className="toggle-legend">
          {/* Show a label that can be clicked on to view a popover */}
          <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose>
            <div className="toggle-label">
              {props.label}
              <span>&nbsp;ⓘ</span>
            </div>
          </OverlayTrigger>
        </legend>
        <div className="switch-toggle">
          <input
            className="toggle-input"
            id={`${props.name}-left`}
            name={props.name}
            type="radio"
            onChange={onChange}
            value={props.left}
          />
          <label className="toggle-input-label" htmlFor={`${props.name}-left`}>
            {props.left}
          </label>
          <input
            className="toggle-input"
            id={`${props.name}-center`}
            name={props.name}
            type="radio"
            onChange={onChange}
            value=""
            defaultChecked
          />
          <label className="toggle-input-label" htmlFor={`${props.name}-center`}>
            {props.center}
          </label>
          <input
            className="toggle-input"
            id={`${props.name}-right`}
            name={props.name}
            type="radio"
            onChange={onChange}
            value={props.right}
          />
          <label className="toggle-input-label" htmlFor={`${props.name}-right`}>
            {props.right}
          </label>
          <a className="toggle-button" />
        </div>
      </fieldset>
    </div>
  )
}

export default memo(Toggle)
