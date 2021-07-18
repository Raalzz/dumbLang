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

      // handle if_else statements.
    } else if (statement.type === "if_statement") {
      const condition = generateJSForExpression(
        statement.condition,
        declaredVariables
      );
      const body = generateJS(statement.body, declaredVariables);
      lines.push(`if (${condition}) {\n ${body} \n}`);

      // if it has else if's
      if (statement.elifBody) {
        for (const elif of statement.elifBody) {
          const cond = generateJSForExpression(
            elif.condition,
            declaredVariables
          );
          const body = generateJS(elif.body, declaredVariables);
          lines.push(`else if (${cond}) {\n ${body} \n}`);
        }
      }

      // if it has a final else
      if (statement.else) {
        const body = generateJS(statement.else, declaredVariables);
        lines.push(`else {\n ${body} \n}`);
      }
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
    "=": "===",
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
