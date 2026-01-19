import CustomMessage from './CustomMessage'

const HTTPErrorMessage = (message: VNode) => {
  return CustomMessage.info({ message, showClose: true, customClass: 'http-error-message' })
}

export default HTTPErrorMessage
