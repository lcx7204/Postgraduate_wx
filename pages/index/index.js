//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    serverUrl: '',
    tabbar: {},
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    imgUrls: [
      'https://p3.pstatp.com/large/43700001e49d85d3ab52',
      'https://p3.pstatp.com/large/39f600038907bf3b9c96',
      'https://p3.pstatp.com/large/31fa0003ed7228adf421'
    ],
    links: [],
    cate01Array:[],
    cate02Array:[],
    cate03Array:[],
    cate04Array:[]
  },
  //事件处理函数
  //轮播图的切换事件
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  //点击图片触发事件
  swipclick: function (e) {
    wx.switchTab({
      url: this.data.links[this.data.swiperCurrent]
    })
  },
  //搜索跳转
  Tosearch:function(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  bindViewTap: function() {
    
  },

  onLoad: function () {
    this.serverUrl = app.globalData.serverUrl;
    //请求首页文章数据
    this.getArticleList();
  },
  
  getUserInfo: function(e) {
    
  },
  //自定义事件
  //获取文章列表
  getArticleList:function(){

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
    
    var that = this;
    var data1 = this.data.cate01Array;
    var data2 = this.data.cate02Array;
    var data3 = this.data.cate03Array;
    var data4 = this.data.cate04Array;
    wx.request({
      url: that.serverUrl+'/article/wxGetArticleList',
      data: {articleCategory:"10%"},
      method:'GET',
      success:function(res){
        for(var i = 0;i<res.data.data.length;i++){
          var dataJSON = {
            articleId:'',
            articleName:'',
            articleCategory:'',
            publishDate:'',
            fenmianPic:''
          }
          dataJSON.articleId = res.data.data[i].articleId;
          dataJSON.articleName = res.data.data[i].articleName;
          dataJSON.articleCategory = res.data.data[i].articleCategory;
          dataJSON.publishDate = getNowFormatDate(new Date(res.data.data[i].publishDate));
          dataJSON.fenmianPic = that.getimgs(res.data.data[i].articleContent);
          
          if(dataJSON.articleCategory=='1001'){
            data1.push(dataJSON);
          }
          if (dataJSON.articleCategory == '1002') {
            data2.push(dataJSON);
          }
          if (dataJSON.articleCategory == '1003') {
            data3.push(dataJSON);
          }
          if (dataJSON.articleCategory == '1004') {
            data4.push(dataJSON);
          }
        }
        that.setData({
          cate01Array:data1,
          cate02Array:data2,
          cate03Array:data3,
          cate04Array:data4
        })
      },
      fail:function(res){
        console.log(res);
      }
    })
  },
  //跳转套文章详情
  toArticleDetail:function(e){
    wx.navigateTo({
      url: '../article/article?articleId=' + e.currentTarget.id,
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
  }
})