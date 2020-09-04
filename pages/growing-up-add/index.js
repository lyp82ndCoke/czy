import network from '../../utils/network';
const router = require('../../utils/router.js');
const app = getApp();
var postMsgFlag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    pics: [],
    content: '',
    sendred: 0,
    userInfo: {},
    fontvaluelength: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "发布心得" })
    let userinfo = wx.getStorageSync('userinfo');
    if (userinfo){
      this.setData({
        userinfo
      })
    }else{

    }

    postMsgFlag = true;
  },
  getInfo: function () {
    network.request('getUserInfo', {}, data => {
      console.log("data--", data)
      this.setData({
        userInfo: data
      })
    }, err => {
      console.log(err)
    })
  },
  choose: function () {//这里是选取图片的方法
    var that = this,
      pics = this.data.pics;
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        let sendred = false;
        if (pics.length){
          sendred=true
        }
        that.setData({
          pics: pics,
          sendred
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },


  //图片点击事件
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    console.log("srcsrc", src);
    console.log("event", event);
    console.log("imgListimgList", imgList);
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  deleteImage: function (e) {
    var that = this;
    var images = that.data.pics;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          images.splice(index, 1);
          
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        let sendred = false;
        if (images.length){
          sendred = true;
        }
        that.setData({
          pics: images,
          sendred
        });
      }
    })
  },
  // 获取文本框的内容
  getAreaValue: function (e) {
    var that = this;
    var value = e.detail.value;
    var vlength = value.length;
    that.setData({
      fontvaluelength: vlength,
    });
    console.log("长度", value.length, this.data.pics.length);
    if (value.length || this.data.pics.length) {
      that.setData({
        sendred: 1,
        content: value,
      });
      //   app.func.showToast("内容不能为空");
      // return ;
    }else{
      that.setData({
        sendred: 0,
        content: value,
      });
    }

  },
  uploadimg: function (cb) {//这里触发图片上传的方法
  wx.showLoading({
    title: '图片上传中...',
    mask:true
  })
    var pics = this.data.pics;

    if (pics.length > 0) {
      network.uploadFils('czy', pics)
        .then(data => {
          let list = data.success
          if (list) {
            let imgList = Array.from(list, (item) => (item.relativeFile))
            this.setData({
              imgList: imgList
            })
            cb()
          }
          console.log("成长墙:=======", data.success)
        })
        .catch(error => {
          cb()
        })
      // app.uploadimg({
      //   url: app.globalData.uploadFileUrl,//这里是你图片上传的接口
      //   path: pics//这里是选取的图片的地址数组
      // }, cb);
    }
    else {
      app.func.showToast("请上传图片");
    }

  },
  actionPostMsg: function () {
    var that = this;
    var fontvaluelength = that.data.fontvaluelength;
    if (fontvaluelength > 1500) {
      wx.showToast("不能超过1500字");
      return
    }
    wx.showLoading({
      title: '发布中...',
    })
    console.log(app.globalData.upimglist,"app.globalData.upimglist")
    // var upimglist = app.globalData.upimglist;
    var params = {};
    params['details'] = that.data.content;
    params['pic_urls'] = this.data.imgList  // app.globalData.upimglist;
    network.request('releaseGrouthwall',params,res=>{
        // app.globalData.upimglist = [];
        wx.showToast({
          title:"发布成功",
          mask: true
          });
        setTimeout(function () {
          router.navigateBack({back:true})
        }, 1000);
         
    })
   
  },
  postMsg: function () {
    if (postMsgFlag === true) {
      postMsgFlag = false;
      var pics = this.data.pics;
      if (pics.length > 0) {
        this.uploadimg(this.actionPostMsg);
      }
      else {
        this.actionPostMsg();
      }
    }
  },
  goBack() {
    router.navigateBack()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },



})