const get = require('just-safe-get');

/**
 * Verifies if options passed to mailer where given by loopback's userInstance.verify() method.
 * Lookup is made on existence of `verificationToken` in `options`.
 *
 * @param {object} options
 * @param {string} options.verificationToken
 * @returns {boolean}
 */
module.exports.isUserVerifyEmail = function isUserVerifyEmail(options) {
  return !!options && !!options.verificationToken;
};

/**
 * Prepares options for Postmark based on options passed by loopback's userInstance.verify() method.
 * The second argument with settings is passed to template data. The data can be static or can point dynamic data and
 * the path from where it should be copied.
 *
 * @param {object} options
 * @param {object} settings
 * @param {object} settings.verifyUserEmail
 * @returns {object}
 */
module.exports.prepareUserVerifyOptions = function prepareUserVerifyOptions(
  options,
  settings
) {
  const newOptions = {};
  if (
    settings &&
    typeof settings.verifyUserEmail === 'object' &&
    settings.verifyUserEmail !== null
  ) {
    for (const property in settings.verifyUserEmail) {
      let value = settings.verifyUserEmail[property];

      if (typeof value === 'object' && value !== null && value.from) {
        newOptions[property] = get(options, value.from);
      } else {
        newOptions[property] = value;
      }
    }
  }

  return newOptions;
};
