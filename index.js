#!/usr/bin/env node

// TODO: -t remove spaces
// TODO: -l toLower items
// TODO: -q remove quotes

const HELP_OPTION = ["h", "help"];

const buildHasOption = function buildHasOption (argv) {
  const options = argv.filter(a => a[0] === "-");

  return function hasOption (option) {
    return options.some(o => `-${option[0]}` === o || `--${option[1]}` === o);
  };
};

const printHelp = function printHelp () {
  console.log(`
NAME  
    i2l - Turn a set of items into a list

SYNOPSIS
    i2l [OPTIONS]...

DESCRIPTION
    This tool takes the content from the clipboard and leaves the result also there, replacing the original content.

    -t, --trim
              Removes start and end spaces, turns " an_item  " into "an_item"
  `);
};

(async function main () {
  try {
    const hasOption = buildHasOption(process.argv);

    if (hasOption(HELP_OPTION)) {
      printHelp();
    } else {
      const clipboardy = require("clipboardy");
  
      const items = clipboardy.readSync().split("\n");
      const quotedItems = items.map(i => `'${i}'`);
      const joinedQuotedItems = quotedItems.join(", ");
  
      clipboardy.writeSync(joinedQuotedItems);
      console.log(`${items.length} items turned into quoted list and copied to clipboard!`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
