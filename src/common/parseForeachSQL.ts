/**
 * Parsed field type
 */
interface ParsedField {
  expression: string
  alias: string | null
}

/**
 * FOREACH clause type
 */
interface ForeachClause {
  expression: string
  alias: string
}

/**
 * FOREACH statement parse result type
 */
interface ForeachParseResult {
  type: 'foreach'
  foreach: ForeachClause
  do: ParsedField[] | null
  incase: string | null
  from: string[]
  where: string | null
}

// ============================================
// State machine parser (more robust, recommended for production)
// ============================================

/**
 * FOREACH statement state machine parser
 *
 * Advantages:
 * - Correctly handles nested parentheses
 * - Correctly handles string escaping
 * - Better error handling
 * - Supports all edge cases
 */
class ForeachParser {
  private sql: string
  private pos: number
  private length: number

  constructor(sql: string) {
    this.sql = sql.trim()
    this.pos = 0
    this.length = this.sql.length
  }

  /**
   * Parse FOREACH statement
   * @returns {object} Parse result
   */
  parse(): ForeachParseResult {
    this.skipWhitespace()

    // Check FOREACH keyword
    if (!this.consumeKeyword('FOREACH')) {
      throw new Error('Expected FOREACH keyword')
    }

    const result: ForeachParseResult = {
      type: 'foreach',
      foreach: this.parseForeachClause(),
      do: null,
      incase: null,
      from: [],
      where: null,
    }

    // Parse optional DO clause
    if (this.peekKeyword('DO')) {
      this.consumeKeyword('DO')
      result.do = this.parseDoClause()
    }

    // Parse optional INCASE clause
    if (this.peekKeyword('INCASE')) {
      this.consumeKeyword('INCASE')
      result.incase = this.parseUntilKeyword(['FROM', 'WHERE'])
    }

    // Parse required FROM clause
    if (!this.consumeKeyword('FROM')) {
      throw new Error('Expected FROM keyword')
    }
    result.from = this.parseFromClause()

    // Parse optional WHERE clause
    if (this.peekKeyword('WHERE')) {
      this.consumeKeyword('WHERE')
      result.where = this.parseUntilEnd()
    }

    return result
  }

  /**
   * Parse FOREACH clause
   */
  private parseForeachClause(): ForeachClause {
    const expression = this.parseUntilKeyword(['AS', 'DO', 'INCASE', 'FROM'])

    let alias = 'item'
    if (this.peekKeyword('AS')) {
      this.consumeKeyword('AS')
      alias = this.parseIdentifier()
    }

    return { expression, alias }
  }

  /**
   * Parse DO clause
   */
  private parseDoClause(): ParsedField[] {
    const fields: ParsedField[] = []
    const hasMoreFields = true

    while (hasMoreFields) {
      const fieldExpr = this.parseUntilKeywordOrComma(['AS', 'INCASE', 'FROM', 'WHERE'])

      let alias: string | null = null
      if (this.peekKeyword('AS')) {
        this.consumeKeyword('AS')
        alias = this.parseIdentifier()
      }

      fields.push({ expression: fieldExpr, alias })

      // Check if there are more fields
      this.skipWhitespace()
      if (this.sql[this.pos] === ',') {
        this.pos++
        this.skipWhitespace()
      } else {
        break
      }
    }

    return fields
  }

  /**
   * Parse FROM clause
   */
  private parseFromClause(): string[] {
    const topics: string[] = []
    const hasMoreTopics = true

    while (hasMoreTopics) {
      this.skipWhitespace()

      // Parse quoted topic or plain identifier
      if (this.sql[this.pos] === '"' || this.sql[this.pos] === "'") {
        topics.push(this.parseQuotedString())
      } else {
        topics.push(this.parseIdentifier())
      }

      this.skipWhitespace()

      // Check if there are more topics
      if (this.sql[this.pos] === ',') {
        this.pos++
      } else {
        break
      }
    }

    return topics
  }

