const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const input = process.argv[2];
const outputDir = process.argv[3] || "decompiled";
if (!input) {
  console.error("Usage: node decompile.js <input.html> [output-directory]");
  process.exit(1);
}

const html = fs.readFileSync(input, "utf8");
const tag = html.indexOf('<script type="module"');
if (tag < 0) throw new Error("Could not find inline type=module script");
const start = html.indexOf(">", tag) + 1;
const end = html.indexOf("</script>", start);
if (start <= 0 || end < 0) throw new Error("Could not locate script bounds");

const code = html.slice(start, end);
const source = ts.createSourceFile(
  "Voxel-Game-Core.js",
  code,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.JS
);
if (source.parseDiagnostics.length) {
  throw new Error("JavaScript parser reported " + source.parseDiagnostics.length + " syntax diagnostics");
}

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
  removeComments: false
});
const formatted = printer.printFile(source);
const blocksAndRules = { blocks: null, worldRules: null };
const recipes = [];

function walk(node) {
  if (ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isIdentifier(node.left)) {
    if (node.left.text === "pm" && ts.isObjectLiteralExpression(node.right)) {
      const value = vm.runInNewContext("(" + node.right.getText(source) + ")");
      blocksAndRules.blocks = value.blocks;
      blocksAndRules.worldRules = value.worldRules;
    }
    if ((node.left.text === "Ky" || node.left.text === "qy") &&
        ts.isArrayLiteralExpression(node.right)) {
      recipes.push(...vm.runInNewContext("(" + node.right.getText(source) + ")"));
    }
  }
  if (ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      (node.name.text === "Ky" || node.name.text === "qy") &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)) {
    recipes.push(...vm.runInNewContext("(" + node.initializer.getText(source) + ")"));
  }
  ts.forEachChild(node, walk);
}

walk(source);
if (!blocksAndRules.blocks || !recipes.length) {
  throw new Error("Could not locate expected block registry or crafting recipes");
}

fs.mkdirSync(outputDir + "/js", { recursive: true });
fs.mkdirSync(outputDir + "/data", { recursive: true });
fs.writeFileSync(
  outputDir + "/js/Voxel-Game-Core.js",
  "/* Formatted compiled bundle; original identifiers and module boundaries are unavailable. */\n" + formatted
);
fs.writeFileSync(
  outputDir + "/data/Voxel-Blocks.json",
  JSON.stringify({ worldRules: blocksAndRules.worldRules, blocks: blocksAndRules.blocks }, null, 2) + "\n"
);
fs.writeFileSync(
  outputDir + "/data/Voxel-Crafting-Recipes.json",
  JSON.stringify(recipes, null, 2) + "\n"
);

console.log(JSON.stringify({
  inputBytes: Buffer.byteLength(code),
  formattedBytes: Buffer.byteLength(formatted),
  topLevelStatements: source.statements.length,
  blocks: blocksAndRules.blocks.length,
  recipes: recipes.length,
  syntaxDiagnostics: source.parseDiagnostics.length
}, null, 2));
