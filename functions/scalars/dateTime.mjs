import { GraphQLScalarType } from 'graphql'

import { Kind } from 'graphql/language'

const parseDate = (str) => {
  let d = new Date(str)
  return Number.isNaN(d.getTime()) ? null : d
}

export default new GraphQLScalarType({
  name: 'DateTime',
  serialize (value) {
    return value.toJSON()
  },
  parseValue (value) {
    return parseDate(value)
  },
  parseLiteral (ast) {
    return ast.kind === Kind.STRING ? parseDate(ast.value) : null
  }
})
