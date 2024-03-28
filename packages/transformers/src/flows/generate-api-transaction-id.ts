/**
 * Generate a 16 character unique APITransactionID
 */
export function generateAPITransactionID() {
  return randomString(16)
}

/**
 * Generate a random string of the given length
 * @param len The length of the string to generate
 * @param specificCharSet The character set to use, defaults to alphanumeric. Be aware that using 'special' characters like =, -, %, (, ) may break the RAFT server causing it to hang.
 */
function randomString(len: number, specificCharSet?: string) {
  const charSet = specificCharSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = ''
  for (let i = 0; i < len; i++) {
    const randomPos = Math.floor(Math.random() * charSet.length)
    randomString += charSet[randomPos]
  }
  return randomString
}
