function connect(user,url,func){
  console.log(url);
	wx.connectSocket({
		url:url,
		header:{'content-type':'application/json'},
		success:function(res){
      console.log(res);
			console.log('信道连接成功');
		},
		fail:function(){
			console.log('信道连接失败');
		}
	});
	wx.onSocketOpen(function(res){
		wx.showToast({
			title:'信道开启成功',
			icon:'none',
			duration:2000
		})
		//接收服务器消息(fun回调函数可以拿回服务器返回的数据)
		wx.onSocketMessage(func);
	});
	wx.onSocketError(function(res){
		wx.showToast({
			title:'信道开启失败',
			icon:'none',
			duration:2000
		})
	});
}

//发送消息
function send(msg){
	wx.sendSocketMessage({
		data:msg,
    success:function(e){
      console.log(e);
    },
    fail:function(e){
      console.log(e);
    },
    complete:function(e){
      console.log("finish");
      console.log(e);
    }
	});
}
module.exports = {
  connect: connect,
	send:send
}
