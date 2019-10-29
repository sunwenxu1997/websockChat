var chatList = []
var userNum = 0;
var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({ port: 8181 });
wss.broadcast = function (msg) {
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};
wss.on('connection', function (ws) {
    userNum++
    wss.broadcast(JSON.stringify({ funName: 'userCount', users: userNum }))
    console.log('Connected clients:', userNum);
    //接收前端发送过来的数据
    ws.on('message', function (msg) {
        if (msg) {
            console.log('接收到来自clent的消息：' + msg)
            wss.broadcast(msg)
            // ws.send(msg);
        }
    });
    ws.on('close', function (e) {
        userNum--;
        wss.broadcast(JSON.stringify({ funName: 'userCount', users: userNum }))
        console.log('Connected clients:', userNum);
        console.log('长连接已关闭')
    })
})
console.log('服务器创建成功')