import CryptoJS from "crypto-js"

export function generateSignature(apiSecret: string, payload: string, timestamp: number): string {
  const message = `${timestamp}${payload}`
  return CryptoJS.HmacSHA256(message, apiSecret).toString()
}

export function encryptData(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString()
}

export function decryptData(encryptedData: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export function generateRandomString(length = 32): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)

  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomValues[i] % characters.length)
  }

  return result
}

export function hashPassword(password: string, salt: string): string {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 10000,
  }).toString()
}

export function validateApiKey(apiKey: string): boolean {
  const pattern = /^[A-Za-z0-9]{32}$/
  return pattern.test(apiKey)
}

export function sanitizeInput(input: string): string {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
}
