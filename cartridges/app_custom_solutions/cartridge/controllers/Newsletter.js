'use strict';

var server = require('server');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

server.get('Show', server.middleware.https, csrfProtection.generateToken, function (req, res, next) {
//7-9 create a variable actionUrl pointing to Controller-Route for Handler route
var actionUrl = dw.web.URLUtils.url('Newsletter-Handler');

var newsletterForm = server.forms.getForm('newsletter'); 
    newsletterForm.clear(); 

    res.render('newsletterC/newslettersignup.isml', {
        actionUrl: actionUrl,
//7-9 pass in newsletterForm to the ISML, with param of same name
        newsletterForm: newsletterForm


    });

    next();
}
);

server.post('Handler', csrfProtection.validateAjaxRequest, server.middleware.https, function (req, res, next) {

    var newsletterForm = server.forms.getForm('newsletter');
    var URLUtils = require('dw/web/URLUtils');

    if (newsletterForm.valid) {
        var Transaction = require('dw/system/Transaction');
        try {
            Transaction.wrap(function () {
                var storageService = require('~/cartridge/scripts/clientForm/storageServiceC');
                storageService.storeNewsletterObject(newsletterForm);

                res.json({
                    happy: true,
                    redirectUrl: URLUtils.url('Newsletter-Success').toString()
                });
            }

            );
        } catch (e) {
            var err = e;
            var Resource = require('dw/web/Resource');
            if (err.javaName === "MetaDataException") {
                // Error is duplicate primary key: send back array with error message
                res.json({
                    happy: false,
                    errorMsg: [Resource.msg('error.subscriptionexists', 'messageBundle', null)]  //to be displayed by messageDisplayer
                });
            } else {
                // Error is missing custom object: Log error with clear message for site admin to see

                // Show error page: there is nothing user can do to fix this
                // res.setStatusCode(500);
                res.json({
                    happy: false,
                    errorMsg: ['your custom object def is missing'],  ////to be displayed by messageDisplayer
                    redirectUrl: URLUtils.url('Newsletter-Error').toString()
                });

            }

        }

    } else {//form is not valid
        //  res.setStatusCode(500);
        res.json({
            happy: false,
            errorMsg: ['Please fill all fields properly , check your email is valid'],   //ideally we should be using resource bundle  //to be displayed by messageDisplayer
//7-9 create a variable redirectUrl: for Error route and use .toString() for json context
            redirectUrl: URLUtils.url('Newsletter-Error').toString()

        });
    }

    next();
}
);

server.get('Success', server.middleware.https, function (req, res, next) {
    var continueUrl = dw.web.URLUtils.url('Newsletter-Show');
    var newsletterForm = server.forms.getForm('newsletter');

    res.render('newsletterC/newslettersuccess', {
        continueUrl: continueUrl,
        newsletterForm: newsletterForm
    });
    next();
}
);


server.get('Error', server.middleware.https, function (req, res, next) {
    var continueUrl = dw.web.URLUtils.url('Newsletter-Show');
    var newsletterForm = server.forms.getForm('newsletter');

    res.render('newsletterC/newslettererror', {
        continueUrl: continueUrl,
        newsletterForm: newsletterForm
    });

    next();
}
);

module.exports = server.exports();