import {addAsync} from '../src/utils/inject';

test('inject async in script tag', () => {
  const html = `<html><head><script charset="utf-8" src="/b09d3e62070d304b57fb.Home.js"></script></head><body><main><div></div></main></div><script type="text/javascript">window.__INITIAL_LANG__ = {"fr":{"translation":{"Home":"Accueil","history":"Histoire"}}};</script><script type="text/javascript">window.__INITIAL_STATE__ = {"ux":{"showLoader":false,"languages":["fr"],"currentLanguage":"fr","errorMessage":""},"films":[]};</script><script src="/main.dc74ab992de17e7b4922.js" async></script></body></html>`;

  const result = addAsync(html);
  expect(result).toMatchSnapshot();
});
