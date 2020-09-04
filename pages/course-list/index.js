// pages/course/course.js
const app = getApp();
import network from '../../utils/network';
const router = require('../../utils/router.js');
let globalCourseAudioManager = app.backgroundAudioManager;
Page({

  data: {
    isIpx: app.globalData.isIpx,
    navHeight: app.globalData.navHeight,
    page_size:1000,
    
    page_num:1,
    camp_times_id:'',
    list: [
     
      ]

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.list.length) {
      this.courseStatus(this.data.list)
    }
  },
  

  /**
   * 用户点击右上角分享
   */
  // 转发
  onShareAppMessage: function(res) {
    
    // var open_type = -1
    // var shareImg = this.data.shareImg
    // var shareTitle = this.data.shareTitle
    // var id = this.data.shareId
    // var select = this.data.shareSelect
    // if (parseInt(select) == 1) {
    //   open_type = 1
    // }
    // if (parseInt(select) == 2) {
    //   open_type = 2
    // }
    // return {
    //   title: shareTitle,
    //   imageUrl: shareImg,
    //   path: "/pages/course/course?open_type=" + open_type + "&course_info_id=" + id + "&select=" + select,
    //   success: function(res) {
    //     console.log('转发成功')

    //   },
    //   fail: function(res) {
    //     // 转发失败
    //   }
    // }
  },

  /**
   * 获取列表
   * camp_times_id=timeslZRU2EBHveWI&id=speclZqdbPN7AjCE&is_enable=1
   * camp_times_id=timeslZqEAOrPQVod
   */
  getCourseList: function(course_info_id) {
    const params={...this.data.options,...{
      page_size: this.data.page_size,
      page_num: this.data.page_num,
    }}
    console.log(params)
    network.request('userCampTimesCourseList',params,res=>{
      console.log(res)
      this.courseStatus(res.list)
      this.setData({
        list:res.list
      })
    })
    
    
  },
  // 播放状态
  courseStatus(list) {
    console.log("查看全局状态", app.globalData)
    const camp_times_id = app.globalData.camp_times_id;
    const spec_column_id = app.globalData.spec_column_id;
    const course_id = app.globalData.course_id;
    const onPlay = app.globalData.onPlay;
    if (spec_column_id == this.data.options.spec_column_id) {
      list.forEach(item => {
        item.courseData.forEach(subItem=>{
          subItem.play = false;
          subItem.onPlay = false;
          if(subItem.course_id == course_id) {
            subItem.play = true;
            subItem.onPlay = onPlay;
        }
        })
        
      })
    }
    this.setData({
      list: list
    })
  },
  // 跳转课程详情
  goCourseDetail(e){
   
    const course_id = e.currentTarget.dataset.course_id;
    const camp_times_id = e.currentTarget.dataset.camp_times_id
    const spec_column_id = e.currentTarget.dataset.spec_column_id
    router.navigate({
      path: `pages/course-details/index?course_id=${course_id}&spec_column_id=${spec_column_id}&camp_times_id=${camp_times_id}`
    })
  },
  /**
   * 跳转详情
   */
  // study: function(e) {
  //   var id = e.currentTarget.dataset.id //音频的id
  //   var courseDate = e.currentTarget.dataset.coursedate
  //   var course_id = e.currentTarget.dataset.course_id //核心课的id
  //   var course_day = e.currentTarget.dataset.courseday //课程Day
  //   var audio_type = e.currentTarget.dataset.audiotype //播放类型
  //   var play_audio_url = e.currentTarget.dataset.playaudiourl //音频地址
  //   var play_video_url = e.currentTarget.dataset.playvideourl //视频地址
  //   app.listening_mode = 1
  //   if (parseInt(audio_type) == 2) {
  //     this.setData({
  //       courseDayShow: false,
  //     })
  //     app.courseDayShow = false
  //   }
  //   if (parseInt(audio_type) == 1) {
  //     if (course_day == '0') {
  //       this.setData({
  //         courseDayShow: false,
  //       })
  //       app.courseDayShow = false
  //     } else {
  //       this.setData({
  //         courseDay: course_day,
  //         courseDayShow: true,
  //       })
  //       app.courseDay = course_day
  //       app.courseDayShow = true
  //     }
  //   }

  //   wx.navigateTo({
  //     url: '../../365course/pages/course_detail/course_detail?id=' + id + '&courseDate=' + courseDate + "&course_id=" + course_id + "&audioType=" + audio_type + "&playAudioUrl=" + play_audio_url + "&playVideoUrl=" + play_video_url + '&headerImg=' + this.data.shareImg,
  //   })
  // },



  //获取当前时间，格式YYYY-MM-DD
  // getNowFormatDate: function() {
  //   var date = new Date();
  //   var seperator1 = "-";
  //   var year = date.getFullYear();
  //   var month = date.getMonth() + 1;
  //   var strDate = date.getDate();
  //   if (month >= 1 && month <= 9) {
  //     month = "0" + month;
  //   }
  //   if (strDate >= 0 && strDate <= 9) {
  //     strDate = "0" + strDate;
  //   }
  //   var currentdate = year + seperator1 + month + seperator1 + strDate;
  //   return currentdate;
  // },

  //登陆
  // login: function(e) {
  //   wx.navigateTo({
  //     url: '../poster_login/poster_login',
  //   })
  // },





  //悬浮标题点击跳详情页
  // gotoDetail: function(e) {
  //   var id = e.currentTarget.dataset.id;
  //   var course_id = e.currentTarget.dataset.course_id;
  //   wx.navigateTo({
  //     url: '../../365course/pages/course_detail/course_detail?id=' + id + "&course_id=" + course_id + "&audioType =1" + '&headerImg=' + this.data.shareImg,

  //   })
  // },
  // 播放函数
  // btnPlay: function(e) {
  //   const that = this;

  //   const id = e.currentTarget.dataset.id;
  //   var courseTitle = e.currentTarget.dataset.coursetitle;
  //   var playAudioUrl = e.currentTarget.dataset.playaudiourl;
  //   var audioSecondMinute = e.currentTarget.dataset.audiosecond;
  //   var course_day = e.currentTarget.dataset.courseday //课程Day
  //   var audio_type = e.currentTarget.dataset.audiotype //播放类型
  //   app.is_calculate = false;
  //   app.listening_mode = 1;
  //   const headerImg = that.data.headerNowImg;
  //   app.headerImg = that.data.headerNowImg;
  //   if (that.data.select == 1) {
  //     if (parseInt(audio_type) == 2) {
  //       that.setData({
  //         courseDayShow: false,
  //       })
  //       app.courseDayShow = false
  //     }
  //     if (parseInt(audio_type) == 1) {
  //       if (course_day == '0') {
  //         that.setData({
  //           courseDayShow: false,
  //         })
  //         app.courseDayShow = false
  //       } else {
  //         that.setData({
  //           courseDay: course_day,
  //           courseDayShow: true,
  //         })
  //         app.courseDay = course_day
  //         app.courseDayShow = true
  //       }
  //     }
  //   } else {
  //     that.setData({
  //       courseDayShow: false,
  //       courseDay: '0'
  //     })
  //     app.courseDay = '0'
  //     app.courseDayShow = false
  //   }

  //   that.setData({
  //     headerImg,
  //     music_id: id,
  //     courseTitle: courseTitle,
  //     playAudioUrl: playAudioUrl,
  //     audioSecondMinute: audioSecondMinute
  //   })

  //   //28天核心课程
  //   if (parseInt(that.data.select) == 1) {
  //     app.AudioManagerOverAllPlay(this, this.refeshMainData());
  //   }
  //   // 精品免费课
  //   if (parseInt(that.data.select) == 2) {
  //     app.AudioManagerOverAllPlay(this, this.refreshFreeData());
  //   }

  // },

  // musicPlay: function() {
  //   app.AudioManagerOverAllmusicPlay(this);
  // },

  // musicClosed() {
  //   app.closeMusicPlayer(this);
  // },

  // scroll: function(e) {
  //   app.showAudioFrame(e, this, true);
  // },


  // refreshFreeData: function() {
  //   var that = this;
  //   var freelist = that.data.courseList;
  //   var music_id = that.data.music_id;
  //   if (freelist.length > 0) {
  //     freelist.forEach(function(item, index) {
  //       item.courseList.forEach(function(subitem, subindex) {
  //         item.courseList[subindex].isPlayStatus = false;
  //         if (music_id == subitem.id) {
  //           item.courseList[subindex].isPlayStatus = true;
  //         }
  //       });
  //     });
  //   }
  //   that.setData({
  //     courseList: freelist,
  //   })
  // },

  // refeshMainData: function() {
  //   var that = this;
  //   var mainlist = that.data.courseList;
  //   var music_id = that.data.music_id;
  //   if (mainlist.length > 0) {
  //     mainlist.forEach(function(item, index) {
  //       item.courseList.forEach(function(subitem, subindex) {
  //         item.courseList[subindex].isPlayStatus = false;
  //         if (music_id == subitem.id) {
  //           item.courseList[subindex].isPlayStatus = true;
  //         }
  //       });
  //     });
  //   }
  //   that.setData({
  //     courseList: mainlist,
  //   })
  // },
  scroll(){},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.setData({
      options
    })
    this.getCourseList()
    // wx.showLoading({
    //   title: '加载中…',
    // })
    // var that = this

    // // 扫描带参数 小程序二维码 scene 是  来源的 openid
    // if (typeof options != 'undefined' && options.scene) {
    //   options.course_info_id = options.scene;
    // }

    // var select = options.select;
    // var course_info_id = options.course_info_id;

    // that.setData({
    //   shareId: course_info_id,
    //   shareSelect: select,
    // })


    // that.setData({
    //   course_info_id: course_info_id
    // })
    // if (parseInt(select) == 1) {
    //   that.setData({
    //     select: select,
    //   })
    // }
    // if (parseInt(select) == 2) {
    //   that.setData({
    //     select: select,
    //   })
    // }

  },
  onUnload: function () {//如果页面被卸载时被执行
    console.log("页面卸载")
  },

  // selectFree: function(course_info_id) {
  //   var that = this;
  //   var music_id = 0;
  //   if (app.globalData.musicObj) {
  //     music_id = app.globalData.musicObj.id
  //   }
  //   app.server.getJSON('edu_course_content/free_list', {
  //     size: 999,
  //     course_info_id: course_info_id,
  //     course_time_desc: 1
  //   }, function(res) {
  //     var results = res['results'];
  //     that.setData({
  //       headerNowImg: res.extraInfo.coursePictre,
  //       shareImg: res.extraInfo.coursePictre,
  //       shareTitle: res.extraInfo.courseTitle,
  //       loadComplete: true
  //     })
  //     results.forEach(function(currentValue, index) {
  //       currentValue.courseList.forEach(function(subCurrentValue, subindex) {
  //         var value = subCurrentValue.audioSecond
  //         var nowtime_s = value % 60
  //         var nowtime_m = (value - nowtime_s) / 60
  //         nowtime_s = Math.floor(nowtime_s)
  //         if (nowtime_s < 10) {
  //           var nowtime = nowtime_m + ':' + '0' + nowtime_s
  //         } else {
  //           var nowtime = nowtime_m + ':' + nowtime_s
  //         }
  //         results[index].courseList[subindex].minutes = nowtime


  //         currentValue.courseList[subindex].isPlayStatus = false
  //         subCurrentValue.audioSecond = app.func.sec_to_time(subCurrentValue.audioSecond)
  //         //当前选择的音乐和播放器歌曲id一致   播放状态true
  //         if (music_id == subCurrentValue.id) {
  //           currentValue.courseList[subindex].isPlayStatus = true;



  //         }
  //       })
  //     })
  //     that.setData({
  //       courseList: results,
  //       loadComplete: true
  //     })
  //     wx.hideLoading()
  //   });
  // },
})