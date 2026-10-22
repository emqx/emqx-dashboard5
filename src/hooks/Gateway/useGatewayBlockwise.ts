import type { BlockwiseConfig } from '@/types/typeAlias'

const useGatewayBlockwise = () => {
  const createDefaultBlockwise = (): Required<BlockwiseConfig> => ({
    enable: true,
    max_block_size: 1024,
    max_body_size: '4MB',
    max_concurrent_exchanges: 16,
    max_total_size: '16MB',
    exchange_lifetime: '247s',
  })
  return {
    createDefaultBlockwise,
  }
}

export default useGatewayBlockwise
