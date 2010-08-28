//setup Dependencies
require(__dirname + "/lib/setup").ext( __dirname + "/lib").ext( __dirname + "/lib/express/support");


var http = require('http'), 
		url = require('url'),
		fs = require('fs'),
		io = require('Socket.IO-node'),
		sys = require('sys'),
                connect = require('connect'),
                express = require('express'),
                port = 8080

		
//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.use(connect.bodyDecoder());
    server.use(connect.staticProvider(__dirname + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.ejs', { locals: { 
                  header: '#Header#'
                 ,footer: '#Footer#'
                 ,title : '404 - Not Found'
                } });
    } else {
        res.render('500.ejs', { locals: { 
                  header: '#Header#'
                 ,footer: '#Footer#'
                 ,title : 'The Server Encountered an Error'
                 ,error: err 
                } });
    }
});
server.listen( port);


// socket.io, I choose you
// simplest chat application evar
var buffer = [], 
		json = JSON.stringify,
		io = io.listen(server);
		
io.on('connection', function(client){
	client.send(json({ buffer: buffer }));
	client.broadcast(json({ announcement: client.sessionId + ' connected' }));

	client.on('message', function(message){
		var msg = { message: [client.sessionId, message] };
		buffer.push(msg);
		if (buffer.length > 15) buffer.shift();
		client.broadcast(json(msg));
	});

	client.on('disconnect', function(){
		client.broadcast(json({ announcement: client.sessionId + ' disconnected' }));
	});
});

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////


server.get('/', function(req,res){
  res.render('index.ejs', {
    locals : { 
              header: '#Header#'
             ,footer: '#Footer#'
             ,title : 'Page Title'
            }
  });
});


server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
