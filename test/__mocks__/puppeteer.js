const result = '<html><body></body></html>';

const page = {
  content: () => Promise.resolve(result),
  goto: () => Promise.resolve(),
  screenshot: () => Promise.resolve(result),
  pdf: () => Promise.resolve(result),
};

const browser = {
  newPage: () => new Promise(resolve => setTimeout(() => resolve(page), 500)),
  close: () => Promise.resolve(),
};

export default {
  launch: () => Promise.resolve(browser),
};
