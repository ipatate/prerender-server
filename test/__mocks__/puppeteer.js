const result = '<html><body></body></html>';

const page = {
  content: () => Promise.resolve(result),
  goto: () => Promise.resolve(),
  screenshot: () => Promise.resolve('picture'),
  pdf: () => Promise.resolve('pdf'),
};

const browser = {
  newPage: () => new Promise(resolve => setTimeout(() => resolve(page), 500)),
  close: () => Promise.resolve(),
};

export default {
  launch: () => Promise.resolve(browser),
};
