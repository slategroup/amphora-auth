'use strict';

const _head = require('lodash/head'),
  bluebird = require('bluebird');

class Storage {
  constructor() {
    this.inMem            = require('levelup')('whatever', { db: require('memdown') });
    this.setup            = jest.fn().mockResolvedValue();
    this.get              = jest.fn();
    this.put              = jest.fn();
    this.list             = jest.fn((ops) => this.inMem.createReadStream(ops));
    this.clearMem         = this.clear;
    this.createReadStream = (ops) => this.inMem.createReadStream(ops);
    this.getLatestData    = jest.fn();
  }

  defer() {
    let resolve, reject,
      promise = new bluebird(function () {
        resolve = arguments[0];
        reject = arguments[1];
      });

    const def = {
      resolve: resolve,
      reject: reject,
      promise: promise
    };

    def.apply = function (err, result) {
      if (err) {
        def.reject(err);
      } else {
        def.resolve(result);
      }
    };

    return def;
  }

  /**
   * Save to inMemDb
   *
   * @param  {String} key
   * @param  {String} value
   * @return {Promise}
   */
  writeToInMem(key, value) {
    const deferred = this.defer();

    this.inMem.put(key, value, deferred.apply);
    return deferred.promise;
  }

  /**
   * Clear the Db
   * @return {Promise}
   */
  clear() {
    const errors = [],
      ops = [],
      deferred = this.defer();

    this.inMem.createReadStream({
      keys: true,
      fillCache: false,
      limit: -1
    })
      .on('data', data => ops.push({ type: 'del', key: data.key }))
      .on('error', error => errors.push(error))
      .on('end', () => {
        if (errors.length) {
          deferred.apply(_head(errors));
        } else {
          this.inMem.batch(ops, deferred.apply);
        }
      });

    return deferred.promise;
  }
}

module.exports = () => new Storage();
