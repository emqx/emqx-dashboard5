import console from './console.png'
import event from './event.png'
import republish from './republish.png'
import rule from './rule.png'
import topic from './topic.png'

const BRIDGE_PREFIX = 'bridge-'
const bridgeReg = new RegExp(`^${BRIDGE_PREFIX}`)

const iconMap: Record<string, SVGAElement> = {
  console,
  event,
  republish,
  rule,
  topic,
}

const getIcon = (target: string): SVGAElement | undefined => {
  if (target in iconMap) {
    return iconMap[target]
  }
  try {
    if (bridgeReg.test(target)) {
      return require(`@/assets/img/${target.replace(BRIDGE_PREFIX, '')}.png`)
    }
    return undefined
  } catch (error) {
    return undefined
  }
}

export default getIcon
