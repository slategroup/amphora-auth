'use strict';

const _startCase = require('lodash/startCase'),
  _includes = require('lodash/includes'),
  _noop = require('lodash/noop'),
  passport = require('passport'),
  utils = require('../utils'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`);

describe(_startCase(filename), function () {
  describe('verifyLdap', function () {
    const fn = lib[this.description];

    it('calls verify with a slightly different function signature', function (done) {
      utils.verify = jest.fn(() => (req, token, tokenSecret, profile, cb) => cb()) // eslint-disable-line

      process.env.LDAP_URL = 'http://foo.bar';
      process.env.LDAP_BIND_DN = '123';
      process.env.LDAP_BIND_CREDENTIALS = '456';

      fn({})({}, {}, function () {
        expect(utils.verify).toBeCalled();
        done();
      });
    });
  });

  describe('createLDAPStrategy', function () {
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
        get: function (path) {
          // testing if the paths are added,
          // we're checking the paths array after each test
          paths.push(path);
        }
      };

    it('adds ldap auth and callback routes', function () {
      fn(router, {}, 'ldap');
      expect(_includes(paths, '/_auth/ldap')).toEqual(true);
    });
  });

  describe('rejectBasicAuth', function () {
    const fn = lib[this.description];

    it('sets status code to 401', function () {
      const res = { setHeader: _noop, end: _noop };

      fn(res);
      expect(res.statusCode).toEqual(401);
    });

    it('sets authentication header', function () {
      const res = { setHeader: jest.fn(), end: _noop };

      fn(res);
      expect(res.setHeader).toBeCalledWith('WWW-Authenticate', 'Basic');
    });

    it('calls res.end()', function () {
      const res = { setHeader: _noop, end: jest.fn() };

      fn(res);
      expect(res.end).toBeCalledWith('Access denied');
    });
  });

  describe('checkCredentials', function () {
    const fn = lib[this.description];

    it('rejects synchronously if no credentials found', function () {
      const res = { setHeader: _noop, end: jest.fn() };

      fn({ headers: {}}, res, _noop);
      expect(res.end).toBeCalled();
    });

    function request(authorization) {
      return {
        headers: {
          authorization: authorization
        }
      };
    }

    it('passes through if credentials exist', function (done) {
      const req = request('basic Zm9vOmJhcg==');

      fn(req, {}, done); // expect done to be called
    });
  });
});
