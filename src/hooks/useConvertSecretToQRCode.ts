import QRCode from 'qrcode'

const useConvertSecretToQRCode = () => {
  const canvasRef = ref<HTMLCanvasElement | null>(null)

  const issuer = encodeURIComponent(window.location.hostname)
  const defaultUsername = `admin`

  const getOtpauthUrl = (secret: string, username = defaultUsername) => {
    const otpauthUrl = `otpauth://totp/${issuer}:${username}?secret=${secret}&issuer=${issuer}`
    return otpauthUrl
  }
  const displayQRCode = (secret: string, username?: string, callback?: (url: string) => void) => {
    const otpauthUrl = getOtpauthUrl(secret, username)
    if (!canvasRef.value && !callback) return
    if (callback) {
      QRCode.toDataURL(otpauthUrl, function (err: any, url: string) {
        if (err) throw err
        callback(url)
      })
    } else if (canvasRef.value) {
      QRCode.toDataURL(canvasRef.value, otpauthUrl, function (err: any) {
        console.error(err)
      })
    }
  }

  return {
    canvasRef,
    displayQRCode,
  }
}

export default useConvertSecretToQRCode
