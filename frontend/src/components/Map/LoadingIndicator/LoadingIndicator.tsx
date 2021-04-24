import { memo, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../state/rootReducer'
import './LoadingIndicator.scss'

function LoadingIndicator() {
  const loadingMessage = useSelector((state: RootState) => state.loading).message

  return loadingMessage && loadingMessage.length > 0 ? (
    <div className="loading-indicator-container">
      <div className="spinner-border text-info" role="status" />
      <div className="loading-indicator-text">{loadingMessage}</div>
    </div>
  ) : (
    <Fragment />
  )
}

export default memo(LoadingIndicator)
