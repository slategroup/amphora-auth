'use strict';

const bcrypt = require('bcrypt');

function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

module.exports.hashPassword = hashPassword;
module.exports.isValidPassword = isValidPassword;
