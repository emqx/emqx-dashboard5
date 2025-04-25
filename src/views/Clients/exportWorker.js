let columns = []
let csvContent = []

const processToCSV = (data, columns) => {
  const ret = []
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const rowData = columns
      .map((col) => {
        let value = row[col.prop]
        // handle special value
        if (value === null || value === undefined) {
          value = ''
        } else if (typeof value === 'boolean') {
          value = value ? 'true' : 'false'
        } else if (typeof value === 'object') {
          value = JSON.stringify(value)
        } else if (typeof value === 'string') {
          // handle value contains comma, newline or double quotes
          if (value.includes(',') || value.includes('\n') || value.includes('"')) {
            value = `"${value.replace(/"/g, '""')}"`
          }
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
  const { data, tableColumns, isFinished, isInit } = e.data

  if (isInit && tableColumns?.length > 0) {
    columns = tableColumns
    csvContent = []
    // add headers
    const headers = columns.map((col) => col.label).join(',')
    csvContent.push(headers)
  }

  if (data?.length) {
    const csvData = processToCSV(data, columns)
    csvContent.push(...csvData)
  }

  if (isFinished) {
    self.postMessage({
      type: 'complete',
      data: csvContent.join('\n'),
    })
  }
}
