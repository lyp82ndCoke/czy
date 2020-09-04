//app.js
// import network from './utils/network';
const router = require('./utils/router.js');
// import getCode from './utils/getCode.js';
App({
  // 检查更新
  update(options) {
    console.log("检查更新");
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            updateManager.applyUpdate();
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
            });
          });
        }
      });
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
      });
    }

  },
  onLaunch() {
    // getCode.login().then(res => {
    //   console.log("code：", res)
    //   this.globalData.unionid=res;

    // })
    wx.getSystemInfo({
      success: (res) => {
        // console.log("手机型号", res.model)
        // console.log("手机品牌", res.brand)
        // console.log("设备像素比", res.pixelRatio)
        // console.log("客户端平台", res.platform)
        // console.log("状态栏的高度", res.statusBarHeight)
        // 齐刘海适配
        if (res.statusBarHeight > 20) {
          this.globalData.isIpx = true;
          // if (res.brand == "iPhone") {
            this.globalData.isIpxBottom = true;
          // }
        }
        let isiOS = res.system.indexOf('iOS') > -1
          , navHeight, statusHeight = res.statusBarHeight;
        if (!isiOS) {
          this.globalData.navHeight = 48 + statusHeight;
        } else {
          this.globalData.navHeight = 44 + statusHeight;
        }
        //console.log(res.language)//zh_CN(en)
        //console.log(res.model=="iPhone X")
        // if (res.model == "iPhone X") {
        //   that.globalData.isIPX = 1;
        // }
      }
    })

    // this.login()

  },
  // login判断是否授权过
  login() {
    wx.getSetting({
      success: res => {
        if (!res.authSetting["scope.userInfo"]) {
          console.log("没有授权");
          return 1;
        } else {
          return 0;
        }
        // this.log();
      }
    });
  },
  // 分享回流
  // postShare(query) {
  //   console.log("分享回流", query);
  //   // network.request("postShare", query, data => {}, error => {});
  // },

  // 上传图片
  uploadimg: function (data, cb) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file', //这里根据自己的实际情况改
      formData: "whyyczy", //这里是上传图片时一起上传的数据
      params: {},
      success: (resp) => {
        const results = JSON.parse(resp.data);
        console.log(resp, "resp")
        if (results.code==200){
          success++; //图片上传成功，图片上传成功的变量+1
          console.log(resp.data,"resp.data")
          var result = results['result'];
          var preview = result['relativeFile'];
          that.globalData.upimglist.push(preview);
          //that.globalData.upimglist = that.globalData.upimglist.join(',');
          console.log("上传返回信息", results);
          console.log(i);
        }
       
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1


      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);

          typeof cb == 'function' && cb();

        } else { //若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data, cb);
        }

      }
    });
  },
  saveImg(url, cb) {
    wx.showLoading({
      title: '保存图片中...',
      mask: true
    })
    wx.downloadFile({
      url,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            console.log(data);
            wx.showToast({
              title: '已保存到相册',
              icon: "success"
            })
            if (cb !== undefined && typeof cb == 'function') {
              cb()
            }
          },
          fail: function (err) {
            console.log(err);
            wx.showToast({
              title: '图片保存失败，请重新保存',
              icon: "none"
            })
          }
        })
      }, fail() {
        wx.showToast({
          title: '图片下载失败，请重新下载',
          icon: "none"
        })
      }
    })
  },
  onShow(options) {
    console.log('小程序进入', options)


    this.globalData.scene = options.scene;
    if (options.scene && options.scene == 1038) {
      if (options.referrerInfo.extraData && options.referrerInfo.extraData.pay) {
        this.globalData.pay = true;
        // wx.showToast({
        //     title: "支付成功",
        //     icon: 'none'
        // })
        wx.startPullDownRefresh();
        wx.stopPullDownRefresh();
      } else {
        // wx.showToast({
        //     title: "支付失败",
        //     icon: 'none'
        // })
      }
    } else {
      // 分享回流
      this.log(options);

      // 检测更新
      this.update(options);

    }
  },
  // 获取uid发送log日志
  log(options) {
    console.log("log", options)
    let query = options.query;
    let path = options.path;
    let ruid = query.form_user;
    let uid = wx.getStorageSync("user_id");
    if (query.nav) {
      query.url = query.nav;
    } else {
      query.url = path;
    }
    query.from_user_id = ruid;
    if (uid) {

      if (ruid) {
        this.postShare(query);
      }
    } else {
      // getCode.login().then(res => {
      //   if (ruid) {
      //     this.postShare(query);
      //   }

      // });
    }
  },
  onHide() {
    console.log('小程序退出')
  },
  globalData: {
    unionid:null,
    camp_times_id: null,//当前播放课程的营期id
    spec_column_id:null,//当前播放课程的专栏id
    course_id:null,//当前播放的课程id
    onPlay:false,
    uploadFileUrl:"https://zdata.zmedc.com/edugrown/Upfile/upload_file",
    showLogin: false,
    userInfo: null,
    user_id: null,
    scene: null,
    upimglist:[],
    isIpx: false,
    isIpxBottom: false,
    navHeight:0
  }
})