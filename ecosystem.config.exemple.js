module.exports = {
  apps: [
    {
      name: 'prerender server',
      script: 'index.js',
      //   script: 'prerender-index.js',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      //   args: 'one two',
      //   node_args: '--experimental-modules',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
        TTL: 10000,
        // networkidle: 'networkidle2',
        networkidle: 'networkidle0',
      },
      env_production: {
        //   NODE_ENV: 'production'
      },
    },
  ],

  //   deploy: {
  //     production: {
  //       user: '',
  //       host: '',
  //       ref: 'origin/master',
  //       repo: 'git@github.com:',
  //       path: '/media/www/prerender',
  //       'post-deploy': 'yarn && pm2 reload ecosystem.config.js'
  //     }
  //   }
};
