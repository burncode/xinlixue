let mLogin = require('../../utils/mLogin.js');
let mLesD = require('../../utils/lesData.js');
let mColD = require('../../utils/colleData.js');
let mPay = require('../../utils/pay.js');
let mOrdD = require('../../utils/orderData.js');
let WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    showDetail: true,
    mObj:{},
    wcList:[],
    mPic: true
  },
  toggleTab: function (e) {
    let mTag = e.target;
    if (mTag.id == 'tabLef'){
      this.setData({showDetail: true})
    } else if (mTag.id == 'tabRig'){
      this.setData({showDetail: false})
    }
  },
  binPlay:function(e){
    let mObj = this.data.wcList[0].children[0];
    if (mObj){
      wx.navigateTo({ url: '/pages/play/play?id=' + mObj.uid });
    }
  },
  binPay:function(e){
    let myObj = this.data.mObj;
    wx.navigateTo({ url: '/pages/orderInfo/orderInfo?ids=' + myObj.uid + '&moe=' + myObj.priceInfo});
  },
  binSha: function (e) {
    this.setData({ mPic: false });
  },
  binWCList:function(e){
    let mTag = e.target;
    if (mTag.id == 'wcch' || mTag.id == 'wcchbt'){
      if (mTag.dataset.uid != ''){
        if (mTag.dataset.url == ''){
          return;
        }
        wx.navigateTo({ url: '/pages/play/play?id=' + mTag.dataset.uid });
      }
    }
  },
  binCol:function(e){
    let that = this;
    let myObj = this.data.mObj;
    mColD.setFol(mLogin.getToken(), that.data.mObj.uid,function(data){
      if (myObj.folderFlag == 1){
        myObj.folderFlag = 0;
        wx.showToast({ title: '已取消收藏', icon: 'none', duration: 1500 });
      }else{
        myObj.folderFlag = 1;
        wx.showToast({ title: '收藏成功', icon: 'none', duration: 1500 });
      }
      that.setData({ mObj: myObj});
    })
  },
  picBind: function (e) {
    let mTarg = e.target;
    let myObj = this.data.mObj;
    if (mTarg.id == 'yqcard') {
      wx.navigateTo({ url: '/pages/card/card?id=' + myObj.uid});
    }
    this.setData({ mPic: true });
  },
  onLoad: function (options) {
    let that = this;
    let mLid = options.id;
    if (options.shid){
      mOrdD.setShareid(options.shid);
    }else{
      mOrdD.setShareid('');
    }
    
    mLogin.getUserInfo(function (mToken) {
      mLesD.getLesData(mToken, mLid,function(data){
        wx.setNavigationBarTitle({ title: data.cc.name });
        that.setData({ mObj: data.cc});
        WxParse.wxParse('article', 'html', data.cc.note, that, 5);
        that.setData({ wcList: data.cwList });
      })
    });
  },
  updataPay:function(mNum){
    let myObj = this.data.mObj;
    myObj.purchasedFlag = mNum;
    this.setData({ mObj: myObj});
  },
  onShow: function () {
    let that = this;
    let mPIds = mPay.getPayId();
    if (mPIds == that.data.mObj.uid){
      that.updataPay('1');
    }
  },
  onShareAppMessage: function () {
    let myObj = this.data.mObj;
    return {
      title: '快和Rogers一起来学考研心理～',
      desc: '快和Rogers一起来学考研心理～',
      path: 'pages/lesson/lesson?id=' + myObj.uid+'&shid=' + mLogin.getUserId()
    }
  }
})