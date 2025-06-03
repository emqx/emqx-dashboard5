import * as fflate from 'fflate'

export default () => {
  function getTarRootFilesOnly(arrayBuffer: ArrayBufferLike): string[] {
    const buf = new Uint8Array(arrayBuffer)
    const entries = new Set<string>()
    let offset = 0
    while (offset + 512 <= buf.length) {
      const header = buf.slice(offset, offset + 512)
      // name
      let name = ''
      for (let i = 0; i < 100; i++) {
        if (header[i] === 0) break
        name += String.fromCharCode(header[i])
      }
      if (!name) break

      const typeFlag = header[156]
      if ((typeFlag === 0 || typeFlag === 0x30) && !name.endsWith('/')) {
        if (
          !name.includes('/') ||
          (name.indexOf('/') === name.length - 1 && name.split('/').length === 2)
        ) {
          entries.add(name.split('/')[0])
        }
      }

      // size
      let sizeStr = ''
      for (let i = 124; i < 136; i++) {
        if (header[i] === 0) break
        sizeStr += String.fromCharCode(header[i])
      }
      const size = parseInt(sizeStr.trim(), 8) || 0
      offset += 512 + Math.ceil(size / 512) * 512
    }
    return Array.from(entries)
  }

  const getGzipRootFiles = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const tarData = fflate.decompressSync(new Uint8Array(arrayBuffer))
      const rootEntries = getTarRootFilesOnly(tarData.buffer)
      return rootEntries
    } catch (error) {
      return Promise.reject()
    }
  }
  return {
    getGzipRootFiles,
  }
}
