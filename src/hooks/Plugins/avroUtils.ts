// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { jsonToAvro, avroToJson } from 'json-to-avro'
import avro from 'avsc'

const getFieldSchema = (schema: avro.Schema, fieldPath: Array<string>) => {
  if (typeof schema === 'string' || !('type' in schema) || schema.type !== 'record') {
    return null
  }
  const targetSchema = schema.fields.find((field) => field.name === fieldPath[0])
  if (!targetSchema) {
    return null
  }
  if (fieldPath.length === 1) {
    return targetSchema
  }
  return getFieldSchema(targetSchema.type, fieldPath.slice(1))
}

const formatNumber = (schema: avro.Schema, record: Record<string, any>) => {
  const format = (data: Record<string, any>, filePath: Array<string>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value !== 'object') {
        const fieldSchema = getFieldSchema(schema, [...filePath, key])
        if (fieldSchema) {
          if (fieldSchema.type === 'int' && typeof value === 'string' && intReg.test(value)) {
            data[key] = Number(value)
          }
        }
      } else {
        format(value, [...filePath, key])
      }
    })
  }
  format(record, [])
  return record
}

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
      const formattedData = formatNumber(schema, data)
      const result = jsonToAvro(schema, formattedData)
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
