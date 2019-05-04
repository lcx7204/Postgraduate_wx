// pages/search/search.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    historyKeys: [],    //历史搜索
    hotKeys: [],
    finished: false,
    q:'',              //文本框内容
    loading: false,
    loadingCenter: false,
    serverUrl: '',
    cateArray:[],
    empty:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.serverUrl = app.globalData.serverUrl;
    wx.getStorage({
      key: 'sessionId',
      success: function (res) {
        console.log(res.data);
        that.setData({
          sessionId: res.data
        });
      }
    });
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
  //取消
  onCancel: function (event) {
    wx.navigateBack({
      url:'/pages/index/index'
    })
  },
  //搜索框删除
  onDelete: function (event) {
    this.setData({
      finished: false,
      empty: false,
      q: ''
    })
  },
  //搜索
  onConfirm: function (event) {
    // 首先切换状态，保持客户端流畅
    this.setData({
      finished: true,
      loadingCenter: true
    })
    let q = event.detail.value || event.detail.text
    var that = this;
    var data = this.data.cateArray;
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
    wx.request({
      url: that.serverUrl+'/article/wxGetArticleByKey?articleName='+q,
      method:'GET',
      success:function(res){
        console.log(res.data);
        if(res.data.data.length>0){
          for(var i=0;i<res.data.data.length;i++){
            var dataJSON = {
              articleId: '',
              articleName: '',
              articleCategory: '',
              publishDate: '',
              fenmianPic: ''
            }
            dataJSON.articleId = res.data.data[i].articleId;
            dataJSON.articleName = res.data.data[i].articleName;
            dataJSON.articleCategory = res.data.data[i].articleCategory;
            dataJSON.publishDate = getNowFormatDate(new Date(res.data.data[i].publishDate));
            dataJSON.fenmianPic = that.getimgs(res.data.data[i].articleContent);
            data.push(dataJSON);
          }
          that.setData({
            q: q,
            loadingCenter: false,
            cateArray:data
          });
          console.log(that.data.cateArray);
        }else{
          that.setData({
            empty: true,
          })
        }
      },fail:function(res){
        console.log(res.data);
      }
    })
  },
  /**
        * 提取字符串中图片url地址
        */
  getimgs: function (str) {
    var imgReg = /<img.*?(?:>|\/>)/gi;
    var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    var arr = str.match(imgReg);
    var fenmianUrl = arr[0].match(srcReg)[1];
    return fenmianUrl;
  },
  //跳转套文章详情
  toArticleDetail: function (e) {
    wx.navigateTo({
      url: '../article/article?articleId=' + e.currentTarget.id,
    })
  },
})