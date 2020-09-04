/**
 * 
 */
import network from './network.js';
const Promise = require('es6-promise.min').Promise
const app = getApp();

function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: res => {
        if (res.code) {
          // upload code to backstage decode get uid
          network.request('getUnionid', {
            code: res.code
          },
            function (res) {
              console.log(res)
              if (res.unionid){
                  // 解决部分iPhone用户微信本地数据库损坏
                app.globalData.unionid = res.unionid;
                console.log(app.globalData,"获取code")
                wx.setStorageSync('unionid', res.unionid);
              }
              wx.setStorageSync('openid', res.openid);
              resolve(res.unionid)
            },
            function (error) {
              console.log(error);
            })
        }
      }
    })
  })

}
function loginShow() {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: res => {
        if (!res.authSetting["scope.userInfo"]) {
          console.log("没有授权");
          resolve(true);
        } else {
          
          resolve(false);
        }
      }
    });
  })

}
function showMenuNotice(){
  network.request('menuNotice',{},res=>{
    if (res.is_show_notice_onmenu){
      wx.showTabBarRedDot({ index: 4 })
    }else{
      wx.hideTabBarRedDot({
        index: 4,
      })
    }
  })
};

export default {
  login,
  loginShow,
  showMenuNotice
}