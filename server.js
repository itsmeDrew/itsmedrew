'use strict';

var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var app = express();
var api = {};

/*
|--------------------------------------------------------------------------
| ExpressJS Setup
|--------------------------------------------------------------------------
*/

app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/site/pages');

app.use(express.static('site'));
app.use(bodyParser.json());

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

api.samples = require('./api/samples');

app.get('/api/samples', api.samples.get);
app.post('/api/samples', api.samples.store);
app.get('/api/samples/:id', api.samples.show);
app.put('/api/samples/:id', api.samples.update);
app.delete('/api/samples/:id', api.samples.destroy);

/*
|--------------------------------------------------------------------------
| Media Routes
|--------------------------------------------------------------------------
*/

app.get('/image', function(req, res) {
  var defaultSize = 500;
  var url = 'http://lorempixel.com/' + (req.query.width || defaultSize) + '/' + (req.query.height || defaultSize);

  require('request').get(url).pipe(res);
});

/*
|--------------------------------------------------------------------------
| Page Routes
|--------------------------------------------------------------------------
*/

app.get('/:page?', function(req, res) {
  if (req.params.page === 'favicon.ico') return;

  res.render(req.params.page || 'home');
});

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

app.locals.placeholder = function(placeholder) {
  if (! this.placeholders[ placeholder ]) return null;

  if (typeof this.placeholders[ placeholder ] === 'string') {
    return this.placeholders[ placeholder ];
  } else {
    return this.placeholders[ placeholder ].join('');
  }
};

app.locals.hasPlaceholder = function(placeholder) {
  return !! this.placeholders[ placeholder ];
};

app.locals.field = function(field) {
  if (! this.fields[ field ]) return null;

  return this.fields[ field ];
};

app.locals.hasField = function(field) {
  return !! this.fields[ field ];
};

/*
|--------------------------------------------------------------------------
| Start App
|--------------------------------------------------------------------------
*/

app.listen(6410);