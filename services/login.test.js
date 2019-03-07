'use strict';

const _startCase = require('lodash/startCase'),
  handlebars = require('handlebars'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`),
  utils = require('../utils');

describe(_startCase(filename), function () {
  describe('compileLoginPage', function () {
    const fn = lib[this.description];

    it('creates a handlebars template', function () {
      handlebars.registerPartial = jest.fn();
      utils.compileTemplate = jest.fn();

      fn();

      expect(handlebars.registerPartial).toHaveBeenCalled();
      expect(utils.compileTemplate).toHaveBeenCalledWith('login.handlebars');
    });
  });
});
