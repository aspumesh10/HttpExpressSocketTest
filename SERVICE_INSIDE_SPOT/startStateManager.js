const client = require('./client.js');
const command = require('./spotCommands.js');
const ws = require('ws');
const ipOfServer = (process.argv[4])?process.argv[4]:'10.28.108.93';
log(ipOfServer)
const webSocket = new ws('ws://'+ipOfServer+':3001');

client.init();

const sendLogin = function sendLogin(){
    var buffer = new Buffer(command.loginCommand);
    client.send(buffer); 
  }
  
  const sendLogout = function(){
    var buffer = new Buffer(command.logoutCommand);
    client.send(buffer);    
  }
  
  const sendShowScreenCommand = function(resId) {
    var buffer = new Buffer(command.showScreenCommand(resId));
    client.send(buffer);
  }
  
  const enableSoftkeys = function() {
    var buffer = new Buffer(command.enableSoftkeyCommand);
    client.send(buffer);   
  }

webSocket.on('message',function(data){
  console.log(data);
  log('received data at websocket &&&&&&&&&&&&&&&')
  var message = JSON.parse(data);
  if(message.result == 'success' && message.transaction_id == '879685'){

    sendShowScreenCommand(0x04);
    enableSoftkeys();
  }
  //sendShowScreenCommand(0x04);
   // enableSoftkeys();
});

client.socket.on('data', function(data){
  console.log('receive')
  console.log(data);

  if(data[2] === 0x84 && data[4] === 0x30 && data[5] === 0x01){
     if(data[7] === 0x10) {
         log('1st click');
        sendShowScreenCommand(0x03);
        var temp = {'amount':'100', 'transaction_id':'879685'};
        webSocket.send(JSON.stringify(temp));
     } else if(data[7] === 0x13){
        log('lastst click');
        sendShowScreenCommand(0x05);
     }
  }
});



sendLogin();
setTimeout(function(){
  sendShowScreenCommand(0x01);
},0);
setTimeout(function(){
    enableSoftkeys();
},0);


