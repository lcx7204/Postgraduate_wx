// pages/recDetail/recDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendId:'',
    serverUrl:'',
    recommendIcon:'',
    recommendTitle:'',
    author:'',
    recommendDetail:'',
    companyName:'',
    price:'',
    publishDate:'',
    commentContent:'',
    comments: [],
    commentflag:false,
    noComment: true,
    posting: false,
    like: false,
    count: 0,
    isFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      recommendId: options.recommendId,
    });
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
        //获取评论列表
        that.getCommentListByArticleId();
      }
    });
    this.serverUrl = app.globalData.serverUrl;
    this.getRecommendDetail();
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
  //根据推荐ID获取推荐详情
  getRecommendDetail:function(){
    var that = this;
    wx.request({
      url: that.serverUrl +'/recommend/findRecommendById',
      data:{
        recommendId: that.data.recommendId
      },
      method:'GET',
      success:function(res){
        console.log(res.data);
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
        if (res.data.data.companyName==''){
          that.setData({isFlag:false});
        }
        that.setData({
          recommendIcon: res.data.data.recommendIcon,
          recommendTitle: res.data.data.recommendTitle,
          author: res.data.data.author,
          recommendDetail: res.data.data.recommendDetail,
          companyName: res.data.data.companyName,
          price: res.data.data.price,
          publishDate: getNowFormatDate(new Date(res.data.data.publishDate))
        })
      },
      fail:function(res){
        console.log(res.data);
      }
    })
  },
  //提交评论
  addComment:function(e){
    var commentContent = e.detail.value.commentContent.trim();
    var that = this;
    if (commentContent.length < 1) {
      wx.showToast({
        title: '请输入内容后提交',
        icon: 'none'
      })
    } else {
      console.log(commentContent);
      var comment = {
        commentContent: commentContent,
        commentUser: this.data.userId,
        commentInfo: this.data.recommendId
      }
      //提交评论
      wx.request({
        url: that.serverUrl + '/comment/addComment',
        method: 'POST',
        header: { 'Cookie': 'JSESSIONID=' + that.data.sessionId },
        data: comment,
        success: function (res) {
          console.log(res.data);
          if (res.data.status == 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            that.setData({
              commentContent: ''
            })
            that.getCommentListByArticleId(that.data.recommendId);
          }
        }, fail: function (res) {
          console.log(res.data);
        }
      })
    }
  },
  //获取评论列表
  getCommentListByArticleId: function () {
    var that = this;
    console.log(that.data.recommendId);
    wx.request({
      url: that.serverUrl + '/comment/getCommentByArticleId',
      method: 'GET',
      data: {
        articleId: that.data.recommendId
      },
      header: { 'Cookie': 'JSESSIONID=' + that.data.sessionId },
      success: function (res) {
        console.log(res);
        that.setData({
          comments: res.data.data
        })
        if (that.data.comments.length == 0) {
          //评论为空
          that.setData({
            commentflag: true
          })
        }
      }, fail: function (res) {
        console.log(res);
      }
    })
  }
})