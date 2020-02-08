# loopback-connector-postmark

[![npm version](https://badge.fury.io/js/loopback-connector-postmark.svg)](http://badge.fury.io/js/loopback-connector-postmark)
[![Loopback](https://img.shields.io/badge/Loopback-3.x-brightgreen)](https://loopback.io/lb3)
[![Postmark](https://img.shields.io/badge/Postmark-2.x-blue)](https://github.com/wildbit/postmark.js)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![dependencies](https://img.shields.io/david/tniezurawski/loopback-connector-postmark.svg)](https://david-dm.org/tniezurawski/loopback-connector-postmark)
[![devDependencies](https://img.shields.io/david/dev/tniezurawski/loopback-connector-postmark.svg)](https://david-dm.org/tniezurawski/loopback-connector-postmark)

Strongloop Loopback connector for [Postmark](https://postmarkapp.com/) (email sender). Unofficial.

It uses [wildbit/postmark.js](https://github.com/wildbit/postmark.js) under the hood. [API can be found here](https://postmarkapp.com/developer/integration/official-libraries#node-js).

## Installation

```
npm install loopback-connector-postmark --save
```

## Configuration

#### Add to `datasources.json`:

Configure a data source with a connector. All additional settings will go here.

```json
"postmark": {
  "name": "postmark",
  "connector": "loopback-connector-postmark",
  "serverToken": "xxxx-xxxxx-xxxx-xxxxx-xxxxxx",
}
```

:point_up: Postmark lets you send emails only if you have a server token.

**Please note:** You can use the `datasources.js` version for configuration as well. Which sounds like quite a good idea for storing secrets:

```javascript
'use strict';

module.exports = {
  postmark: {
    name: "postmark",
    connector: "loopback-connector-postmark",
    serverToken: process.env.POSTMARK_SERVER_TOKEN
  }
};
```

#### Add to `model-config.json`:

Bind loopback's [built in Email](https://loopback.io/doc/en/lb3/Email-connector.html) model with the previously added data source.

```json
"Email": {
  "dataSource": "postmark",
  "public": false
},
```

## Usage

After a successful configuration, we have our postmark data source/connector bound with the Email model. So we use it as usual:

```javascript
const loopback = require('loopback');

loopback.Email.send({
  // Required fields
  To: "to@to.com",
  From: "from@from.com",
  Subject: "subject",
  
  // Optional fields
  HtmlBody: "html is <strong>strong</strong>",
  TextBody: "text is cool as well",
  Cc: "cc@cc.com",
  Bcc: "bcc@bcc.com",
  ReplyTo: "reply-to@reply.com",
  Tag: "tag",
  TrackOpens: true,
  TrackLinks: true,
  Headers: { 
    ohMy: "header" 
  }
});
```

For fields not stated above, check Postmark's documentation. The whole object argument is just passed to the postmark client.

## Usage with emails send by Loopback

Some of the emails are sent by Loopback itself. Unfortunately, it's not easy to override these methods and change the way they pass arguments to the `Email.send()` method.

This package tries to work around that.

#### User verify email

If you followed [Loopback's documentation about verifying users email address](https://loopback.io/doc/en/lb3/Registering-users.html#verifying-email-addresses) you probably ended up with `userInstance.verify(verifyOptions)` method and `verifyOptions` something as follows:

```javascript
let verifyOptions = {
  type: 'email',
  to: userInstance.email,
  from: 'noreply@loopback.com',
  subject: 'Thanks for registering.',
  template: path.resolve(__dirname, '../../server/views/verify.ejs'),
  redirect: '/verified',
  user: userInstance
};
```

This package lets you configure that by adding `verifyUserEmail` object to `postmark` configuration object stored in `datasources.json`.

```json
"postmark": {
  "name": "postmark",
  "connector": "loopback-connector-postmark",
  "serverToken": "xxxx-xxxxx-xxxx-xxxxx-xxxxxx",
  "verifyUserEmail": {
    "TemplateId": "[TEMPLATE_ID]",
    "name": {
      "from": "user.username"
    },
    "product_name": "My awesome product",
    "action_url": {
      "from": "verifyHref"
    },
    "login_url": "https://myawesomeproduct.com/app/login",
    "email": {
      "from": "user.email"
    },
    "support_email": "contact@myawesomeproduct.com",
    "sender_name": "John Doe",
    "company_name": "Awesome Product LTD"
  }
}
```

Provide `TemplateId` you use for the confirmation email in Postmark and the variables that you specified there. If you would like to dynamically copy values from `verifyOptions`, for example from `user: userInstance` object, then use an object with `from` property to point the path to the value you'd like to copy.

For example, if you have `name` variable in your template and you passed `user: userInstance` in your verification method then most probably the path to user's name is `user.username`:

```json
"name": {
  "from": "user.username"
}
```
