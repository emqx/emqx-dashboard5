import JSONBig from 'json-bigint'

// JSONBig with default configuration, suitable for handling both integer and floating-point big numbers
const jsonBigNumber = JSONBig

// JSONBig configured to use native BigInt, optimized for integer-only big numbers
const jsonBigInt = JSONBig({
  useNativeBigInt: true,
})

/**
 * Parse JSON string with enhanced support for big numbers.
 * @param value The string to parse as JSON
 * @param reviver A function that transforms the results
 * @returns Parsed JSON object
 */
const jsonParse = (value: string, reviver?: (this: any, key: string, value: any) => any): any => {
  try {
    // Attempt to parse using native BigInt for integer-only JSON
    return jsonBigInt.parse(value, reviver)
  } catch {
    try {
      // If that fails, try parsing with BigNumber for floating-point numbers
      return jsonBigNumber.parse(value, reviver)
    } catch {
      // If both custom parsers fail, fall back to native JSON.parse
      return JSON.parse(value, reviver)
    }
  }
}

/**
 * Stringify JSON with enhanced support for big numbers.
 * @param value The value to convert to a JSON string
 * @param replacer A function that alters the behavior of the stringification process
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text
 * @returns JSON string
 */
const jsonStringify = (
  value: Record<string, unknown>,
  replacer?: (this: any, key: string, value: any) => any | (number | string)[] | null,
  space?: string | number,
): string => {
  try {
    // Attempt to stringify using native BigInt for integer-only JSON
    return jsonBigInt.stringify(value, replacer as any, space)
  } catch {
    // If that fails, use BigNumber library (note: integers will be in scientific notation)
    return jsonBigNumber.stringify(value, replacer as any, space)
  }
}

export { jsonParse, jsonStringify }
