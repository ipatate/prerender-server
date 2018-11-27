import express from 'express';
import helmet from 'helmet';
import consola from 'consola';
import {ssr, init} from './ssr';
// import crawlWebsite from './crawl';

const PORT = process.env.PORT || 8000;

const app = express();

app.use(helmet());

export default () => {
  const {close} = init();
  // home default
  app.get('/', (req, res) => {
    res.send('Hello world');
  });

  //   app.get('/createCache', (req, res) => {
  //     const url = req.query.url;
  //     // no param url
  //     if (url === undefined) {
  //       return res.send('no url defined !');
  //     }
  //     crawlWebsite(req.query.url);
  //     res.send(`process started for url ${req.query.url}`);
  //   });

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

  const server = app.listen(PORT, function() {
    console.log(`Example app listening on port ${PORT}!`); // eslint-disable-line
  });

  process.on('SIGTERM', () => {
    close(() => {
      consola.info('browser closed');
      server.close(() => {
        consola.info('Http server closed.');
      });
    });
  });

  process.on('SIGINT', () => {
    close(() => {
      consola.info('browser closed'); // eslint-disable-line
      server.close(() => {
        consola.info('Http server closed.');
      });
    });
  });
};
