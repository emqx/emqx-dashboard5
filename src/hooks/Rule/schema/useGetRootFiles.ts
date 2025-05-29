import * as fflate from 'fflate'

export default () => {
  function getTarRootEntriesFromArrayBuffer(arrayBuffer: ArrayBufferLike): string[] {
    const buf = new Uint8Array(arrayBuffer)
    const entries = new Set()
    let offset = 0
    while (offset + 512 <= buf.length) {
      // header
      const header = buf.slice(offset, offset + 512)
      // name
      let name = ''
      for (let i = 0; i < 100; i++) {
        if (header[i] === 0) break
        name += String.fromCharCode(header[i])
      }
      if (!name) break
      const first = name.split('/')[0]
      entries.add(first)
      // size
      let sizeStr = ''
      for (let i = 124; i < 136; i++) {
        if (header[i] === 0) break
        sizeStr += String.fromCharCode(header[i])
      }
      const size = parseInt(sizeStr.trim(), 8) || 0
      offset += 512 + Math.ceil(size / 512) * 512
    }
    return Array.from(entries) as string[]
  }

  const getGzipRootFiles = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer()
    const tarData = fflate.decompressSync(new Uint8Array(arrayBuffer))
    const rootEntries = getTarRootEntriesFromArrayBuffer(tarData.buffer)
    return rootEntries
  }
  return {
    getGzipRootFiles,
  }
}
