'use strict';

const _startCase = require('lodash/startCase'),
  handlebars = require('handlebars'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`);

describe(_startCase(filename), function () {
  describe('compileLoginPage', function () {
    const fn = lib[this.description];

    it('creates a handlebars template', function () {
      handlebars.compile = jest.fn();

      fn();

      expect(handlebars.compile).toHaveBeenCalled();
    });
  });
});
