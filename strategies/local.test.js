'use strict';

const _startCase = require('lodash/startCase'),
  _includes = require('lodash/includes'),
  passport = require('passport'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`),
  utils = require('../utils'),
  db = require('../services/storage');

describe(_startCase(filename), function () {
  describe('verifyLocal', function () {
    const fn = lib[this.description];

    it('calls verify with a slightly different function signature', function (done) {
      utils.verify = jest.fn(() => (req, token, tokenSecret, profile, cb) => cb()) // eslint-disable-line
      db.get = jest.fn().mockResolvedValue({ username: 'foo' });

      fn()({}, 'foo', 'bar', function () {
        expect(utils.verify).toBeCalled();
        done();
      });
    });
  });

  describe('createLocalStrategy', function () {
    const siteStub = { slug: 'foo' };

    it('creates ldap strategy', function () {
      passport.use = jest.fn();

      lib(siteStub);

      expect(passport.use).toBeCalled();
    });
  });

  describe('addAuthRoutes', function () {
    const fn = lib[this.description],
      paths = [],
      router = {
        post: function (path) {
          // testing if the paths are added,
          // we're checking the paths array after each test
          paths.push(path);
        }
      };

    it('adds local auth routes', function () {
      fn(router, {}, 'local');
      expect(_includes(paths, '/_auth/local')).toEqual(true);
    });
  });
});
