module.exports = {
  apps: [
    {
      name: 'prerender server',
      script: 'index.js',
      //   script: 'prerender-index.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      //   args: 'one two',
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        //   NODE_ENV: 'development'
        PORT: 8000
      },
      env_production: {
        //   NODE_ENV: 'production'
      }
    }
  ]

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
