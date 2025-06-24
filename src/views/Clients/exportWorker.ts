import { Client, ExportTableColumn } from '@/types/client'
import { ClientsExportFormat } from '@/types/enum'
import { stringifyObjSafely } from '@emqx/shared-ui-utils'

let columns: Array<ExportTableColumn> = []
let fileContent: Array<string> = []
let isCSVFormat = true

const processToCSV = (data: Array<Client>, columns: Array<ExportTableColumn>) => {
  const ret = []
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const rowData = columns
      .map((col) => {
        let value = row[col.prop]
        try {
          if (typeof value === 'object') {
            value = stringifyObjSafely(value)
          }
        } catch (error) {
          console.error(error)
        }
        return value
      })
      .join(',')
    ret.push(rowData)
  }
  return ret
}

// handle data export
self.onmessage = function (e) {
  const { data, tableColumns, isFinished, isInit, format } = e.data

  if (isInit) {
    fileContent = []
    isCSVFormat = format === ClientsExportFormat.CSV
    if (isCSVFormat && tableColumns?.length > 0) {
      columns = tableColumns
      // add headers
      const headers = columns.map((col) => col.label).join(',')
      fileContent.push(headers)
    }
  }

  if (data?.length) {
    if (isCSVFormat) {
      const csvData = processToCSV(data, columns)
      fileContent.push(...csvData)
    } else {
      fileContent.push(...data.map(JSON.stringify))
    }
  }

  if (isFinished) {
    const data = isCSVFormat ? fileContent.join('\n') : `[${fileContent.join(',\n')}]`
    // remove headers
    const length = isCSVFormat ? fileContent.length - 1 : fileContent.length
    self.postMessage({ type: 'complete', data, length })
  }
}

export {}
