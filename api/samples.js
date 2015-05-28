'use strict';

var _ = require('lodash');
var faker = require('faker');

/**
 * Stub out a sample resource
 *
 * @param  {Object} options
 * @return {Object}
 */
var stub = function(options) {
  return _.extend({
    id: faker.random.number({ min: 1, max: 1000000 }),
    slug: faker.helpers.slugify(faker.lorem.sentence()),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(),
    date: faker.date.past(),
    image: '//localhost:5000/image'
  }, options || {});
};

/**
 * Validate the params against the required fields
 *
 * @param  {Object} params
 * @return {Boolean}
 */
var validate = function(params) {
  var required = [ 'title', 'body' ];
  var errors = [];

  for (var i = 0; i < required.length; i++) {
    if (! params[required[i]]) {
      errors.push({
        field: required[i],
        message: 'The ' + required[i] + ' field is required.'
      });
    }
  }

  if (errors.length) {
    throw {
      message: 'Invalid params',
      errors: errors
    };
  }

  return true;
};

/**
 * Get a list of resources
 *
 * @param  {Number} limit
 * @param  {Object} options
 * @return {Array}
 */
var get = function(limit, options) {
  var samples = [];
  limit = limit || 10;

  for (var i = 1; i <= limit; i++) {
    var sample = stub(_.extend({ id: i }, options || {}));

    samples.push(sample);
  }

  return samples;
};

/**
 * Get a list of paginated resources
 *
 * @param  {Number} perPage
 * @param  {Number} page
 * @param  {Object} options
 * @return {Object}
 */
var getPaginated = function(perPage, page, options) {
  var samples = [];

  perPage = perPage ? parseInt(perPage, 10) : 10;
  page = page ? parseInt(page, 10) : 1;
  samples = get(perPage);

  return _.extend({
    perPage: perPage,
    page: page,
    total: faker.random.number({ min: 50, max: 100 }),
    results: samples
  }, options || {});
};

/**
 * Create a resource
 *
 * @param  {Object} params
 * @return {Object}
 */
var create = function(params) {
  validate(params);

  return stub({
    title: params.title,
    slug: faker.helpers.slugify(params.title.toLowerCase()),
    body: params.body
  });
};

/*
|--------------------------------------------------------------------------
| API Export
|--------------------------------------------------------------------------
*/

exports.get = function(req, res) {
  res.json(getPaginated(req.query.perPage, req.query.page, {}));
};

exports.show = function(req, res) {
  res.json(stub({ slug: req.params.id }));
};

exports.store = function(req, res) {
  try {
    res.json(create({
      title: req.body.title,
      body: req.body.body
    }));
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

exports.update = function(req, res) {
  try {
    res.json(create({
      title: req.body.title,
      body: req.body.body
    }));
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

exports.destroy = function(req, res) {
  res.json(stub({ slug: req.params.id }));
};
