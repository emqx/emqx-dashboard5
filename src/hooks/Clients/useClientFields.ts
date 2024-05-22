import useI18nTl from '../useI18nTl'

export default (): {
  clientFields: { [key: string]: Array<string> }
  snake2pascal: (s: string) => string
  getBaseLabel: (label: string) => string
} => {
  const { tl } = useI18nTl('Clients')

  /**
   * Some of the fields on the client detail page (first and second blocks)
   * will also be used for the client list filter columns
   */
  const clientFields = {
    connection: [
      'node',
      'clientid',
      'username',
      'proto_type',
      'listener',
      'ip_address',
      'keepalive',
      'clean_start',
      'is_bridge',
      'client_attrs',
      'connected_at',
      'disconnected_at',
    ],
    session: [
      'expiry_interval',
      'created_at',
      'heap_size',
      'subscriptions',
      'mqueue',
      'inflight',
      'awaiting_rel',
    ],
  }

  /**
   * snake and point to camel, demo: send_msg -> sendMsg; send_msg.qos1 -> sendMsgQos1
   */
  const snake2pascal = (s: string) => {
    return String(s).replace(/((_|\.)[a-z])/g, (m) => m.substring(1).toUpperCase())
  }

  /**
   * It basically just contains the above fields
   */
  const getBaseLabel = (label: string) => {
    return tl(snake2pascal(label))
  }

  return {
    clientFields,
    snake2pascal,
    getBaseLabel,
  }
}
