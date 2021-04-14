#!/usr/bin/env node

// TODO: -q remove quotes

const HELP_OPTION = ["h", "help"];
const LOWER_OPTION = ["l", "lower"];
const TRIM_OPTION = ["t", "trim"];

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

    -h, --help
              Print this help message

    -l, --lower
              Turn to lowercase each item

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
      const processedItems = items.reduce(function (prev, curr) {
        const trimmed = hasOption(TRIM_OPTION) ? curr.trim() : curr;
        const lowered = hasOption(LOWER_OPTION) ? trimmed.toLowerCase() : trimmed;
        return prev.concat([lowered]);
      }, []);
      const quotedItems = processedItems.map(i => `'${i}'`);
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
