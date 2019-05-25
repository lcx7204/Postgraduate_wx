// pages/chat/chat.js
const app = getApp();
var websocket = require('../../utils/websocket.js');
var utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatMsg:'',
    serverUrl: '',
    userId: '',
    accessId:'417e5d8acaf842469a59a3846d634a98',
    sessionId: '',
    chatList:[],
    increase:false,//图片添加区域隐藏
    timer:'',
    addChat:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.serverUrl = app.globalData.serverUrl;
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userId: res.data
        });
      },
    });
    wx.getStorage({
      key: 'sessionId',
      success: function (res) {
        that.setData({
          sessionId: res.data
        });
        //调用通信接口
        var url = "ws://kaoyan.natapp1.cc/Postgraduates/ws";
        websocket.connect(that.data.userId, url, function (res) {
          var list = [];
          list = that.data.chatList;
          list.push(JSON.parse(res.data));
          that.setData({
            chatList: list
          })
        });
      }
    });
    this.startReportHeart();
  },



  startReportHeart() {
    var that = this;
    var timerTem = setTimeout(function () {
      that.getChatList();
      that.startReportHeart();
    }, 1000)
    // 保存定时器name
    that.setData({
      timer: timerTem
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.closeSocket();
    wx.showToast({
      title: '连接已断开',
      icon:'none',
      duration:5000
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 发送消息
   */
  addChat:function(e){
    var that = this;
    var chatMsg = e.detail.value.addChat.trim();
    if(chatMsg==''){
      wx.showToast({
        title: '不能发送空消息',
        icon: 'none'
      })
    }
    //发送消息
    //var url = "ws://kaoyan.natapp1.cc/Postgraduates/Postgraduate/ws";
    setTimeout(function(){
      that.setData({
        increase:false
      })
    },500);
    websocket.send('{ "chatContent": "' + chatMsg + '", "sendId": "' + this.data.userId + '","type":"text", "accessId": "' + that.data.acessId  + '" }');
    that.setData({
      addChat:''
    })
    that.getChatList();
  },
  //获取消息
  getChatList:function(){
    var that = this;
    //获取当前时间，格式YYYY-MM-DD
    function getNowFormatDate(date) {
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
    //接收用户消息
    var message = [];
    wx.request({
      url: that.serverUrl + '/chat/getUserChat?userId=' + that.data.userId,
      header: { 'Cookie': 'JSESSIONID=' + that.data.sessionId },
      method: 'GET',
      success: function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          var json = {
            sendId: '',
            chatContent: '',
            chatDate: '',
            classStyle: ''
          }
          json.accessId = res.data.data[i].accessId;
          json.chatContent = res.data.data[i].chatContent;
          json.chatDate = getNowFormatDate(new Date(res.data.data[i].chatDate));
          if (json.accessId == that.data.userId) {
            json.classStyle = 'message_to'
          } else {
            json.classStyle = "message_from"
          }
          message.push(json);
        }
        that.setData({
          chatList: message
        })
      }, fail: function (res) {
        console.log(res.data);
      }
    })
  }
})