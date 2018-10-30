export const html = '<html><head></head><body></body></html>';

const page = {
  content: () => Promise.resolve(html),
  goto: () => jest.fn,
  close: () => jest.fn,
  setRequestInterception: () => jest.fn,
  on: (event, cb) => cb({resourceType: () => 'document', continue: jest.fn}),
  screenshot: () => Promise.resolve('picture'),
  pdf: () => Promise.resolve('pdf'),
};

const browser = {
  newPage: () => new Promise(resolve => setTimeout(() => resolve(page), 500)),
  close: () => jest.fn,
  wsEndpoint: () => jest.fn,
};

export default {
  launch: () => Promise.resolve(browser),
  connect: () => Promise.resolve(browser),
};
