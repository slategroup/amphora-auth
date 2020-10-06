'use strict';
const _startCase = require('lodash/startCase'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require('./constants');

describe(_startCase(filename), function () {
  describe('strToBool', function () {
    const fn = lib[this.description];

    it('returns true for all acceptable truthy values', function () {
      ['TRUE', 'T', 't', 'true', '1'].forEach((s) => {
        expect(fn(s, false)).toEqual(true);
      });
    });

    it('returns false for all acceptable falsy values', function () {
      ['FALSE', 'F', 'f', 'false', '0'].forEach((s) => {
        expect(fn(s, true)).toEqual(false);
      });
    });

    it('respects the default value when given invalid values', function () {
      ['x', undefined, null].forEach((s) => {
        expect(fn(s, true)).toEqual(true);
        expect(fn(s, false)).toEqual(false);
      });
    });
  });
});
