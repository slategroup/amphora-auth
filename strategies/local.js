'use strict';

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  {
    verify,
    getAuthUrl,
    getPathOrBase,
    generateStrategyName,
  } = require('../utils');

/**
 * Local authentication strategy
 *
 * @param {object} site
 */
function createLocalStrategy(site) {
  console.log('CREATING LOCAL STRATEGY');

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
  console.log('VERIFY LOCAL');

  return function (req, username, password, done) {
    console.log('CALLING UTILS VERIFY');

    verify({
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
  const strategy = generateStrategyName(provider, site);

  console.log({ strategy });

  router.get(`/_auth/${provider}`, passport.authenticate(strategy, {
    failureRedirect: `${getAuthUrl(site)}/login`,
    failureFlash: true,
    successReturnToOrRedirect: getPathOrBase(site)
  }));
}

module.exports = createLocalStrategy;
module.exports.addAuthRoutes = addAuthRoutes;
