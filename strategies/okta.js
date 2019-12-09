'use strict';

const passport = require('passport'),
  SamlStrategy = require('passport-saml').Strategy,
  {
    verifySaml,
    getAuthUrl,
    getPathOrBase,
    getCallbackUrl,
    generateStrategyName
  } = require('../utils');

/**
 * SAML authentication strategy
 *
 * @param {object} site
 */
function createOktaStrategy(site) {
  passport.use(
    generateStrategyName('okta', site),
    new SamlStrategy(
      {
        callbackURL: getCallbackUrl(site, 'okta'),
        entryPoint: '',
        cert: '',
        issuer: 'clay',
        passReqToCallback: true
      },
      verifySaml({
        username: 'nameID',
        provider: 'okta'
      })
    )
  );
}

/**
 * add authorization routes to the router
 * @param {express.Router} router
 * @param {object} site
 * @param {string} provider
 */
function addAuthRoutes(router, site, provider) {
  const strategy = generateStrategyName(provider, site);

  router.get(`/_auth/${provider}`, passport.authenticate(strategy));

  router.post(
    `/_auth/${provider}/callback`,
    passport.authenticate(strategy, {
      failureRedirect: `${getAuthUrl(site)}/login`,
      failureFlash: true,
      successReturnToOrRedirect: getPathOrBase(site)
    })
  ); // redirect to previous page or site root
}

module.exports = createOktaStrategy;
module.exports.addAuthRoutes = addAuthRoutes;
