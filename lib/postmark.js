const util = require('util');
const { Connector } = require('loopback-connector');
const postmark = require('postmark');

const Mailer = require('./mailer');

/**
 * Connector constructor
 *
 * @param {object} settings
 * @param {string} settings.serverToken
 * @param {object} settings.configOptions
 * @param {object} dataSource
 * @constructor
 */
class PostmarkConnector {
  constructor(settings) {
    Connector.call(this, 'postmark', settings);

    if (process.env.NODE_ENV !== 'test' && settings.serverToken) {
      this.postmark = new postmark.ServerClient(
        settings.serverToken,
        settings.configOptions
      );
    }
    this.settings = settings;
  }
}

/**
 * Initialize connector with datasource and configure settings
 *
 * @param {object} dataSource
 * @param {function} callback - done callback
 */
module.exports.initialize = function initializeDataSource(
  dataSource,
  callback
) {
  const settings = dataSource.settings || {};
  dataSource.connector = new PostmarkConnector(settings, dataSource);
  callback();
};

/**
 * Inherit the prototype methods
 */
util.inherits(PostmarkConnector, Connector);

Connector.prototype.DataAccessObject = Mailer;
