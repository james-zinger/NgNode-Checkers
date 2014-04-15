var app = require('express')();
var server = require('http').createServer(app); 
var	io  = require('socket.io').listen(server); 
var	fs  = require('fs');
var path = require('path');

var lobby = require('./Lobby/lobby.js');
var game  = require('./Game/game.js');

server.listen( 3000 );

app.get('/', function (req, res)
{
	res.sendfile(path.resolve(__dirname + '/../Client/app/index.html'));
	//res.sendfile('index.html');
});

app.get(/^(.+)$/, function (req, res) 
{ 
	res.sendfile(path.resolve(__dirname + '/../Client/app/' + req.path));
});

function handler (req, res)
{
	fs.readFile(__dirname + '/../Client/app/' + req.url,
		function (err, data)
		{
			if (err)
			{
				res.writeHead( 500 );
				return res.end('Error loading requested file');
			}

			res.writeHead( 200 );
			res.end(data);
		}
	);
}

io.sockets.on('connection', function(socket)
{
	lobby.AddClient(socket);
});

lobby.init(io);