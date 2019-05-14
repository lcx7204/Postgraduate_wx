var app = getApp();
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    categoryArray:[],  //分类数组
    cate01Arr:[],
    cate02Arr:[],
    cate03Arr:[],
    cate04Arr:[],
    cate05Arr:[],
    cate06Arr:[],
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    };
    this.getRecommentListByCategory(e);
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });

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
        //获取推荐分类
        that.getCategory();
      }
    });
    //获取第一个分类的数据
    wx.request({
      url: that.serverUrl + '/recommend/wxGetRecommentListByCategory',
      data: {
        recommendCategory: '2001'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        var data = [];
        for(var i=0;i<res.data.data.length;i++){
          var json = {
            recommendTitle: '',
            recommendContent: '',
            recommendCategory: '',
            recommendId: ''
          }
          json.recommendTitle = res.data.data[i].recommendTitle;
          json.recommendContent = res.data.data[i].recommendContent;
          json.recommendCategory = res.data.data[i].recommendCategory;
          json.recommendId = res.data.data[i].recommendId;
          data.push(json);
        }
        that.setData({
          cate01Arr:data
        })
      }, fail: function (res) {
        console.log(res.data);
      }
    })
  },
  footerTap: app.footerTap,
  //获取分类信息
  getCategory: function () {
    var that = this;
    wx.request({
      url: that.serverUrl + '/category/wxGetRecommendCategory',
      header: { 'Cookie': 'JSESSIONID=' + that.data.sessionId },
      data:{
        categoryType:'20'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        var data = [];
        for(var i = 0;i<res.data.data.length;i++){
          var json = {
            categoryId:'',
            categoryName:'',
            index:''
          }
          json.categoryId = res.data.data[i].categoryId;
          json.categoryName = res.data.data[i].categoryName;
          json.index = i;
          data.push(json);
        }
        that.setData({
          categoryArray:data
        })
      }, fail: function (res) {
        console.log(res.data);
      }
    })
  },
  //根据编号获取对应的推荐列表
  getRecommentListByCategory:function(e){
    var categoryId = e.target.id;
    var that = this;
    wx.request({
      url: that.serverUrl +'/recommend/wxGetRecommentListByCategory',
      data:{
        recommendCategory:categoryId
      },
      method:'GET',
      success:function(res){
        console.log(res.data);
        var data1 = [];
        var data2 = [];
        var data3 = [];
        var data4 = [];
        var data5 = [];
        var data6 = [];
        for (var i = 0; i < res.data.data.length; i++) {
          var json = {
            recommendTitle: '',
            recommendContent: '',
            recommendCategory:'',
            recommendId:''
          }
          json.recommendTitle = res.data.data[i].recommendTitle;
          json.recommendContent = res.data.data[i].recommendContent;
          json.recommendCategory = res.data.data[i].recommendCategory;
          json.recommendId = res.data.data[i].recommendId;
          if (json.recommendCategory == '2001') {
            data1.push(json);
          }
          if (json.recommendCategory == '2002') {
            data2.push(json);
          }
          if (json.recommendCategory == '2003') {
            data3.push(json);
          }
          if (json.recommendCategory == '2004') {
            data4.push(json);
          }
          if (json.recommendCategory == '2005') {
            data5.push(json);
          }
          if (json.recommendCategory == '2006') {
            data6.push(json);
          }
        }
        that.setData({
          cate01Arr: data1,
          cate02Arr: data2,
          cate03Arr: data3,
          cate04Arr: data4,
          cate05Arr: data5,
          cate06Arr: data6,
        })
      },fail:function(res){
        console.log(res.data);
      }
    })
  },
  //推荐详情
  toRecommendDetail:function(e){
    var recommendId = e.target.id;
    wx.navigateTo({
      url: '../recDetail/recDetail?recommendId='+recommendId,
    })
  }
})