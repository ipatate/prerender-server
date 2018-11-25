#!/usr/bin/env node

const packageJson = require('./package.json');
const {URL} = require('url');
var colors = require('colors');
const program = require('commander');
const crawlWebsite = require('./dist/crawl').default;

program
  .version(packageJson.version)
  .option('-u, --url [url]', 'url to crawl')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp(txt => colors.green(txt));
}

if (program.url !== undefined) {
  try {
    new URL(program.url);
  } catch (e) {
    console.log(e.message); // eslint-disable-line
    process.exit(1);
  }

  crawlWebsite(program.url);
}
