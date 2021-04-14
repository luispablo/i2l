(async function main () {
  try {

    const clipboardy = require("clipboardy");

    const items = clipboardy.readSync().split("\n");
    const quotedItems = items.map(i => `'${i}'`);
    const joinedQuotedItems = quotedItems.join(", ");

    clipboardy.writeSync(joinedQuotedItems);
    console.log(`${items.length} items turned into quoted list and copied to clipboard!`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
