'use strict';

const passport = require('passport'),
  CognitoStrategy = require('passport-cognito-oauth2'),
  {
    verify,
    getAuthUrl,
    getPathOrBase,
    getCallbackUrl,
    generateStrategyName
  } = require('../utils');

/**
 * Cognito authentication strategy
 *
 * @param {object} site
 */
function createCognitoStrategy(site) {
  passport.use(
    `cognito-${site.subsiteSlug || site.slug}`,
    new CognitoStrategy({
      clientDomain: process.env.COGNITO_CONSUMER_DOMAIN,
      clientID: process.env.COGNITO_CONSUMER_KEY,
      clientSecret: process.env.COGNITO_CONSUMER_SECRET,
      callbackURL: getCallbackUrl(site, 'cognito'),
      passReqToCallback: true,
      region: process.env.COGNITO_CONSUMER_REGION
    },
    verify({
      username: 'email',
      imageUrl: 'picture',
      name: 'preferred_username',
      provider: 'cognito'
    }))
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

  router.get(`/_auth/${provider}/callback`, passport.authenticate(strategy, {
    failureRedirect: `${getAuthUrl(site)}/login`,
    failureFlash: true,
    successReturnToOrRedirect: getPathOrBase(site)
  })); // redirect to previous page or site root
}

module.exports = createCognitoStrategy;
module.exports.addAuthRoutes = addAuthRoutes;
