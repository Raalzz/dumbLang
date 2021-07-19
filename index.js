const fs = require("fs");
const parser = require("./parse.js");
const generator = require("./generate.js");
const exec = require("child_process").exec;

async function main() {
  const filename = process.argv[2];
  const dumbCode = fs.readFileSync(`./src/${filename}`, "utf8", (err, data) => {
    if (err) {
      console.error("error reading the file", err);
      return;
    }
    return data;
  });

  const AST = await parser(dumbCode).catch((e) => {
    console.log("error", e);
  });

  const result = await generator(AST);
  exec(`echo '${result}' | node`, (stdin, stdout, stderr) => {
    console.log(stdout);
  });
}

main();
