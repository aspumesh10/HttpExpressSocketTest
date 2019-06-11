var net = require('net');

const ipToConnect = (process.argv[2])?process.argv[2]:'127.0.0.1';
const port = (process.argv[3])?process.argv[3]:'5200';

log(ipToConnect+':'+port);

function Client(){
  var _self = this;
  _self.reconnectTimer;
  _self.init = function(){
    _self.socket = null;
    _self.socket = new net.Socket();
    _self.connect();
  }

  _self.connect = function(){
    _self.socket.connect(port, ipToConnect, function() {
      log('Connected');
      if(_self.reconnectTimer) {
        clearInterval(_self.reconnectTimer);
        _self.reconnectTimer = 0;
      }
     // _self.socket.write('Hello, server! Love, Client.');
    });

/*
    _self.socket.on('data', function(data) {
      log('Received: ' + data);
    });
*/  
    _self.socket.on('close', function() {
      log('Connection closed');
    });

    _self.socket.on('error', function() {
      log('Connection got error');
      _self.socket.destroy();
      _self.reconnectTimer = setInterval(function(){
        log('trying to connect');
        _self.init();
        },10000)
    });
  }

  _self.send = function(data){
    console.log('Send');
    console.log(data);
    _self.socket.write(data);
  } 

}

module.exports  = new Client();
