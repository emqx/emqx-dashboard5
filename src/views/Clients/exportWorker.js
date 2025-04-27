let columns = []
let fileContent = []
let isCSVFormat = true

const processToCSV = (data, columns) => {
  const ret = []
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const rowData = columns.map((col) => row[col.prop]).join(',')
    ret.push(rowData)
  }
  return ret
}

// handle data export
self.onmessage = function (e) {
  const { data, tableColumns, isFinished, isInit, format } = e.data

  if (isInit) {
    fileContent = []
    isCSVFormat = /csv/i.test(format)
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
    self.postMessage({ type: 'complete', data })
  }
}
