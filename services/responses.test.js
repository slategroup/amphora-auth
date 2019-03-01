'use strict';

const _startCase = require('lodash/startCase'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`);

describe(_startCase(filename), function () {
  describe('expectJSON', function () {
    let fn = lib[this.description];

    it('should work', function () {
      fn();
    });
  });
});
