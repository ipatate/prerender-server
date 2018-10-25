process.env['CACHE_TTL'] = 5000;
// const pluginPrerender = require('prerender-node');
const prerender = require('prerender');

const server = prerender({
  // location for ubuntu server. comment chromeLocation and chromeFlags for your local dev machine
  chromeLocation: '/opt/google/chrome/chrome',
  chromeFlags: [
    '--no-sandbox',
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--hide-scrollbars',
    '--disable-setuid-sandbox',
  ],
  //   logRequests: true
});

// exemple for add cache response
server.use(require('prerender-memory-cache'));

/* using plugin for use function before and after */

// server.use(
//   pluginPrerender.set('beforeSend', (req, res, next) => {
//     req.headers['Access-Control-Allow-Origin'] = '*';
//     next();
//   })
// );

server.start();
