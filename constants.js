'use strict';

/**
 * Converts an environment variable to a boolean config value.
 * @param {string} str
 * @param {boolean} defaultValue
 * @returns {boolean}
 */
function strToBool(str, defaultValue = false) {
  str = (str || '').toLowerCase();

  switch (str) {
    case 't':
      return true;
    case 'true':
      return true;
    case '1':
      return true;
    case 'f':
      return false;
    case 'false':
      return false;
    case '0':
      return false;
    default:
      return defaultValue;
  }
}

module.exports.SECRET = process.env.CLAY_SESSION_SECRET || 'clay';
module.exports.AUTH_LEVELS = {
  ADMIN: 'admin',
  WRITE: 'write',
};
module.exports.CLAY_DISABLE_GLOBAL_ACCESS_KEY = strToBool(process.env.CLAY_DISABLE_GLOBAL_ACCESS_KEY);

module.exports.strToBool = strToBool;
