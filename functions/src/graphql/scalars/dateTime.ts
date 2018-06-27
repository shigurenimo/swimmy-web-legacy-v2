import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  serialize(value) {
    if (typeof value === 'object') {
      return value.toJSON();
    }
    return value;
  },
  parseValue(value) {
    return parseDate(value);
  },
  parseLiteral(ast) {
    return ast.kind === Kind.STRING ? parseDate(ast.value) : null;
  },
});

const parseDate = (str) => {
  let d = new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
};
