var http = require('http'); // 这是 node 内置模块不需要install
var sockjs = require('sockjs'); // 这个模块需要安装 npm install sockjs --save

// 所有客户端的集合
var clients = {};

// 通知所有客户端
function broadcast(message){
  // 迭代所有连接的客户端
  for (var client in clients){
    // 给每一个客户端发消息
    clients[client].write(JSON.stringify(message));
  }
}

// 创建 sockjs 服务器
var echo = sockjs.createServer();

// 监听连接
echo.on('connection', function(conn) {

  // 将此客户端添加到客户端集合中
  clients[conn.id] = conn;

  // 从客户端收到消息的时候广播通知给每一个客户端
  conn.on('data', function(message) {
    console.log(message);
    broadcast(JSON.parse(message));
  });

  // 监听关闭连接
  conn.on('close', function() {
    delete clients[conn.id];
  });

});

// 创建一个HTTP服务器
var server = http.createServer();

// 集成 SockJS 并监听 /echo 这个URL
echo.installHandlers(server, {prefix:'/echo'});

// 启动服务器
server.listen(9999, '0.0.0.0');
