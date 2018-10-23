const express = require('express');
const ssr = require('./ssr').default;

const PORT = process.env.PORT || 8000;

const app = express();

app.get('*', (req, res) => {
  const url = req.query.url;
  // no param url
  if (url === undefined) {
    return res.send('no url defined !');
  }
  return ssr(req.query.url, req.query.renderType).then(html => res.send(html));
});

app.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});
