const express = require('express');
const bodyParser = require('body-parser');
const assert = require('assert');
const webSocket = require('ws');

var currentWebsocket = undefined;

var app = express();
var allTransaction = [];
app.use(bodyParser.json());//support json encoded bodies
app.use(bodyParser.urlencoded({extended:true}));//support encoded bodies


app.get('/',function(req, res){
    res.send('HelloALL');
    console.log(req);
})

app.post('/mobileTrans', function(req, res){
  var _self = this;
  _self.res = res;
  _self.transactionInfo = {}
  //_self.transactionInfo.terminalId = req.body.terminalId;
  _self.transactionInfo.amount = req.body.amount;
  _self.transactionInfo.transaction_id = req.body.transaction_id;
  console.log('mobile transaction received');
  var _bankDetails = req.body.bankDetails;
 // this.res.send('approved');
 // currentWebsocket.send('approved');
  allTransaction.forEach(validateTransaction.bind(_self));
})

const validateTransaction = function(element, index) {
    console.log(element);
    console.log(index);
    console.log(this.transactionInfo);
    var temp;
    if(this.transactionInfo.transaction_id === element.transaction_id
    && this.transactionInfo.amount === element.amount){
      this.res.send('approved');
      temp = {'result':'success', 'transaction_id':element.transaction_id}
      currentWebsocket.send(JSON.stringify(temp))
    } else {
      this.res.send('not approved');
      temp = {'result':'fail', 'transaction_id':element.transaction_id}
      currentWebsocket.send(JSON.stringify(temp))
    }
};

var server = app.listen(3000, function(){
    console.log('listening on port 3000');
});

var webSocketServer = new webSocket.Server({port : 3001});
webSocketServer.on('connection', function(ws){
  
  currentWebsocket = ws;
  ws.on('message',function(data){
    console.log('received on websocket')
    console.log(typeof data);
    console.log(data);
    console.log('******2nd received')
    console.log(JSON.parse(data));
    allTransaction.push(JSON.parse(data));
    ws.send(JSON.stringify({'result':'success'}));
  });
});