const { exec } = require("mz/child_process");
const path = require("path");

async function main() {
  const filename = process.argv[2];
  const astFilename = path.basename(filename, ".dumb") + ".ast";
  const jsFilename = path.basename(filename, ".dumb") + ".js";
  await exec(`node parse.js ${filename}`);
  await exec(`node generate.js ${astFilename}`);
  const [output] = await exec(`node ${jsFilename}`);
  process.stdout.write(output.toString());
}

main();
