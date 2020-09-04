// pages/good-sentence/index.js
const router = require('../../utils/router.js');
import network from '../../utils/network';
import getCode from "../../utils/getCode";
import shareData from '../../utils/share.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    isIpxBottom: app.globalData.isIpxBottom,
    list: [
    //   {
    //   "id": 1201,
    //   "prevID": 1206,
    //   "nextID": 1200,
    //   "saying": "每日金句",
    //   "dateY": "2019",
    //   "dateF": "November",
    //   "dateD": "05",
    //   "dateLabel": "2019.11.05",
    //   "authorName": "尹建莉0",
    //   "content": "家长即使从家长会上发现孩子学习退步，不守纪律，和同学打架，甚至旷课等严重问题，回家后也不应该打骂孩子。要先和老师好好分析沟通一下，尽可能寻找出问题的缘由来。孩子不会凭空出现问题。出现问题一定是有一些长期积淀的症结没得到解决，或是有某个外在因素使一些小问题恶化。",
    //   "isPraise": 0,
    //   "shareType": 2,
    //   "shareTitle": "家长即使从家长会上发现孩子学习退步，不守纪律，和同学打架，甚至旷课等严重问题，回家后也不应该打骂孩子。要先和老师好好分析沟通一下，尽可能寻找出问题的缘由来。孩子不会凭空出现问题。出现问题一定是有一些长期积淀的症结没得到解决，或是有某个外在因素使一些小问题恶化。",
    //   "face_picture": "https://small-programs.oss-cn-beijing.aliyuncs.com//zuoye/images/test/1572511786_f87f4b7350e148e5be7ac386b3e9536c_94.jpg",
    //   "picturePreview": "https://small-programs.oss-cn-beijing.aliyuncs.com//zuoye/images/test/1572511786_f87f4b7350e148e5be7ac386b3e9536c_94.jpg",
    //   "viewNum": 6267,
    //   "praiseNum": 4
    // }, {
    //   "id": 1202,
    //   "prevID": 1206,
    //   "nextID": 1200,
    //   "saying": "每日金句",
    //   "dateY": "2019",
    //   "dateF": "November",
    //   "dateD": "05",
    //   "dateLabel": "2019.11.05",
    //   "authorName": "尹建莉1",
    //   "content": "家长即使从家长会上发现孩子学习退步，不守纪律，和同学打架，甚至旷课等严重问题，回家后也不应该打骂孩子。要先和老师好好分析沟通一下，尽可能寻找出问题的缘由来。孩子不会凭空出现问题。出现问题一定是有一些长期积淀的症结没得到解决，或是有某个外在因素使一些小问题恶化。",
    //   "isPraise": 0,
    //   "shareType": 2,
    //   "shareTitle": "家长即使从家长会上发现孩子学习退步，不守纪律，和同学打架，甚至旷课等严重问题，回家后也不应该打骂孩子。要先和老师好好分析沟通一下，尽可能寻找出问题的缘由来。孩子不会凭空出现问题。出现问题一定是有一些长期积淀的症结没得到解决，或是有某个外在因素使一些小问题恶化。",
    //   "face_picture": "https://small-programs.oss-cn-beijing.aliyuncs.com//zuoye/images/test/1572511786_f87f4b7350e148e5be7ac386b3e9536c_94.jpg",
    //   "picturePreview": "https://small-programs.oss-cn-beijing.aliyuncs.com//zuoye/images/test/1572511786_f87f4b7350e148e5be7ac386b3e9536c_94.jpg",
    //   "viewNum": 6267,
    //   "praiseNum": 5
    // }, {
    //   "id": 1202,
    //   "prevID": 1206,
    //   "nextID": 1200,
    //   "saying": "每日金句",
    //   "dateY": "2019",
    //   "dateF": "November",
    //   "dateD": "05",
    //   "dateLabel": "2019.11.05",
    //   "authorName": "尹建莉2",
    //   "content": "家长即使从家长会上发现孩子学习退步，不守纪律，和同学打架，甚至旷课等严重问题，回家后也不应该打骂孩子。要先和老师好好分析沟通一下，尽可能寻找出问题的缘由来。孩子不会凭空出现问题。出现问题一定是有一些长期积淀的症结没得到解决，或是有某个外在因素使一些小问题恶化。",
    //   "isPraise": 0,
    //   "shareType": 2,
    //   "shareTitle": "家长即使从家长会上发现孩子学习退步，不守纪律，和同学打架，甚至旷课等严重问题，回家后也不应该打骂孩子。要先和老师好好分析沟通一下，尽可能寻找出问题的缘由来。孩子不会凭空出现问题。出现问题一定是有一些长期积淀的症结没得到解决，或是有某个外在因素使一些小问题恶化。",
    //   "face_picture": "https://small-programs.oss-cn-beijing.aliyuncs.com//zuoye/images/test/1572511786_f87f4b7350e148e5be7ac386b3e9536c_94.jpg",
    //   "picturePreview": "https://small-programs.oss-cn-beijing.aliyuncs.com//zuoye/images/test/1572511786_f87f4b7350e148e5be7ac386b3e9536c_94.jpg",
    //   "viewNum": 6267,
    //   "praiseNum": 5
    // }
    ],
    loading: false, //加载中
    formData: {
      article_id: '',
      page_num: 1,
      page_size: 10
    },
    over: false, //数据全部请求完毕为true
    current: 0, //滑块所在的index
    mask: false, //首次展示遮罩层
    openSetting: false, //首次授权拒绝，然后显示打开设置信息的按钮



    globalShow: 1,
    comm_title: '精选留言', //公共评论标题
    pageType: 2,
    have_title: true, //公共评论是否有title
    have_hand: true, //公共评论是否有赞
    download_file: 'http://task.zmedc.com/upload/20180620/ff5f02209e081e914c405c28450aa19c_6907.png',
    id: 0, //详情id
    pageSize: 20,
    page: 1,
    hasMoreData: true,

    //悬浮控件参数
    musicFlex: false,
    musicPlay: true,
    music_id: 0,
    nowtime: '0:00',
    userPlaySecond: 0,
    audiotime: '0:00',
    courseTitle: '',
    scrollTopVal: -1, //悬浮框滚动显示、隐藏参数
    mask520: false
  },
  // 右划触发函数
  sentenceChange(e) {
    console.log(e.detail.current, 'current', this.data)
    const current = e.detail.current;
    this.setData({
      current
    })
    this.selectComponent("#comment").getList();
    if (current >= this.data.list.length - 2) {
      if(!this.data.over){
        this.getSentenceList('add');
      }else{

      }
      
    }

  },
  // 金句点赞
  like(e) {
    let action_type = e.currentTarget.dataset.like;
    let current = e.currentTarget.dataset.current;
    action_type = (action_type == 1 ? 2 : 1);
    const formData = {
      identify_id: this.data.list[current].article_id,
      identify_type: 3,
      action_type,
    }
    network.request('likeAction', formData, data => {

      const zanStr = `list[${current}].is_zan`;
      const numStr = `list[${current}].zan_num`;
      this.setData({
        [zanStr]: data.is_zans,
        [numStr]: data.zan_num
      })
    })
  },


  // 获取金句list
  getSentenceList(add) {
    // 正在进行请求时，锁住
    if (this.data.loading) {
      return false;
    }
    this.setData({
      loading: true
    })
    network.request('getSentenceList', this.data.formData, data => {
      // 获取原始数据（列表已有数据）
      let list = this.data.list;
      // 获取心情求的数据newData
      let newData = data.goldsay_desc;
      // 如果是下拉请求更多的话  拼接原始数据
      if(add){
        newData = list.concat(newData)
      }
      console.log(newData,"newData")
      this.data.formData.page_num++
      // 如果新的数据小于当前分页数量 设置下拉数据以为空  over为true
      if (data.length < this.data.formData.page_size) {
        this.setData({
          over: true
        });
      }
      // 设置数据
      this.setData({
        list: newData,
        loading: false,
      });
    }, error => {
      this.setData({
        loading: false
      })
    })
  },
  // 我知道了
  iKnow: function () {
    wx.setStorageSync('is_know', 1)
    this.setData({
      mask: false
    })
  },
  // 下载当前金句图片图片函数
  downloadImg() {
    wx.showLoading({
      title: '图片下载中...',
      mask:true
    })
    const pages = getCurrentPages() //获取加载的页面
    const currentPage = pages[pages.length - 1] //获取当前页面的对象
    const url = currentPage.route //当前页面url
   
    const options = currentPage.options 
    console.log(url, options)		
    let path = shareData.getUrl(options);
    console.log(path,'path')
    const article_id = this.data.list[this.data.current].article_id;
    const formData = { 
      article_id ,
      path
      }
    network.request("getSentencePicture", formData ,data=>{
        app.saveImg(data.picture)
      console.log(data)
    })
    const imgSrc = this.data.list[this.data.current].face_picture;
    
  },
  // saveImg(url){
  //   wx.showLoading({
  //     title: '保存图片中...',
  //     mask: true
  //   })
  //   wx.downloadFile({
  //     url,
  //     success: function (res) {
  //       console.log(res);
  //       //图片保存到本地
  //       wx.saveImageToPhotosAlbum({
  //         filePath: res.tempFilePath,
  //         success: function (data) {
  //           console.log(data);
  //           wx.showToast({
  //             title: '已保存到相册',
  //             icon:"success"
  //           })
  //         },
  //         fail: function (err) {
  //           console.log(err);
  //           wx.showToast({
  //             title: '图片保存失败，请重新保存',
  //             icon: "none"
  //           })
  //         }
  //       })
  //     },fail(){
  //       wx.showToast({
  //         title: '图片下载失败，请重新下载',
  //         icon: "none"
  //       })
  //     }
  //   })
  // },
  // 判断是否授权保存图片
  save() {
    const that = this;
    wx.getSetting({
      success(res) {
        console.log('res', res)
        console.log(res.authSetting['scope.writePhotosAlbum'])
        if (res.authSetting['scope.writePhotosAlbum']) {
          console.log('已授权')
          that.downloadImg()
        } else {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
              that.downloadImg()
            },
            fail(err) {
              console.log(err)
              wx.showModal({
                content: "请先授权",
                showCancel: false,
                success() {}
              })
              that.setData({
                openSetting: true
              })

            }
          })
        }
      }

    })
  },
  // 打开设置页面
  openSetting() {
    const that = this;
    wx.openSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.writePhotosAlbum']) {
          console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
          console.log(that)
          that.setData({
            openSetting: false
          })
          that.downloadImg()
        } else {
          console.log('获取权限失败，给出不给权限就无法正常使用的提示')
        }
      },
      complete(err) {
        console.log(err)
      }
    })
  },
  /**
     * 去金句列表
     */
  gotoList: function () {
    const length = getCurrentPages().length;
    if (length >= 2 && getCurrentPages()[length - 2].route =="pages/good-sentence-list/index"){
      router.navigateBack();
      return;
    }
    router.redirect({
      path: 'pages/good-sentence-list/index',
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.scene){
      this.setData({
        'formData.scene': options.scene
      })
    }
    if (options.id){
      this.setData({
        'formData.article_id': options.id
      })
    }
    
    let unionid = wx.getStorageSync('unionid');
    if (unionid) {
      this.getSentenceList();
    } else {
      getCode.login().then(res => {
        console.log("code：", res)
        this.getSentenceList();
      })
    }
    const is_know = wx.getStorageSync('is_know');
    console.log(is_know, 'is_know')
    if (is_know != 1) {
      this.setData({
        mask: true
      })
    }
   
   
    
  },
  // 评论加载完毕
  commentOver(){
    this.setData({
      commentOver:true
    })
  },
  // 触底
  onReachBottom: function () {
    if (this.data.commentOver) {
      // wx.showToast({
      //   icon: 'success',
      //   title: '已加载全部',
      // })
    } else {
      if(this.data.list[this.data.current].article_id){
        this.selectComponent("#comment").getList("add");
      }
      
    }

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
    //wx.hideShareMenu();
    // app.getNavigateInfo(this);
    //增加悬浮音频控件
    // app.getSuspend(this);
    // app.AudioManagerOverAllInit(this, null, null);
    if (this.data.list[this.data.current]) {
      this.selectComponent("#comment").getList("add");
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    const data = this.data.list[this.data.current];
    const obj = {
      title:data.intro, 
      paramsFrom:{ id: data.article_id },
      imageUrl: data.share_picture
    }
    
    return network.share(obj);
  },


})