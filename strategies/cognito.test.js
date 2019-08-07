'use strict';

const _startCase = require('lodash/startCase'),
  _includes = require('lodash/includes'),
  passport = require('passport'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`);

describe(_startCase(filename), function () {
  describe('createCognitoStrategy', function () {
    const siteStub = { slug: 'foo' };

    it('creates cognito strategy', function () {
      passport.use = jest.fn();

      process.env.COGNITO_CONSUMER_KEY = '123';
      process.env.COGNITO_CONSUMER_SECRET = '456';
      process.env.COGNITO_PROFILE_URL = 'http://foo.com',
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

    it('adds cognito auth and callback routes', function () {
      fn(router, {}, 'cognito');
      expect(_includes(paths, '/_auth/cognito')).toEqual(true);
      expect(_includes(paths, '/_auth/cognito/callback')).toEqual(true);
    });
  });
});
