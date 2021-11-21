export function hexToDecimal(hex) {
  //@ts-ignore
  return parseInt(Number(hex), 10)
}

export function decimalToHex(decimal) {
  //@ts-ignore
  return decimal.toString(16)
}
