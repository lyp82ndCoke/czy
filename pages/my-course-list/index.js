// 我的课程
import network from '../../utils/network';
const router = require('../../utils/router.js');
const app = getApp()
let globalCourseAudioManager = app.backgroundAudioManager;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicplayer: true,
    playOrPause: false,
    getPlayer: true,
    musicHead: {},
    id: '',
    list:[],

    //悬浮控件参数 没用
    musicFlex: false,
    musicPlay: true,
    courseTitle: '',
    nowtime: '0:00',
    audiotime: '0:00',
    start: false,
    playEnd: true,
    perCentage: 0,
    currentId: 0,
    user_course_id: 0,
    courseDay: '0',
    courseDayShow: false,
    headerImg: '',
    scrollTop: 0,
    showFootInfo: true,
    scrollTopVal: -1, //悬浮框滚动显示、隐藏参数
  },

  //跳转播放详情页
  // getMusicInfo(e) {
  //   let id = e.currentTarget.dataset.id;
  //   let cid = e.currentTarget.dataset.cid;
  //   var audio_type = e.currentTarget.dataset.audiotype //播放类型
  //   var play_audio_url = e.currentTarget.dataset.playaudiourl //音频地址
  //   var play_video_url = e.currentTarget.dataset.playvideourl //视频地址
  //   app.product_type = 5
  //   // console.log(this.data.shareImg +"this.data.shareImgthis.data.shareImg")
  //   // console.log('音频id----'+id);
  //   // console.log('课程id----'+cid);
  //   wx.navigateTo({
  //     url: '../course_detail/course_detail?id=' + id + '&course_id=' + cid + '&audioType=' + audio_type + '&playAudioUrl=' + play_audio_url + '&playVideoUrl=' + play_video_url + '&headerImg=' + this.data.shareImg
  //   })
  // },
  // goToGoodsPage(goodsType, goods_id) {
  //   switch (goodsType) {
  //     case '5':
  //       wx.redirectTo({
  //         url: "../../../revisionPackage/pages/train_product/train_product?id=" + goods_id
  //       })
  //       break;
  //     case '6':
  //       wx.redirectTo({
  //         url: "../../../ revisionPackage/pages/learn_card/learn_card?id=" + goods_id
  //       })
  //       break;
  //     case '7':
  //       wx.redirectTo({
  //         url: "../../../revisionPackage/pages/goods_dta/goods_dta?id=" + goods_id
  //       })
  //       break;
  //     case '8':
  //       wx.redirectTo({
  //         url: "../../../revisionPackage/pages/series_dta/series_dta?id=" + goods_id
  //       })
  //       break;
  //     default:
  //       wx.reLaunch({
  //         url: "../../../pages/home_page/index"
  //       })
  //       break;
  //   }
  // },

  //获取播放列表音频信息
  // getDataList() {
  //   var that = this;
  //   let data = {}
  //   var goods_id = this.data.goodsId
  //   var goodsType = this.data.goodsType
  //   data.course_info_id = this.data.id
  //   data.course_time_desc = 1
  //   let selectIdex;
  //   var music_id = 0;
  //   if (app.globalData.musicObj) {
  //     music_id = app.globalData.musicObj.id
  //   }
  //   app.server.getJSON('edu_course_info/content_list', data, res => {
  //     res.results.forEach(function (item, index) {
  //       res.results[index].isPlayStatus = false
  //       item.audioSecond = app.func.sec_to_time(item.audioSecond)
  //       //当前选择的音乐和播放器歌曲id一致   播放状态true
  //       if (music_id == item.id) {
  //         res.results[index].isPlayStatus = true
  //         selectIdex = index;
  //       }
  //     })

  //     const scrollTop = selectIdex ? selectIdex * 130 : 0;
  //     // console.log('滚动条位置：',scrollTop)
  //     that.setData({
  //       musicList: res.results,
  //       scrollTop
  //     })
  //     var musicList = that.data.musicList
  //     var userCourseAudioIds = []
  //     musicList.forEach((item, index) => {
  //       userCourseAudioIds.push(item.id)
  //     })
  //     app.userCourseAudioIds = userCourseAudioIds
  //     // console.log(userCourseAudioIds +'排期课程ids')
  //     wx.hideLoading()
  //     //获取购买状态
  //     var isPay = res.extraInfo.isPay
  //     // console.log ('isPay')
  //     // console.log(isPay)
  //     // console.log('opentype')
  //     // console.log(this.data.open_type)
  //     if (parseInt(isPay) == 0) {
  //       //买后开放所有
  //       var userInfo = wx.getStorageSync('userInfo')
  //       if (typeof userInfo == 'object') {
  //         if (parseInt(goods_id) > 0) {
  //           that.goToGoodsPage(goodsType, goods_id);
  //         } else {
  //           wx.showModal({
  //             content: '您没有此听课权限',
  //             showCancel: false,
  //             success(res) {
  //               if (res.confirm) {
  //                 that.goToGoodsPage(goodsType, goods_id);
  //               }
  //             }
  //           })
  //         }
  //       }
  //     }
  //   })
  // },
  

  //获取头部信息栏信息(更新课时和总课时)
  getDataHead() {
    let data = {}
    data.course_info_id = this.data.id
    app.server.getJSON('edu_course_info/my_detail', data, res => {
      this.setData({
        musicHead: res.results,
        shareImg: res.results.coursePicturePreview,
        shareTitle: res.results.courseTitle,
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const spec_column_id = options.spec_column_id;
    const camp_times_id = options.camp_times_id;
    this.setData({
      spec_column_id,
      camp_times_id
    })
    this.getList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   if(this.data.list.length){
     this.courseStatus(this.data.list)
   }
  },
  getList(){
    const params = {
      spec_column_id: this.data.spec_column_id,
      camp_times_id: this.data.camp_times_id ? this.data.camp_times_id :"",
      page_size:1000,
      page_num:1
    }
    network.request("userCampTimesCourseList",params,res=>{
      console.log(res,'res');
      this.courseStatus(res.list)
      this.setData({
        list:res.list,
        musicHead: res.columnInfo
      })
    })
  },
  // 播放状态
  courseStatus(list){
    const camp_times_id = app.globalData.camp_times_id;
    const spec_column_id = app.globalData.spec_column_id;
    const course_id = app.globalData.course_id;
    const onPlay = app.globalData.onPlay;
    if (spec_column_id == this.data.spec_column_id){
      list.forEach(item=>{
        item.play = false;
        item.onPlay = false;
        if (item.course_id == course_id){
          item.play = true;
          item.onPlay = onPlay;
        }
      })
    }
    this.setData({
      list: list
    })
  },
  // 跳转播放详情页面
  goDetail(e){
    const course_id = e.currentTarget.dataset.course_id;
    const spec_column_id = this.data.spec_column_id;
    const camp_times_id = this.data.camp_times_id||"";
    console.log(camp_times_id)
    console.log('跳转')
    router.navigate({
      path: `pages/course-details/index?course_id=${course_id}&spec_column_id=${spec_column_id}&camp_times_id=${camp_times_id}`
    })
  },

  // onPageScroll: function (e) {
  //   app.showAudioFrame(e,this);
  // },
  scroll(e) {
    app.showAudioFrame(e, this, true);
  },
  //播放函数
  btnPlay: function (e) {
    var that = this;
    var course_id = e.currentTarget.dataset.course_id;
    var courseTitle = e.currentTarget.dataset.coursetitle;
    var playAudioUrl = e.currentTarget.dataset.playaudiourl;
    var audioSecondMinute = e.currentTarget.dataset.audiosecond;
    var headerImg = that.data.shareImg;
    app.is_calculate = false
    app.listening_mode = 1
    app.product_type = 5
    app.headerImg = headerImg
    that.setData({
      headerImg,
      music_id: course_id,
      courseTitle: courseTitle,
      playAudioUrl: playAudioUrl,
      audioSecondMinute: audioSecondMinute
    })
    app.AudioManagerOverAllPlay(this, this.refreshData())

  },

  musicPlay: function () {
    app.AudioManagerOverAllmusicPlay(this)
  },

  //关闭即隐藏
  musicClosed() {
    app.closeMusicPlayer(this)
  },

  //刷新列表(getDataList刷新方式请求接口太慢)
  refreshData: function () {
    var that = this;
    var list = that.data.musicList;
    var music_id = that.data.music_id;
    if (list.length > 0) {
      list.forEach(function (item, index) {
        list[index].isPlayStatus = false;

        if (music_id == item.id) {
          list[index].isPlayStatus = true
        }
      });
    }

    that.setData({
      musicList: list
    })
  },

  //悬浮标题点击跳详情页
  gotoDetail: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var course_id = e.currentTarget.dataset.course_id;
    app.product_type = 5
    wx.navigateTo({
      url: '../course_detail/course_detail?id=' + id + "&course_id=" + course_id + "&audioType =1" + '&headerImg=' + this.data.shareImg,

    })
  },

  // //用户分享
  // onShareAppMessage: function (res) {
  //   var that = this
  //   var shareImg = that.data.shareImg
  //   var shareTitle = that.data.shareTitle
  //   var id = that.data.id
  //     return {
  //       title: shareTitle,
  //       imageUrl: shareImg,
  //       path: "/365course/pages/categeory_list/index?open_type=3&id="+id,
  //       success: function (res) {
  //         // console.log('转发成功')

  //       },
  //       fail: function (res) {
  //         // 转发失败
  //       }
  //     }
  // },

})