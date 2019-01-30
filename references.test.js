'use strict';

const _startCase = require('lodash/startCase'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`);

describe(_startCase(filename), function () {
  describe('uriToUrl', function () {
    const fn = lib[this.description];

    it('converts without protocol and port', function () {
      expect(fn('localhost')).toEqual('http://localhost/');
    });

    it('converts given protocol and port', function () {
      expect(fn('localhost', 'https', '3333')).toEqual('https://localhost:3333/');
    });

    it('does not say port 80 for http', function () {
      expect(fn('localhost', 'http', '80')).toEqual('http://localhost/');
    });
  });
});
