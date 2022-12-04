import 'zone.js/node';
import 'localstorage-polyfill';
import 'sessionstorage';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

import { AppServerModule } from './src/main.server';

// const dominoModule = require('domino');
// const fsModule = require('fs');
// const indexTemplate = fsModule.readFileSync(
//   join(process.cwd(), 'dist/browser/index.html')
// );
// const win = dominoModule.createWindow(indexTemplate);

// (global as any).window = win;
// (global as any).document = win.document;
// (global as any).Event = win.Event;
// (global as any).HTMLElement = win.HTMLElement;
// (global as any).KeyboardEvent = win.KeyboardEvent;
// (global as any).MouseEvent = win.MouseEvent;
// (global as any).FocusEvent = win.FocusEvent;
// (global as any).object = win.object;
// (global as any).navigator = win.navigator;
// (global as any).localStorage = win.localStorage;
// (global as any).sessionStorage = win.sessionStorage;
// (global as any).DOMTokenList = win.DOMTokenList;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/sales-manager/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
