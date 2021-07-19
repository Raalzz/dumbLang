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
    if(expression.type === "literal") {
      return `\"${expression.value}\"`;
    }
  } else {
    //identifier or number
    return expression;
  }
}

// handle variable assignment
function varAssignment(statement, declaredVariables) {
  const value = generateJSForExpression(statement.value, declaredVariables);
  let line;
  if (declaredVariables.indexOf(statement.varname) === -1) {
    line = `let ${statement.varname} = ${value};`;
    declaredVariables.push(statement.varname);
  } else {
    line = `${statement.varname} = ${value};`;
  }
  return line;
}

// handle print statement
function printStatement(statement, declaredVariables) {
  const arguments = statement.expression.map((arg) => {
    if(typeof arg === "object" ) {
      return generateJSForExpression(arg, declaredVariables);
    } 
    return arg;
  });
  return `console.log(${arguments})`;
}

// handle while loop
function whileLoop(statement, declaredVariables) {
  const condition = generateJSForExpression(
    statement.condition,
    declaredVariables
  );
  const body = generateJS(statement.body, declaredVariables)
    .split("\n")
    .map((line) => " " + line)
    .join("\n");
  return `while (${condition}) {\n ${body} \n}`;
}

// handle if statement
function ifStatement(statement, declaredVariables) {
  const lines = [];
  const condition = generateJSForExpression(
    statement.condition,
    declaredVariables
  );
  const body = generateJS(statement.body, declaredVariables);
  lines.push(`if (${condition}) {\n ${body} \n}`);

  // if it has else if's
  if (statement.elifBody) {
    for (const elif of statement.elifBody) {
      const cond = generateJSForExpression(elif.condition, declaredVariables);
      const body = generateJS(elif.body, declaredVariables);
      lines.push(`else if (${cond}) {\n ${body} \n}`);
    }
  }

  // if it has a final else
  if (statement.else) {
    const body = generateJS(statement.else, declaredVariables);
    lines.push(`else {\n ${body} \n}`);
  }
  return lines.join("\n");
}

const visitors = {
  var_assignment: varAssignment,
  print_statement: printStatement,
  while_loop: whileLoop,
  if_statement: ifStatement,
};

function generateJS(statements, declaredVariables) {
  return statements
    .map((stmt) => visitors[stmt.type](stmt, declaredVariables))
    .join("\n");
}

function generator(ASTCode) {
  try {
    const jsCode = generateJS(ASTCode, []);
    return jsCode;
  } catch (e) {
    console.log(`generator Failed ${e.message}`);
  }
}

module.exports = generator;
