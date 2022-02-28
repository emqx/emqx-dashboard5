import { SubTabComponent } from '@/types/config'

export default function useSubTabMenu(panes: string[]): {
  panesRef: { [key: string]: SubTabComponent | Element }
  handleClickTab: (tab: SubTabComponent) => void
  setPaneRef: (el: Element, pane: string) => void
} {
  const panesRef: { [key: string]: SubTabComponent | Element } = {}
  const handleClickTab = async (tab: SubTabComponent) => {
    const tabName = panes[tab.index]
    const paneRef = panesRef[tabName] as SubTabComponent
    if (paneRef) {
      paneRef.reloading()
    }
  }

  const setPaneRef = (el: Element, pane: string) => {
    if (el) {
      panesRef[pane] = el
    }
  }
  return {
    panesRef,
    handleClickTab,
    setPaneRef,
  }
}
