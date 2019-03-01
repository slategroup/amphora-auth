'use strict';

const _startCase = require('lodash/startCase'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require(`./${filename}`);

describe(_startCase(filename), function () {
  let mockRes;

  beforeEach(function () {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('unauthorized', function () {
    const fn = lib[this.description];

    it('should set status code as 401', function () {
      fn(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should send a json error message', function () {
      fn(mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ code: 401, message: 'Unauthorized request' });
    });
  });

  describe('checkAuthLevel', function () {
    const fn = lib[this.description];

    it('should throw an error if userLevel is not set', function () {
      const cb = () => fn();

      expect(cb).toThrow();
    });

    it('should return true if userLevel is admin', function () {
      expect(fn('admin')).toBeTruthy();
    });

    it('should return true if userLevel and requiredLevel match', function () {
      expect(fn('write', 'write')).toBeTruthy();
    });

    it('should return false if userLevel and requiredLevel do not match', function () {
      expect(fn('write', 'admin')).toBeFalsy();
    });
  });

  describe('withAuthLevel', function () {
    const fn = lib[this.description],
      reqObj = {
        user: {
          auth: 'write'
        }
      };

    lib.unauthorized = jest.fn();

    it('throws an error if userLevel is undefined', function () {
      const next = jest.fn(),
        cb = () => fn('admin')({}, {}, next);

      expect(cb).toThrow();
    });

    it('sends unauthorized response if user does not have proper permissions', function () {
      const next = jest.fn();

      fn('admin')(reqObj, mockRes, next);
      expect(next).not.toBeCalled();
      expect(mockRes.status).toBeCalledWith(401);
      expect(mockRes.json).toBeCalled();
    });

    it('calls next if the user has the appropriate level', function () {
      const next = jest.fn();

      fn('write')(reqObj, mockRes, next);
      expect(next).toBeCalled();
      expect(lib.unauthorized).not.toBeCalled();
    });
  });
});
