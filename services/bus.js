'use strict';

let bus; // Redis bus passed from Amphora. Assigned value at initialization

/**
 * Retrieves an item from the database.
 * @param {string} eventName
 * @param {Object} data
 */
function publish(eventName, data) {
  bus.publish(eventName, data);
}

module.exports.publish = publish;
module.exports.setBus = redisBus => bus = redisBus;
