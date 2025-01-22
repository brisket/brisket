import express from 'express';
import Brisket from '../lib/brisket.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import exampleApi from './exampleApi.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 4000;
const API_PORT = process.env.API_PORT || 4001;

import './app/javascripts/server/initializeServer.js';

const app = express()

  // expose compiled assets from public directory
  .use(express.static(`${__dirname}/public`))

  .get('/non-brisket-routes/top', function(request, response) {
    response.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Non-Brisket Route: Top</title>
        </head>
        <body>
          <h1>Non-Brisket Route: Top</h1>

          <iframe src="/non-brisket-routes/parent" style="width: 100%; height: 500px;" id="frame-for-parent"></iframe>
        </body>
      </html>
    `);
  })

  .get('/non-brisket-routes/parent', function(request, response) {
    response.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Non-Brisket Route: Parent</title>
        </head>
        <body>
          <h1>Non-Brisket Route: Parent</h1>

          <iframe src="/" style="width: 100%; height: 500px;" id="frame-for-brisket-app"></iframe>
        </body>
      </html>
    `);
  })

  // setup the Brisket server
  .use(Brisket.createServer({
    debug: true,

    apis: {
      'api': {
        host: `http://localhost:${API_PORT}`
      }
    },

    // add properties here that you want to expose to ServerApp
    //  and ClientApp
    environmentConfig: {
      favoriteTown: 'Brisket Town'
    },

    // add properties that you only want to expose to the ServerApp
    serverConfig: {
      favoriteServer: 'a plate'
    },

    onRouteHandled(options) {
      console.log(`Original request was for: ${options.request.path}`);
      console.log(`Responded to matched route: ${options.route}`);
    }

  }))

  // set up a fallback error handler if Brisket runs into something it can't handle
  .use(function(err, request, response) {
    response.status(500).sendFile(`${__dirname}/public/unrecoverable-error.html`);
  })
;

// print errors to the console
Brisket.onError((error, expressRequest) => {
  console.error('Error: ', error.stack || error);
  console.error('request.referrer: ', expressRequest.url);
});

exampleApi.listen(API_PORT);
app.listen(PORT);

console.log('Brisket app is listening on port %s', PORT);