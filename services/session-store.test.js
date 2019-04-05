'use strict';

process.env.REDIS_DB = 'cool-db-name';

const _startCase = require('lodash/startCase'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`);

describe(_startCase(filename), function () {
  describe('createSessionStore', function () {
    let fakeSession;

    beforeEach(function () {
      fakeSession = jest.fn();

      lib.setSession(fakeSession);
    });

    it('should create a session with redisStore', function () {
      lib();

      expect(fakeSession).toBeCalled();
    });
  });
});
