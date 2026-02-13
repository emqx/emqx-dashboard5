const useGatewayBlockwise = () => {
  const createDefaultBlockwise = () => ({
    enable: true,
    max_block_size: 1024,
    max_body_size: '4MB',
    exchange_lifetime: '247s',
  })
  return {
    createDefaultBlockwise,
  }
}

export default useGatewayBlockwise
