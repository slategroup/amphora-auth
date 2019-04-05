'use strict';

const _startCase = require('lodash/startCase'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`);

describe(_startCase(filename), function () {
  let fakeDb;

  beforeEach(function () {
    fakeDb = {
      get: jest.fn(),
      put: jest.fn()
    };

    lib.setDb(fakeDb);
  });

  describe('get', function () {
    const fn = lib[this.description];

    it('should return a value by id', function () {
      fakeDb.get.mockResolvedValue({ id: 'foo', username: 'Pizza', provider: 'google' });

      return fn('foo').then(data => {
        expect(fakeDb.get).toHaveBeenCalledWith('foo');
        expect(data.username).toBe('Pizza');
      });
    });
  });

  describe('put', function () {
    const fn = lib[this.description];

    it('should update an item in the db', function () {
      const data = {
        username: 'Pizza',
        provider: 'local',
      };

      fakeDb.put.mockResolvedValue(data);

      return fn('foo', data).then(result => {
        expect(fakeDb.put).toHaveBeenCalledWith('foo', data);
        expect(result.provider).toBe('local');
      });
    });
  });
});
