// template/login/login.js
import network from '../../utils/network.js';
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getuserinfo(e) {
      const userinfo = e.detail.userInfo;
      console.log(userinfo,"授权的userinfo")
      if (userinfo) {
        const newUserInfo = {
          openid: wx.getStorageSync('openid'),
          nickname: userinfo.nickName,
          sex: userinfo.gender,
          city: userinfo.city,
          province: userinfo.province,
          country: userinfo.country,
          avatar: userinfo.avatarUrl,
        }
        const unionid = wx.getStorageSync("unionid");
        if(!unionid){
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              console.log(res, "用户敏感信息")
              wx.login({
                success: re => {
                  if (re.code) {
                    const params = {
                      iv: res.iv,
                      encrypted_data: res.encryptedData,
                      code: re.code
                    }
                    network.request('getUnionidIv', params, data => {
                      console.log(data, "解密用户敏感信息")
                      if (data.unionid) {
                        wx.setStorageSync("openid", data.openid)
                        wx.setStorageSync("unionid", data.unionid)
                        app.globalData.unionid = data.unionid;
                        console.log("login", data.unionid,app.globalData)
                        network.request("saveUserInfo", newUserInfo, data => {
                        })
                      }
                    })
                    // upload code to backstage decode get uid
                  }
                }
              })
            }
          })
        }else{
          network.request("saveUserInfo", newUserInfo, data => {

          })
        }
        wx.setStorageSync("userinfo", newUserInfo);

        this.triggerEvent('getuserinfo')
      } else {
        this.triggerEvent('cancel')
      }
    },
    cancel() {
      this.triggerEvent('cancel')
    }
  }
})