  /**
   * Parse quoted string
   */
  private parseQuotedString(): string {
    const quote = this.sql[this.pos]
    this.pos++ // Skip opening quote

    let result = ''
    let escaped = false

    while (this.pos < this.length) {
      const char = this.sql[this.pos]

      if (escaped) {
        result += char
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        this.pos++ // Skip closing quote
        return result
      } else {
        result += char
      }

      this.pos++
    }

    throw new Error('Unterminated string')
  }

  /**
   * Parse identifier
   */
  private parseIdentifier(): string {
    this.skipWhitespace()

    let result = ''
    while (this.pos < this.length) {
      const char = this.sql[this.pos]
      if (/[\w.$#/*+-]/.test(char)) {
        result += char
        this.pos++
      } else {
        break
      }
    }

    return result.trim()
  }

  /**
   * Parse expression until a keyword is encountered
   */
  private parseUntilKeyword(keywords: string[]): string {
    let result = ''
    let depth = 0
    let inString = false
    let stringChar = ''

    while (this.pos < this.length) {
      const char = this.sql[this.pos]

      // Handle strings
      if ((char === '"' || char === "'") && !inString) {
        inString = true
        stringChar = char
        result += char
        this.pos++
        continue
      }

      if (inString && char === stringChar && this.sql[this.pos - 1] !== '\\') {
        inString = false
        result += char
        this.pos++
        continue
      }

      if (inString) {
        result += char
        this.pos++
        continue
      }

      // Track parenthesis depth
      if (char === '(') depth++
      if (char === ')') depth--

      // Check for keywords (only at top level)
      if (depth === 0) {
        for (const keyword of keywords) {
          if (this.peekKeyword(keyword)) {
            return result.trim()
          }
        }
      }

      result += char
      this.pos++
    }

    return result.trim()
  }

  /**
   * Parse expression until a keyword or comma is encountered
   */
  private parseUntilKeywordOrComma(keywords: string[]): string {
    let result = ''
    let depth = 0
    let inString = false
    let stringChar = ''

    while (this.pos < this.length) {
      const char = this.sql[this.pos]

      // Handle strings
      if ((char === '"' || char === "'") && !inString) {
        inString = true
        stringChar = char
        result += char
        this.pos++
        continue
      }

      if (inString && char === stringChar && this.sql[this.pos - 1] !== '\\') {
        inString = false
        result += char
        this.pos++
        continue
      }

      if (inString) {
        result += char
        this.pos++
        continue
      }

      // Track parenthesis depth
      if (char === '(') depth++
      if (char === ')') depth--

      // Check for commas and keywords at top level
      if (depth === 0) {
        if (char === ',') {
          return result.trim()
        }

        for (const keyword of keywords) {
          if (this.peekKeyword(keyword)) {
            return result.trim()
          }
        }
      }

      result += char
      this.pos++
    }

    return result.trim()
  }

  /**
   * Parse until end of string
   */
  private parseUntilEnd(): string {
    const result = this.sql.substring(this.pos)
    this.pos = this.length
    return result.trim()
  }

  /**
   * Skip whitespace characters
   */
  private skipWhitespace(): void {
    while (this.pos < this.length && /\s/.test(this.sql[this.pos])) {
      this.pos++
    }
  }

  /**
   * Check and consume keyword
   */
  private consumeKeyword(keyword: string): boolean {
    this.skipWhitespace()
    const remaining = this.sql.substring(this.pos)
    const regex = new RegExp(`^${keyword}\\b`, 'i')

    if (regex.test(remaining)) {
      this.pos += keyword.length
      this.skipWhitespace()
      return true
    }

    return false
  }

  /**
   * Check (but not consume) keyword
   */
  private peekKeyword(keyword: string): boolean {
    const savedPos = this.pos
    this.skipWhitespace()
    const remaining = this.sql.substring(this.pos)
    const regex = new RegExp(`^${keyword}\\b`, 'i')
    this.pos = savedPos
    return regex.test(remaining)
  }
}

/**
 * Parse FOREACH statement (state machine approach)
 * @param {string} sql - FOREACH SQL statement
 * @returns {object} Parse result
 */
const parseForeachSQL = (sql: string): ForeachParseResult => {
  const parser = new ForeachParser(sql)
  return parser.parse()
}

export default parseForeachSQL
export type { ParsedField, ForeachClause, ForeachParseResult }
