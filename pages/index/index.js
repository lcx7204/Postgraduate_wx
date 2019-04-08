//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
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

    links: []
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
    console.log(this.data.swiperCurrent);
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
    
  },
  
  getUserInfo: function(e) {
    
  }
})