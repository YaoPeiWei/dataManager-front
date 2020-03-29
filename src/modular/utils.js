import CryptoJS from 'crypto-js'
/**
 * 加密处理
 */
export const encryption = params => {
  let { data, type, param, key } = params
  let keyStr = CryptoJS.enc.Utf8.parse(key)
  let ivStr = keyStr

  let result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else if (type == 'Aes') {
    param.forEach(ele => {
      let srcs = CryptoJS.enc.Utf8.parse(result[ele])
      var encrypted = CryptoJS.AES.encrypt(srcs, keyStr, {
        iv: ivStr,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      result[ele] = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
    })
  }
  return result
}

/**
 * 解密
 */
export function Decrypt (word, key) {
  let keyStr = CryptoJS.enc.Utf8.parse(key)
  let ivStr = keyStr

  let base64 = CryptoJS.enc.Base64.parse(word)
  let src = CryptoJS.enc.Base64.stringify(base64)

  var decrypt = CryptoJS.AES.decrypt(src, keyStr, {
    iv: ivStr,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
