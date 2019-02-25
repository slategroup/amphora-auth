'use strict';

const { encode } = require('../utils');
let db = require('../services/storage'),
  encrypt = require('../services/encrypt'),
  bus;

/**
 * @param {object} data
 * @returns {Promise}
 */
function createUser(data = {}) {
  let { username, password, provider, auth } = data,
    uri = '/_users/';

  // Validate payload
  if (!username || !provider || !auth) {
    throw new Error('Users require username, provider and auth to be specified!');
  }

  if (password) {
    data.password = encrypt.hashPassword(password);
  }

  // Add the encoded username and provider to the end of the uri
  uri += encode(username.toLowerCase(), provider);

  // Save to the DB
  return db.put(uri, JSON.stringify(data)).then(() => {
    data._ref = uri;

    bus.publish('saveUser', { key: uri, value: data });
    return data;
  });
}

// outsiders can act on users
module.exports.createUser = createUser;

// For testing
module.exports.setDb = mock => db = mock;
module.exports.setBus = mock => bus = mock;
