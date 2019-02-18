'use strict';

const _startCase = require('lodash/startCase'),
  _includes = require('lodash/includes'),
  passport = require('passport'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`);

describe(_startCase(filename), function () {
  describe('createGoogleStrategy', function () {
    const siteStub = { slug: 'foo' };

    it('creates google strategy', function () {
      passport.use = jest.fn();

      process.env.GOOGLE_CONSUMER_KEY = '123';
      process.env.GOOGLE_CONSUMER_SECRET = '456';
      process.env.GOOGLE_PROFILE_URL = 'http://foo.com',
      lib(siteStub);

      expect(passport.use).toBeCalled();
    });
  });

  describe('addAuthRoutes', function () {
    const fn = lib[this.description],
      paths = [],
      router = {
        get: function (path) {
          // testing if the paths are added,
          // we're checking the paths array after each test
          paths.push(path);
        },
        use: jest.fn(),
      };

    it('adds google auth and callback routes', function () {
      fn(router, {}, 'google');
      expect(_includes(paths, '/_auth/google')).toEqual(true);
      expect(_includes(paths, '/_auth/google/callback')).toEqual(true);
    });
  });
});
