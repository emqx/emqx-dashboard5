import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function dashboardLicense(root) {
  return {
    name: 'dashboard-license',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'LICENSE',
        source: readFileSync(resolve(root, 'LICENSE'), 'utf8'),
      })
    },
  }
}
