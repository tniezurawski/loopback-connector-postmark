const assert = require('assert');
const {
  isUserVerifyEmail,
  prepareUserVerifyOptions
} = require('./user-verify-email');

const loopbackPostmarkMap = new Map([
  ['from', 'From'],
  ['to', 'To'],
  ['subject', 'Subject']
]);

const allowedOptions = [
  'HtmlBody',
  'TextBody',
  'Cc',
  'Bcc',
  'ReplyTo',
  'Tag',
  'TrackOpens',
  'TrackLinks',
  'Headers',
  'Attachments',
  'Metadata'
];

class Mailer {}

Mailer.send = function(options, callback) {
  const connector = this.dataSource.connector;

  assert(connector, 'Cannot send mail without a connector!');

  let optionsForPostmark = this._prepareOptions(options);
  let sendWithTemplate = false;

  if (isUserVerifyEmail(options)) {
    let templateOptions = prepareUserVerifyOptions(options, connector.settings);

    optionsForPostmark = {
      ...optionsForPostmark,
      TemplateId: templateOptions.TemplateId,
      TemplateModel: {
        ...templateOptions
      }
    };

    sendWithTemplate = true;
  }

  if (optionsForPostmark.From && optionsForPostmark.Subject) {
    if (sendWithTemplate) {
      // Neither 'TextBody', 'HtmlBody', or 'Subject' may be specified when using a template for the email.
      delete optionsForPostmark['TextBody'];
      delete optionsForPostmark['HtmlBody'];
      delete optionsForPostmark['Subject'];

      connector.postmark.sendEmailWithTemplate(optionsForPostmark).then(done);
    } else {
      connector.postmark.sendEmail(optionsForPostmark).then(done);
    }
  }

  function done(response) {
    if (typeof callback === 'function') {
      callback(response);
    }
  }
};

Mailer.prototype.send = function(fn) {
  return this.constructor.send(this, fn);
};

Mailer._prepareOptions = function(options) {
  const newOptions = {};
  let to;

  for (const property in options) {
    if (loopbackPostmarkMap.has(property)) {
      to = loopbackPostmarkMap.get(property);

      newOptions[to] = options[property];
    } else if (allowedOptions.includes(property)) {
      newOptions[property] = options[property];
    }
  }

  return newOptions;
};

module.exports = Mailer;
