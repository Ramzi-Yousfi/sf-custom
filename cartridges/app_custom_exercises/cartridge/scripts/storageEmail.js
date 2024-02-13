'use strict';

var CustomObjMgr = require('dw/object/CustomObjectMgr')

function EmailCustomOdj(emailForm){
    CustomObjMgr.createCustomObject('existEmail',emailForm.email.value)
    return CustomObjMgr
}

module.exports = {EmailCustomOdj:EmailCustomOdj}
