const useGatewayBlockwise = () => {
  const createDefaultBlockwise = () => ({
    enable: true,
    max_block_size: 1024,
    max_body_size: '4MB',
    exchange_lifetime: '247s',
    auto_tx_block1: true,
    auto_rx_block2: true,
    auto_tx_block2: false,
  })
  return {
    createDefaultBlockwise,
  }
}

export default useGatewayBlockwise
