'use strict';

const clayLog = require('clay-log'),
  pkg = require('../package.json');
let amphoraLogInstance;

/**
 * Initializes log instance
 */
function init() {
  if (amphoraLogInstance) {
    return;
  }

  // Initialize the logger
  clayLog.init({
    name: 'amphora',
    meta: {
      amphoraVersion: pkg.version
    }
  });

  // Store the log instance
  amphoraLogInstance = clayLog.getLogger();
}

/**
 * Sets up clayLog with options.
 * @param {Object} meta
 * @returns {Object}
 */
function setup(meta = {}) {
  return clayLog.meta(meta, amphoraLogInstance);
}

/**
 * Sets a logger instance
 * @param {Object} replacement
 */
function setLogger(replacement) {
  amphoraLogInstance = replacement;
}

// Initialize immediately on require of file
init();

module.exports.setup = setup;

// For testing
module.exports.init = init;
module.exports.setLogger = setLogger;
