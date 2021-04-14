#!/usr/bin/env node

const HELP_OPTION = "h";
const LOWER_OPTION = "l";
const TRIM_OPTION = "t";
const QUOTE_OPTION = "q";

const buildHasOption = function buildHasOption (options) {
  const optionsArray = options && options.indexOf("-") === 0 ? options.substring(1).split("") : [];
  return option => optionsArray.indexOf(option) >= 0;
};

const printHelp = function printHelp () {
  console.log(`
NAME  
    i2l - Turn a set of items into a list

SYNOPSIS
    i2l -[OPTIONS]...

DESCRIPTION
    This tool takes the content from the clipboard and leaves the result also there, replacing the original content.

    -h
        Print this help message

    -l
        Turn to lowercase each item

    -t
        Removes start and end spaces, turns " an_item  " into "an_item"

    -q
        Removes both single and double quotes from each item

EXAMPLES

    i2l -lt
    // This will lower and trim each item
  `);
};

(async function main () {
  try {
    const hasOption = buildHasOption(process.argv[2]);

    if (hasOption(HELP_OPTION)) {
      printHelp();
    } else {
      const clipboardy = require("clipboardy");
  
      const items = clipboardy.readSync().split("\n");
      const processedItems = items.reduce(function (prev, curr) {
        const trimmed = hasOption(TRIM_OPTION) ? curr.trim() : curr;
        const lowered = hasOption(LOWER_OPTION) ? trimmed.toLowerCase() : trimmed;
        const noQuote = hasOption(QUOTE_OPTION) ? lowered.replace(/['"]/g, "") : lowered;
        return prev.concat([noQuote]);
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
