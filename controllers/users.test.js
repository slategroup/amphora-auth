'use strict';

const _startCase = require('lodash/startCase'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`),
  encrypt = require('../services/encrypt'),
  { encode } = require('../utils');

describe(_startCase(filename), function () {
  let mockData = {
      username: 'foo',
      password: 'bar',
      provider: 'local',
      auth: 'admin',
    },
    fakeDb, fakeBus;

  beforeEach(function () {
    fakeDb = {
      put: jest.fn()
    };

    fakeBus = {
      publish: jest.fn()
    };

    lib.setDb(fakeDb);
    lib.setBus(fakeBus);
  });

  describe('createUser', function () {
    const fn = lib[this.description];

    it('should throw if there is no data', function (done) {
      expect(fn({})).toThrow();
      done();
    });

    it('should encrypt password if provided', function () {
      fakeDb.put.mockResolvedValue(mockData);
      encrypt.hashPassword = jest.fn();

      fn(mockData);
      expect(encrypt.hashPassword).toHaveBeenCalled();
    });

    it.only('should create an user', function () {
      const expected = Object.assign(mockData, {
        _ref: `/_users/${encode(mockData.username.toLowerCase(), mockData.provider)}`
      });

      fakeDb.put.mockResolvedValue(expected);

      let result = fn(mockData);

      expect(result._ref).toBe(expected._ref);
    });
  });
});
