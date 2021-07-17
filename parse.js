const nearley = require("nearley");
const grammar = require("./dumb.js");

async function parse(code) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  try {
    parser.feed(code);
    return parser.results[0];
  } catch (e) {
    console.log(`Parser Failed ${e.message}`);
  }
}

module.exports = parse;
