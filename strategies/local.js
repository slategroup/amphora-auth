'use strict';

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  utils = require('../utils');

/**
 * Local authentication strategy
 * @param {object} site
 */
function createLocalStrategy(site) {
  passport.use(
    `local-${site.slug}`,
    new LocalStrategy({ passReqToCallback: true }, verifyLocal())
  );
}

/**
 * Wraps verify function for local auth.
 * @returns {function}
 */
function verifyLocal() {
  return function (req, username, password, done) {
    utils.verify({
      username: 'username',
      password: 'password',
      provider: 'local'
    })(req, null, null, { username, password }, done);
  };
}

/**
 * Adds authorization routes to the router
 * @param {express.Router} router
 * @param {object} site
 * @param {object} provider
 */
function addAuthRoutes(router, site, provider) {
  const strategy = utils.generateStrategyName(provider, site);

  router.post(`/_auth/${provider}`, passport.authenticate(strategy, {
    failureRedirect: `${utils.getAuthUrl(site)}/login`,
    failureFlash: true,
    successReturnToOrRedirect: utils.getPathOrBase(site)
  }));
}

module.exports = createLocalStrategy;
module.exports.addAuthRoutes = addAuthRoutes;

// For testing purposes
module.exports.verifyLocal = verifyLocal;
