// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { jsonToAvro, avroToJson } from 'json-to-avro'
import avro from 'avsc'

/**
 * Converts an object to Avro JSON format.
 * Special handling for union types. Converts a value like { value: 'test' } to { value: { string: 'test' } } for a schema ["null", "string"]
 * @param schema - The Avro schema.
 * @param data - The object to be converted.
 * @returns The converted object in Avro JSON format.
 */
export function objectToAvroJson(
  schema: avro.Schema,
  data: Record<string, any>,
): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    try {
      const result = jsonToAvro(schema, data)
      resolve(result)
    } catch (error) {
      const err = error as unknown as Error
      ElMessage.error(`Error validating Avro data: ${err.message}`)
      reject(error)
    }
  })
}

/**
 * Converts Avro JSON data to a JavaScript object based on the provided Avro schema.
 * Special handling for union types. Converts a value like { value: 'test' } to { value: { string: 'test' } } for a schema ["null", "string"]
 * @param schema - The Avro schema used for conversion.
 * @param data - The Avro JSON data to be converted.
 * @returns The converted JavaScript object.
 */
export function AvroJsonToObject(
  schema: avro.Schema,
  data: Record<string, any>,
): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    try {
      const result = avroToJson(schema, data)
      resolve(result)
    } catch (error) {
      const err = error as unknown as Error
      ElMessage.error(`Error converting Avro JSON to object: ${err}`)
      reject(error)
    }
  })
}

export default {}
