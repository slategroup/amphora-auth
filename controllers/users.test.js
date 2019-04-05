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

    it('should throw if there is no data', function () {
      const cb = () => fn({});

      expect(cb).toThrow();
    });

    it('should encrypt password if provided', function () {
      fakeDb.put.mockResolvedValue(mockData);
      encrypt.hashPassword = jest.fn();

      return fn(mockData)
        .then(() => expect(encrypt.hashPassword).toHaveBeenCalled());
    });

    it('should create an user', function () {
      const expected = Object.assign(mockData, {
        _ref: `/_users/${encode(mockData.username.toLowerCase(), mockData.provider)}`
      });

      fakeDb.put.mockResolvedValue(expected);

      return fn(mockData)
        .then(result => {
          expect(fakeDb.put).toHaveBeenCalled();
          expect(result._ref).toBe(expected._ref);
          expect(fakeBus.publish).toHaveBeenCalled();
        });
    });
  });
});
