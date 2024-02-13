'use strict';

function send(customerEmail, firstName, lastName) {
    var HashMap = require('dw/util/HashMap');
    var Mail = require('dw/net/Mail');
    var Resource = require('dw/web/Resource');
    var Site = require('dw/system/Site');
    var Template = require('dw/util/Template');
   

    var context = new HashMap();
    var email = new Mail();
    var template = new Template('/newsletter/confirmationEmail');

    email.addTo(customerEmail);
    email.setFrom(Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@salesforce.com');
    email.setSubject(Resource.msgf('subject.newsletter.confirmation.email', 'forms', null, firstName,lastName));
    //email.setContent(template.render(context).text, 'text/html', 'UTF-8');
    context.firstName=firstName;
    context.lastName=lastName;
    email.setContent(template.render(context).text, 'text/html', 'UTF-8');
    email.send();
}

module.exports = {
    send: send
};