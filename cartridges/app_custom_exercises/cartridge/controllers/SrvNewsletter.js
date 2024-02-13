'use strict';

var server = require('server');
var newsletterForm = server.forms.getForm('srvnewsletter');
var Logger = require('dw/system/Logger');
var Resource = require('dw/web/Resource');
var storageService = require('*/cartridge/scripts/storageService');
var HookMgr = require('dw/system/HookMgr');


server.get('Start', function(req, res, next) {
    newsletterForm.clear();
    // 7-2 render the newsletter signup form, passing in the form
    res.render('newsletter/srvnewslettersignup', { newsletterForm: newsletterForm });
    next();
});

/**
 * Sample email server side validation
 * @param: email String
 */
function validateEmail(email) {
    var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
    return regex.test(email);
}

server.post('HandleForm', function(req, res, next) {
    var Transaction = require('dw/system/Transaction');
    if (validateEmail(newsletterForm.email.value)) {
        var customLogger = Logger.getLogger('NewsLogs', 'newsletter');
        Transaction.begin();
        try {
            var co = storageService.storeNewsletterObject(newsletterForm);
            res.render('newsletter/srvnewslettersuccess.isml', {
                firstName: newsletterForm.fname.value,
                lastName: newsletterForm.lname.value,
                newsletterObject: co
            });
            HookMgr.callHook('app.email', 'send', newsletterForm.email.value,newsletterForm.fname.value , newsletterForm.lname.value);
            Transaction.commit();
            customLogger.debug('Signup was successful');
        } catch (e) {
            Transaction.rollback();
            customLogger.error('Error in newsletter signup: ' + e.message);
            res.setViewData({ emailerror: e.message });
            res.render('newsletter/srvnewslettersignup', {
                newsletterForm: newsletterForm
            });
        }
    } else {
        res.setViewData({ emailerror: Resource.msg('error.message.parse.email.profile.form', 'forms', null) });
        res.render('newsletter/srvnewslettersignup', {
            newsletterForm: newsletterForm
        });
    }
    next();
});

module.exports = server.exports();
