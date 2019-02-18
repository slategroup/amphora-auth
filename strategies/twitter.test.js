'use strict';

const _startCase = require('lodash/startCase'),
  _includes = require('lodash/includes'),
  passport = require('passport'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`);

describe(_startCase(filename), function () {
  describe('createTwitterStrategy', function () {
    const siteStub = {
      slug: 'foo'
    };

    it('creates twitter strategy', function () {
      passport.use = jest.fn();

      process.env.TWITTER_CONSUMER_KEY = '123';
      process.env.TWITTER_CONSUMER_SECRET = '456';
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
        }
      };

    it('adds twitter auth and callback routes', function () {
      fn(router, {}, 'twitter');
      expect(_includes(paths, '/_auth/twitter')).toEqual(true);
      expect(_includes(paths, '/_auth/twitter/callback')).toEqual(true);
    });
  });
});
