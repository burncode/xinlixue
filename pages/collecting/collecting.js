let mLogin = require('../../utils/mLogin.js');
let mColD = require('../../utils/colleData.js');
Page({
  data: {
    mList:[]
  },
  bindLess: function (e) {
    wx.navigateTo({ url: '/pages/lesson/lesson?id=' + e.target.id });
  },
  onLoad: function (options) {
    
  }, 
  onShow: function () {
    let that = this;

    mLogin.getUserInfo(function (mToken) {
      mColD.seaInit();
      that.updataList();
    });
  },
  onReachBottom: function () {
    let that = this;
    let mJZ = mColD.getJZ();
    if (mJZ.jBool) {
      mColD.setJZ(false, 0);
      that.updataList();
    }
  },
  updataList: function () {
    let that = this;
    mColD.searFolServer(mLogin.getToken(), function (data) {
      that.setData({ mList: data });
    });
  },
  onShareAppMessage: function () {
    return {
      title: '快和Rogers一起来学考研心理～',
      desc: '快和Rogers一起来学考研心理～',
      path: 'pages/index/index'
    }
  }
})