const bgAudBG = wx.getBackgroundAudioManager();
const audMim = wx.createInnerAudioContext();
var bgAud = null;

let miCont = null;
let miObj= null;
let mUpCon = null;
let mDurB = true;
let mStop = false;
let mTimFun = null;
let mMimBool = false;

function init(myCon,mObj,mBool) {
  miCont = myCon;
  miObj = mObj;
  mDurB = true;
  mStop = false;
  if (mBool){
    mMimBool = true;
    bgAud = audMim;
  }else{
    bgAud = bgAudBG;
  }

  setBgOnFun();
  setBgAuInit(mObj);
}
function setBgOnFun(){
  bgAud.onPlay(function () {
    miCont.playStates = true;
    if (typeof mUpCon == 'function') mUpCon(miCont);
  });
  bgAud.onPause(function () {
    miCont.playStates = false;
    if (typeof mUpCon == 'function') mUpCon(miCont);
  });
  bgAud.onStop(function () {
    mStop = true;
    miCont.playStates = false;
    if (typeof mUpCon == 'function') mUpCon(miCont);
  });
  bgAud.onEnded(function () {
    mStop = true;
    miCont.playStates = false;
    if (typeof mUpCon == 'function') mUpCon(miCont);
  });
  bgAud.onError(function (e) {
    miCont.playStates = false;
    if (typeof mUpCon == 'function') mUpCon(miCont);
  });
  bgAud.onTimeUpdate(function (e) {
    miCont.curStr = formatTim(bgAud.currentTime);
    miCont.durStr = formatTim(bgAud.duration);
    if (miCont.updateState) {
      let sliderValue = bgAud.currentTime / bgAud.duration * 100;
      miCont.sliderValue = sliderValue;
      if (typeof mTimFun == 'function') mTimFun(bgAud.currentTime);
      if (typeof mUpCon == 'function') mUpCon(miCont);
    }
  })
}
function setBgAuInit(mObj){
  if (mMimBool) {
    bgAud.autoplay = true
  }else{
    bgAud.title = mObj.title;
    bgAud.coverImgUrl = mObj.coverImgUrl;
  }
  bgAud.src = mObj.src;
  
  miCont.updateState = true;
  if (typeof mUpCon == 'function') mUpCon(miCont);
}
function formatTim(mNum) {
  let myTim = parseInt(mNum);
  let sTim = myTim % 60;
  let mmTim = parseInt(myTim / 60);
  if (sTim < 10) sTim = '0' + sTim;
  if (mmTim < 10) mmTim = '0' + mmTim;

  return mmTim + ':' + sTim;
}

function setUpCont(sucFun){
  mUpCon = sucFun;
}

function setPthis(that) {
  that.mpbind = function(e){
    let mag = e.target;
    if (mag.id === 'myConP') {
      if (bgAud.src != '' && !mStop){
        bgAud.paused ? bgAud.play():bgAud.pause();
      } else if (miObj.src != ''){
        setBgAuInit(miObj);
      }
    }
  }
  that.sliderChanging = function(e){
    miCont.updateState = false;
    miCont.sliderValue = e.detail.value;
    if (typeof mUpCon == 'function') mUpCon(miCont);
  }
  that.sliderChange = function (e) {
    bgAud.seek(e.detail.value / 100 * bgAud.duration);
    miCont.sliderValue = e.detail.value;
    miCont.updateState = true;
    if (typeof mUpCon == 'function') mUpCon(miCont);
  }
  mTimFun = that.playTimeSend;
}

function pUnload(){
  bgAud.stop();
}

module.exports = {
  init: init,
  setUpCont: setUpCont,
  setPthis: setPthis,
  pUnload: pUnload
}