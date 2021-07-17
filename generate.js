function generateJS(statements, declaredVariables) {
  const lines = [];
  for (let statement of statements) {
    if (statement.type === "var_assignment") {
      const value = generateJSForExpression(statement.value, declaredVariables);
      if (declaredVariables.indexOf(statement.varname) === -1) {
        lines.push(`let ${statement.varname} = ${value};`);
        declaredVariables.push(statement.varname);
      } else {
        lines.push(`${statement.varname} = ${value};`);
      }
    } else if (statement.type === "print_statement") {
      const expression = generateJSForExpression(
        statement.expression,
        declaredVariables
      );
      lines.push(`console.log(${expression});`);
    } else if (statement.type === "while_loop") {
      const condition = generateJSForExpression(
        statement.condition,
        declaredVariables
      );
      const body = generateJS(statement.body, declaredVariables)
        .split("\n")
        .map((line) => " " + line)
        .join("\n");
      lines.push(`while (${condition}) {\n ${body} \n}`);
    }
  }
  return lines.join("\n");
}

function generateJSForExpression(expression, declaredVariables) {
  const operatorMap = {
    "+": "+",
    "-": "-",
    "*": "*",
    "/": "/",
    ">": ">",
    "<": "<",
    ">=": ">=",
    "<=": "<=",
    "=": "==="
  };
  if (typeof expression === "object") {
    if (expression.type === "binary_expression") {
      const left = generateJSForExpression(expression.left, declaredVariables);
      const right = generateJSForExpression(
        expression.right,
        declaredVariables
      );
      const operator = operatorMap[expression.operator];
      return `${left} ${operator} ${right}`;
    }
  } else {
    //identifier or number
    return expression;
  }
}
async function generator(ASTCode) {
  try {
    const jsCode = generateJS(ASTCode, []);
    return jsCode;
  } catch (e) {
    console.log(`generator Failed ${e.message}`);
  }
}

module.exports = generator;
