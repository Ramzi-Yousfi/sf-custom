'use strict';

var server = require('server');
var emailForm = server.forms.getForm('emailForm');

server.get('Exist', function(req, res, next) {
    emailForm.clear();
    var emailerror = req.httpHeaders.get('emailerror');
    res.print(emailerror);
    res.render('emailExist', { emailForm: emailForm, emailerror: emailerror });
    next();
});

var Transaction = require('dw/system/Transaction');
var emailService = require('*/cartridge/scripts/storageEmail');
var Resource = require('dw/web/Resource');



// eslint-disable-next-line require-jsdoc
function emailVerify(email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(email);
}

server.post('HandleForm', function(req, res, next) {
    var email = emailForm.email.value;
    if (email !== null && email !== '' && emailVerify(email)) {
        Transaction.begin();
        try {
            emailService.EmailCustomOdj(emailForm);
            Transaction.commit();
            res.render('emailExist', { emailForm: emailForm, hello: emailForm.email.value });
        } catch (e) {
            Transaction.rollback();
            res.render('emailExist', { emailForm: emailForm, emailerror: e.message });
        }
    } else {
        res.setStatusCode(400);
        res.print(Resource.msg('email.invalid', 'email', null));
        res.render('emailExist', { emailForm: emailForm, emailerror: Resource.msg('email.invalid', 'email', null) });
    }
    next();
});

module.exports = server.exports();
