'use strict';

const _startCase = require('lodash/startCase'),
  handlebars = require('handlebars'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`);

describe(_startCase(filename), function () {
  describe('compileTemplate', function () {
    const fn = lib[this.description];

    it('calls the compile method', function () {
      handlebars.compile = jest.fn();

      fn('login.handlebars');

      expect(handlebars.compile).toHaveBeenCalled();
    });
  });

  describe('serializeUser', function () {
    const fn = lib[this.description];

    it('calls `next` if no error', function () {
      const done = jest.fn(),
        mockUser = { username: 'fake', provider: 'google' };

      fn(mockUser, done);
      expect(done).toBeCalled();
    });
  });

  describe('getPathOrBase', function () {
    const fn = lib[this.description];

    it('adds initial slash if site path is emptystring', function () {
      expect(fn({ path: '' })).toEqual('/');
    });

    it('does not add slash if site path exists', function () {
      expect(fn({ path: '/foo'})).toEqual('/foo');
    });
  });

  describe('getCallbackUrl', function () {
    const fn = lib[this.description];

    it('adds initial slash (after the site path) if site has a path', function () {
      expect(fn({ path: '/foo', prefix: 'domain.com/foo', port: '80'}, 'twitter')).toEqual('http://domain.com/foo/_auth/twitter/callback');
    });

    it('does not add slash if site has no path', function () {
      expect(fn({ prefix: 'domain.com/', port: '80'}, 'twitter')).toEqual('http://domain.com/_auth/twitter/callback');
    });
  });
});
