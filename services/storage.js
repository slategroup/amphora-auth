'use strict';

let db; // Storage module passed from Amphora. Assigned value at initialization

/**
 * Retrieves an item from the database.
 * @param {string} id
 * @returns {Promise<Object>}
 */
function get(id) {
  return db.get(id);
}

/**
 * Updates an item in the database.
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
function put(id, data) {
  return db.put(id, JSON.stringify(data));
}

module.exports.get = get;
module.exports.put = put;
module.exports.setDb = storage => db = storage;
