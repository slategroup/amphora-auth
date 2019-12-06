'use strict';

const passport = require('passport'),
  SamlStrategy = require('passport-saml').Strategy,
  { verify, getAuthUrl, getPathOrBase, getCallbackUrl, generateStrategyName } = require('../utils');

/**
 * SAML authentication strategy
 *
 * @param {object} site
 */
function createOktaStrategy(site) {
  passport.use(
    `okta-${site.subsiteSlug || site.slug}`,
    new SamlStrategy(
      {
        callbackURL: getCallbackUrl(site, 'okta'),
        entrypoint: '',
        cert: '',
        issuer: 'clay' // string to supply to IDP
      },
      verify({
        username: 'emails[0].value',
        imageUrl: 'photos[0].value',
        name: 'displayName',
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
