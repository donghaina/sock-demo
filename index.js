// 创建Socket 连接
var sock = new SockJS('http://localhost:9999/echo');

// 打开连接
sock.onopen = function() {
  console.log('open');
};

// 关闭连接
sock.onclose = function() {
  console.log('close');
};

// 监听从服务端接受消息
sock.onmessage = function(e) {
  // 获取消息内容
  var content = JSON.parse(e.data);

  // 将消息写到HTML页面
  $('#chat-content').val(function(i, text){
    return text + 'User ' + content.username + ': ' + content.message + '\n';
  });

};

// 给服务器发消息
function sendMessage(){
  // 获取消息
  var message = $('#message').val();
  var username = $('#username').val();

  // 将消息包装成JSON
  var send = {
    message: message,
    username: username
  };

  // 将JSON消息包装成字符串发送
  sock.send(JSON.stringify(send));
}
