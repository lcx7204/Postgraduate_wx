// pages/article/article.js
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleId:'',
    serverUrl:'',
    articleName:'',
    praiseNum:0,
    isZan:false,
    isKeep:false,
    userId:'',
    sessionId:'',
    commentContent:'',//评论内容,
    commentArray:[], //评论列表
    commentflag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.serverUrl = app.globalData.serverUrl;
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function(res) {
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
        //判断用户是否收藏
        that.hasKeep();
        //获取评论列表
        that.getCommentListByArticleId();
      }
    });
    this.setData({
      articleId: options.articleId,
    });
    //根据ID获取详情
    this.getArticleDetail();
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

  //根据ID获取详情
  getArticleDetail:function(){
    var that = this;
    wx.request({
      url: that.serverUrl + '/article/getArticleById?articleId=' + that.data.articleId,
      method: 'GET',
      success:function(res){
        that.setData({
          articleName:res.data.data.articleName,
          praiseNum: res.data.data.praiseNum
        })
        var detail_content = res.data.data.articleContent;
        WxParse.wxParse('detail_content', 'html', detail_content, that, 5);
      },
      fail:function(res){
        console.log(res);
      }
    })
  },
  //点赞
  zan:function(){
    var that = this;
    if(this.data.session == ''){
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    }else{
      var prase = this.data.praiseNum;
      this.setData({
        isZan: true,
        praiseNum: prase + 1
      });
      this.updateArticleZan();
    }
  },
  //取消点赞
  unzan:function(){
    var that = this;
    if (this.data.session == '') {
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    } else {
      var prase = this.data.praiseNum;
      this.setData({
        isZan: false,
        praiseNum: prase - 1
      });
      this.updateArticleZan();
    }
  },
  //更新文章点赞数
  updateArticleZan:function(){
    var that = this;
    var article = {
      articleId: this.data.articleId,
      praiseNum: this.data.praiseNum
    }
    wx.request({
      url: that.serverUrl +'/article/updateArticle',
      header:{'Cookie':'JSESSIONID='+that.data.sessionId},
      data: article,
      method:'POST',
      success:function(res){
        console.log(res);
        if(res.data.status==1){
          wx.showToast({
            title: res.data.msg,
            icon: 'warn',
            duration: 2000
          })
        }
      },
      fail:function(res){
        console.log(res);
      }
    })
  },
  //收藏
  keep:function(){
    var that = this;
    if (this.data.session == '') {
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    } else {
      //添加收藏
      var keep = {
        collectionUser:that.data.userId,
        collectionInfo:that.data.articleId
      }
      wx.request({
        url: that.serverUrl+'/keep/addKeep',
        method:'POST',
        header: { 'Cookie': 'JSESSIONID=' + that.data.sessionId },
        data:keep,
        success:function(res){
          console.log(res.data);
          if(res.data.status==0){
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            });
            that.setData({
              isKeep:true
            })
          }
        },
        fail:function(res){
          console.log(res.data);
        }
      })
    }
  },
  //取消收藏
  unkeep:function(){
    var that = this;
    if (this.data.session == '') {
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    } else{
      //取消收藏
      var keep = {
        collectionUser: that.data.userId,
        collectionInfo: that.data.articleId
      }
      wx.request({
        url: that.serverUrl + '/keep/deleteKeep',
        method: 'POST',
        header: { 'Cookie': 'JSESSIONID=' + that.data.sessionId },
        data: keep,
        success: function (res) {
          console.log(res.data);
          if(res.data.status==0){
            wx.showToast({
              title: '取消成功',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              isKeep: false
            })
          }
        },
        fail: function (res) {
          console.log(res.data);
        }
      })
    }
  },
  //用户是否收藏
  hasKeep:function(){
    var that = this;
    var keep = {
      collectionUser: that.data.userId,
      collectionInfo: that.data.articleId
    }
    console.log(that.data.sessionId);
    wx.request({
      url: that.serverUrl+'/keep/hasKeep',
      method: 'POST',
      header: { 'Cookie': 'JSESSIONID=' + that.data.sessionId },
      data: keep,
      success: function (res) {
        console.log(res.data);
        if(res.data.data==0){
          //0表示未收藏
          that.setData({
            isKeep:false
          })
        }
        if(res.data.data==1){
          //1表示已收藏
          that.setData({
            isKeep: true
          })
        }
      },
      fail: function (res) {
        console.log(res.data);
      }
    })
  },
  //添加评论
  addComment:function(e){
    var commentContent = e.detail.value.commentContent.trim();
    var that = this;
    if (commentContent.length<1){
      wx.showToast({
        title: '请输入内容后提交',
        icon:'none'
      })
    }else{
      console.log(commentContent);
      var comment = {
        commentContent:commentContent,
        commentUser:this.data.userId,
        commentInfo:this.data.articleId
      }
      //提交评论
      wx.request({
        url: that.serverUrl+'/comment/addComment',
        method: 'POST',
        header: { 'Cookie': 'JSESSIONID=' + that.data.sessionId },
        data: comment,
        success:function(res){
          console.log(res.data);
          if(res.data.status==0){
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
            that.setData({
              commentContent:''
            })
            that.getCommentListByArticleId(that.data.articleId);
          }
        },fail:function(res){
          console.log(res.data);
        }
      })
    }
  },
  //获取评论列表
  getCommentListByArticleId:function(){
    var that = this;
    console.log(that.data.articleId);
    wx.request({
      url: that.serverUrl +'/comment/getCommentByArticleId',
      method:'GET',
      data:{
        articleId: that.data.articleId
      },
      header: { 'Cookie': 'JSESSIONID=' + that.data.sessionId },
      success:function(res){
        console.log(res);
        var data = [];
        for(var i=0;i<res.data.data.length;i++){
          var json = {
            commentContent:'',
            avatarUrl:'',
            nick_name:''
          }
          json.commentContent = res.data.data[i].commentContent;
          //TODO
          data.push(json);
        }
        that.setData({
          commentArray:data
        })
        if(that.data.commentArray.length==0){
          //评论为空
          that.setData({
            commentflag:false
          })
        }
      },fail:function(res){
        console.log(res);
      }
    })
  }
})