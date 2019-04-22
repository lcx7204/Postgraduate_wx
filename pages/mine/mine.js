// pages/mine/mine.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl:'',//服务器地址
    avatarUrl:'',//头像地址
    hasLogin:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.serverUrl = app.globalData.serverUrl;
    var that = this;
    // 查看是否登录
    wx.checkSession({
      success: function () {
        //已授权
        console.log("已经授...");
        // wx.request({
        //   url: that.serverUrl +'/user/wxGetUserByOpenId',
        // })
        wx.getUserInfo({
          success:function(res){
            console.log(res);
            that.setData({
              avatarUrl:res.userInfo.avatarUrl
            })
          }
        })
      },
      fail: function () {
        console.log("未授权...");
        //未授权
        wx.showToast({
          title: '用户未授权',
          icon: 'success',
          duration: 2000
        })
      }
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
   * 获取openid
   */
  wxLogin: function (userInfo){
    console.log('get openid');
    var that = this;
    //获取code
    wx.login({
      success:function(res){
        if(res.code){
          wx.request({
            url: that.serverUrl+'/user/wxLogin?code='+res.code,
            method:'GET',
            success:function(res){
              that.setData({
                hasLogin:false,
                avatarUrl:userInfo.avatarUrl
                });
              //拿到用户openid及userinfo,存储到后台并维护登录状态
              that.userInfoSetInSQL(res.data.openid,userInfo);
            },
            fail:function(res){

            }
          })
        }
      },
      fail:function(res){
        console.log(res);
      }
    })
  },
  //获取用户信息
  getUserInfo:function(){
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo;
        that.wxLogin(userInfo);
        //生成用户信息并保存到数据库
        //that.userInfoSetInSQL(userInfo);
      },
      fail: function () {
        console.log("用户拒绝授权...");
      }
    })
  },
  //保存到自己系统的数据库
  userInfoSetInSQL:function(openid,userInfo){
    var that = this;
    wx.request({
      url: that.serverUrl + '/user/wxRegister',
      data: {
        openId:openid,
        nickName: userInfo.nickName,
        avatorUrl: userInfo.avatarUrl,
        userType: 0
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        wx.setStorage({
          key: 'userId',
          data: res.data.data.userId,
        });
        wx.setStorage({
          key: 'sessionId',
          data: res.data.data.sessionId,
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  //跳转到聊天页面
  toChat:function(){
    wx.navigateTo({
      url: '/pages/chat/chat',
    })
  },
  //跳转至收藏页面
  toMyKeep:function(){
    console.log("/pages/myKeep/myKeep");
    wx.navigateTo({
      url: '/pages/myKeep/myKeep',
    })
  }
})