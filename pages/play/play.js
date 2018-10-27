let mLogin = require('../../utils/mLogin.js');
let mPlaD = require('../../utils/playData.js');
let mPlaS = require('../../utils/playSend.js');
let net = require('../../utils/network.js');
Page({
  data: {
    mObj:{},
    mCObj:{},
    mBs:{mbool:false,num:1.0}
  },
  page:{
    mTyp:''
  },
  binPay:function(e){
    console.log(this.data.mObj.pid)
    console.log(this.data.mObj.uid)
  },
  binMen: function (e) {
    let mObj = this.data.mObj;
    wx.navigateTo({ url: '/pages/menus/menus?id=' + this.data.mCObj.uid +'&cid='+ mObj.uid});
  },
  binBS:function(e){
    let myBs = this.data.mBs;
    if (myBs.num == 1.0){
      myBs.num = 1.5;
      this.setData({ mBs: myBs});
      if (this.videoContext) this.videoContext.playbackRate(1.5);
    }else{
      myBs.num = 1.0;
      this.setData({ mBs: myBs });
      if (this.videoContext) this.videoContext.playbackRate(1.0);
    }
  },
  vidEve:function(e){
    mPlaS.sendEve();
  },
  vidTim:function(e){
    mPlaS.setVidTim(e.detail.currentTime);
  },
  onLoad: function (options) {
    let that = this;
    let mChid = options.id;

    mLogin.getUserInfo(function (mToken) {
      mPlaD.getPlayData(mToken, mChid, function (data) {
        wx.setNavigationBarTitle({ title: data.cw.name });
        that.setData({ mObj: data.cw });
        that.setData({ mCObj: data.cc });
        mPlaS.init(mToken, mChid);

        that.page.mTyp = that.extName(data.cw.fileUrl)
        that.autoplay(that.page.mTyp);
      })
    });
  },
  onShow: function () {

  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  extName:function(mUrl){
    let medTyp = '';
    if (mUrl && mUrl != '') {
      var medArr = mUrl.toLowerCase().split('.');
      medTyp = medArr[medArr.length - 1];
    }
    return medTyp;
  },
  autoplay:function(mTyp){
    let that = this;
    if (mTyp == 'mp3') {
      setTimeout(function(){
        if (net.getType() == 'wifi' && that.videoContext) that.videoContext.play();
      },500)
    } else if (mTyp == 'mp4'){
      that.setData({ mBs: { mbool: true, num: 1.0 } });
    }
  },
  onShareAppMessage: function () {

  }
})