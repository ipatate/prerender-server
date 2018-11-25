[![Build Status](https://travis-ci.org/ipatate/prerender-server-example.svg?branch=master)](https://travis-ci.org/ipatate/prerender-server-example)

# Prerender server for web app

If crawler visit your web app, the htaccess return prerender response instead web app response. The prerender return the html complete.
It use a google chrome headless for generate html.

You have htaccess example for your web app server. Others examples for nginx are available on the github repo : [https://github.com/prerender/prerender](https://github.com/prerender/prerender)

Article blog [french] [https://www.goodmotion.fr/blog/installer-un-serveur-prerender-pour-ameliorer-le-seo-de-votre-web-app](https://www.goodmotion.fr/blog/installer-un-serveur-prerender-pour-ameliorer-le-seo-de-votre-web-app)

# install chrome on machine is required

For your local machine, no problem. Install juste chrome browser.

# init project

```
npm i && npm run build
```

# use precache crawler system

Set task cron for create file caches. The crawler create page for all page from website. Later, the prerender server serve file cache. Increase speed for serve page.

```
./crawler.js

Usage: crawler [options]

Options:
  -V, --version    output the version number
  -u, --url [url]  url to crawl
  -h, --help       output usage information
```

set url for crawl website and save url in file cache

```
./crawler.js -u https://www.exemple.com
```

exemple for run cron every hour

```
0 * * * *   /your/path/server/crawler.js -u https://www.exemple.com
```

For server, you have exemple here [https://blog.softhints.com/ubuntu-16-04-server-install-headless-google-chrome/](https://blog.softhints.com/ubuntu-16-04-server-install-headless-google-chrome/)
or
[https://tecadmin.net/setup-selenium-chromedriver-on-ubuntu/](https://tecadmin.net/setup-selenium-chromedriver-on-ubuntu/)

## 1 - example with express server and puppeteer. Actually index.js and ssr.js

Pupeteer : Puppeteer is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol. Puppeteer runs headless by default, but can be configured to run full (non-headless) Chrome or Chromium.
[https://github.com/GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer)

The express server catch request and run function for get page from chrome headless browser.
I have add system for cache response.

Base code use for start project, thanks Eric Bidelman : [https://developers.google.com/web/tools/puppeteer/articles/ssr#optimizations](https://developers.google.com/web/tools/puppeteer/articles/ssr#optimizations)

## 2 - example with prerender package

use prerender-index.js for launch prerender system

# Server config

### Apache

You can use for internal request server from localhost:8000.

For external request, you must configure server.
Example for apache, use this virtual host config for redirect request to node server.

Add directory with index.html for DocumentRoot. If node server is down, apache return this index.

Enabling Necessary Apache Modules

```
sudo a2enmod proxy
sudo a2enmod proxy_http
```

Create virtual host

```
<VirtualHost *:443>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/...
    ServerName prerender.example.com
    ServerAlias preredender.example.com

ProxyPass / http://localhost:8000/
ProxyPassReverse / http://localhost:8000/
ProxyPreserveHost On
ProxyRequests Off

</VirtualHost>
```

Active virtual host
```
sudo a2ensite file.conf
```

### Node

For run node on server, i recommand PM2 : [https://pm2.io](https://pm2.io)
Install with :
```
npm install -g pm2
```

run server in prerender directory with this cmd :
```
pm2 start
```

# Web app

You have htaccess file example for your web app.
This file redirect crawler to prerender server.
Change url for your services.

# Try

Use curl request for test

replace localhost:3000 by your url service


### For pupeteer

params :
- url : page to render
- renderType : html (default), png, jpeg, pdf

```
curl http://localhost:8000/render?url=http://exemple.com -w %{time_connect}:%{time_starttransfer}:%{time_total}
```

### For prerender

params :
- url : page to render
- renderType : html (default), png, jpeg, pdf, har

```
curl http://localhost:8000/render?url=http://exemple.com&renderType=jpg -w %{time_connect}:%{time_starttransfer}:%{time_total}
```