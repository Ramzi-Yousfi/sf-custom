'use strict';

var server = require('server');


server.get('Show', function (req, res, next) {

    //define a variable named PageMgr that requires the dw.experience.PageMgr API
    var PageMgr = 
    //get the page with the specific, hard-coded id
    var page = 

   
    //Hint: Use hasVisibilityRules() and isVisible() checks.
  
 
    if (...) {  //  check if visibility rules are present
        if (...) {   //  check if the page is visible also
            // There are multiple versions of this page, so no caching.
            //Use res.page to render the page
        }
        else {
            //page is not visible....
            res.print('you cannot access this page');
        }
    }
    else {  
        // We could cache this page because it is not targeted.
        res.cachePeriod = 168;
        res.cachePeriodUnit = 'hours';
        res.page(page.ID, {});
    }
    next();
});


module.exports = server.exports();
