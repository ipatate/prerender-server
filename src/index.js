const express = require('express');
const {ssr} = require('./ssr');

const PORT = process.env.PORT || 8000;

const app = express();

export default () => {
  // home default
  app.get('/', (req, res) => {
    res.send('Hello world');
  });

  // render ssr
  app.get('/render', (req, res, next) => {
    const url = req.query.url;
    // no param url
    if (url === undefined) {
      return res.send('no url defined !');
    }
    return ssr(req.query.url, req.query.renderType)
      .then(html => res.send(html))
      .catch(error => next(error));
  });

  // 404 error
  app.get('*', (req, res) => {
    res.send('404 Url not found');
  });

  // error 500
  app.use(function clientErrorHandler(err, req, res, next) {
    if (process.env.NODE_ENV === 'production') {
      res.status(500).send('Error 500 ! Something failed !');
    } else {
      next(err);
    }
  });

  app.listen(PORT, function() {
    console.log(`Example app listening on port ${PORT}!`); // eslint-disable-line
  });
};
