const crawlWebsite = require('./dist/crawl').default;
if (process.argv[2]) {
  crawlWebsite(process.argv[2]);
} else {
  console.log('dont forget url in argument'); // eslint-disable-line
}
