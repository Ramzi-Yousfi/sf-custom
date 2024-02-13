'use strict';

//require the server module
var server = require('server');
//define the route using the server.get method and Start function
server.get('Start',function (req,res,next){

	//print Hello World using h1 tags directly to the response 
    res.print('<html><body><h1>Hello World</h1></body></html>')
	//execute the next function to notify the server that you're done with a step
        next()
});

//call server.exports() to register all functions
module.exports = server.exports()