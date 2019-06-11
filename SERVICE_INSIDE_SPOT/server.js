var net = require('net');

var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
    socket.pipe(socket);
    
    socket.on('data', function(data){
      console.log('comingf ffrom client'+data);
    });
});


server.listen(5204, '127.0.0.1');