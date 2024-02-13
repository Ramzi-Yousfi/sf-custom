'use strict';

var base = module.superModule;

function store(storeObject) {
    //use base.call to assign the standard values to the object
    base.call(this, storeObject);
    //then set the email attribute to the store email
    this.email = storeObject.email;
}

module.exports = store;
