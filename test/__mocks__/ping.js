export default {
  sys: {
    probe: (url, cb) => {
      switch (url) {
        case 'http://not-found.com':
          return cb(false);
        default:
          return cb(true);
      }
    },
  },
};
