const md5 = require('../utils/md5.js')
const app = getApp();
// console.log(app)
/* 
 url:网络请求的url
 params:请求参数
 success:成功的回调函数
 fail：失败的回调
*/
// /* 测试环境 */
var apiHost = 'https://zdata.zmedc.com/edugrown';
/* 正式环境 */
// var apiHost = 'https://xiao.zmedc.com/edugrown';

// 抖音订单host
const orderHost = "https://xdata.zmedc.com";

const logsHost = 'https://xdata.zmedc.com/api/baselog/put_log_data';
const Promise = require('../utils/es6-promise.min.js')

const appId = 'wxd871c7e8d45490d8';

const apiMap = {
  // 获取用户Unionid
  getUnionid: "/User/getUnionid",
  // 更新用户信息
  saveUserInfo: '/User/saveUserInfo',
  // 首页
  getHome: "/Index/Index",
  // 金句详情list
  getSentenceList: '/Goldsay/goldsay_desc',
  // 保存金句图片
  getSentencePicture: '/Goldsay/keep_goldsay_picture',
  // 更多金句列表
  getMoreGoldsay: '/Goldsay/more_goldsay',
  // 群聊/好文详情
  getArticleDesc: '/Article/article_desc',
  // 收藏公共接口
  collectAction: "/Action/collectAction",
  // 点赞公共接口
  likeAction: "/Action/zanAction",
  // 精选留言
  getComment: "/Comment/choice_comments",
  // 公共留言接口
  addComment: "/Comment/comment_index",
  // 评论接口
  insertComment: "/Action/insertComment",
  // 课程详情列表
  userCampTimesCourseList: "/Camptimes/userCampTimesCourseList",
  // 课程详情
  getCourseDetails: "/Course/courseDetails",
  // 课程评论列表
  getCourseComment: "/Comment/getComment",
  // 月度展示页(有日历的那个页面)
  getUserSignLog: "/Sign/getUserSignLog",
  // 正在参加的训练营list
  getUserCampTimesList: "/Camptimes/userCampTimesList",
  // 全部课程list
  getAllCampData: '/Allcamp/allCampData',

  // 获取签到问题
  getQuestionByDate: "/Question/getQuestionByDate",
  // 提交答案
  submitAnswer: "/Question/submitAnswer",
  // 成长墙list
  GrouthwallList: "/Grouthwall/GrouthwallList",
  // 成长墙详情
  GrouthwallDetails: "/Grouthwall/GrouthwallDetails",

  // 删除成长墙
  delGrouthWall: "/Grouthwall/delGrouthWall",
  // 发布心得
  releaseGrouthwall: "/Grouthwall/releaseGrouthwall",

  // 个人中
  // 我的资料
  // 菜单红点显示
 menuNotice:"/User/menuNotice",
  myInfo: "/User/myInfo",
  // 我的课程
  myColumnList: "/Course/ColumnList",
  // 专栏课程列表
  specColumnList: "/Column/specColumnList",
  // 我的订单
  myOrderList: "/User/orderList",
  // 使用帮助
  Usehelp: "/Usehelp/usehelp_list",
  getCampTimesSignList: "/Sign/getCampTimesSignList",
  // 我的收藏
  getUserCollectList: "/Action/getUserCollectList",
  // 调查问卷列表
  getQuestionaireList:"/Questionnaire/getQuestionaireList",
  // 获取问卷详情
  getQuestionnaire: "/Questionnaire/getQuestionnaire",
  // 问卷二维码
  shareQRcode:"/Questionnaire/shareQRcode",
  // 提交问卷
  submitQuestionnaire:"/Questionnaire/submitQuestionnaire",
  // 公号关注信息
  getSubStatus: "/User/getUserOfficialList",
  // 解密用户getUnionidIv
  getUnionidIv: "/User/userAuth",
  // 发送验证码
  sendSms:"/Action/sendSms",
  // 验证验证码
  checkSms: "/Action/checkSms",
  
  // 任务日历页
  getTaskCalendar: '/times_task/getTimesTaskInfo',
  // 任务日历页中的某天任务列表
  selectDayList: '/times_task/getTaskList',
  // 某天任务的示例
  getTaskContentExampleList: "/times_task/getTaskContentExampleList",

  // 我的任务页-表头
  userTaskInfo: "/times_task/userTaskInfo",
  // 我提交的任务列表
  userTaskList: "/times_task/userTaskList",
  // 我的任务分享页
  taskShareIndex: "/TimesTask/rankShareIndex",
  // 提交任务
  submitTask: "/times_task/submitTask",
  // 任务设为公开 
  taskSubmitSetOpen: "/times_task/taskSubmitSetOpen",
  // 任务分享落地页
  taskShareOpenInfo: "/times_task/taskShareOpenInfo",
  
  // 赛区首页任务
  campTaskList: "/task_user_submit/CampTaskList",
  // 当前用户赛区排名信息
  userRankList: "/task_user_submit/TaskView",
  // 赛区排名信息(最热、最新、精选)
  taskRankingData: "/task_user_submit/TaskRankingData",
  // 赛区任务点赞
  matchLike: "/action/zanAction",
  // 任务详情个人
  userSubmitData: "/TaskUserSubmit/UserSubmitData",
  // 赛区任务数据
  taskData: "/task_user_submit/TaskData",
  // 赛区任务浏览量增加
  addTaskView: "action/addTaskView",
  // 赛区任务评论列表
  getMatchComment: "/comment/getComment",
  // 赛区任务添加评论
  insertComment: "/action/insertComment",
  // 赛区提交任务详情
  UserSubmitData: "/task_user_submit/UserSubmitData",
  // 每日任务
  everyDayTaskList: "/times_task/everyDayTaskList",
  // 查看每日任务详情
  everyDayTaskView: "/times_task/everyDayTaskView",

  // 排行榜首页
  taskRankIndex: "/times_task/rankIndex",
  // 排行榜列表
  winnersList: "/times_task/rankOrWinnersList",
  // 排行榜分享页
  rankShareIndex: "/times_task/rankShareIndex",
  // 奖品列表
  prizeLis: "/times_task/prizeList",

  // 任务分享
  shareTaskSubmit: "/times_task/shareTaskSubmit",

  // 测评列表
  campAssessList: "/times_assess/CampAssessList",
  // 试卷试题列表
  paperContentList: "/paper_content/PaperContentList",
  // 提交试卷
  submitPaper: "/times_assess/AssessUserSubmitPaper",
  // 测评报告
  getAssessReport: "/times_assess/getAssessReport",

  // 生成海报
  SharePosterPicture: "/Questionnaireshareposter/QuestionnaireSharePosterPicture",
  // 转发分享页详情
  ShareQuestionaire: "/Questionnaire/shareQuestionaire",
  userShareQuestion: "/Questionnaire/userShare",

  /**发送模板消息 */
  uploadFormId: "/User/addFormid", //收集模板消息formid









};
// 抖音订单核销请求
function requestOrder(apiKey, params, success, fail){
  let defaultParam = {
    appid: appId,
    //timestamp: Date.parse(new Date()) / 1000,
    version: '1.1.0',
    //os: 'mp',
    //channel: '',
  }
  // 解决部分iPhone用户微信本地数据库损坏
  defaultParam['unionid'] = wx.getStorageSync('unionid') || app.globalData.unionid;
  // defaultParam['unionid'] = wx.getStorageSync('unionid');
  defaultParam['openid'] = wx.getStorageSync('openid');
  defaultParam['nickname'] = wx.getStorageSync('userinfo')['nickname'];
  defaultParam['headimgurl'] = wx.getStorageSync('userinfo')['picture'];
  wx.request({
    url: orderHost + apiMap[apiKey],
    data: Object.assign({}, params, defaultParam),
    header: {
      'content-Type': 'application/json'
    },
    method: 'post',
    success: function (res) {
      // console.log("成功", apiKey, Object.assign({}, params, defaultParam), res);
      if (res.statusCode == 200) {
        const errorCode = res.data.code;
        if (errorCode == 200) {
          success(res.data.result);
          // wx.hideLoading();
        } else {
          let errorMsg = res.data.err_message;
          console.log('api error: ', apiKey, errorMsg, Object.assign({}, params, defaultParam));
          // wx.hideLoading();
          wx.showToast({
            icon: "none",
            title: res.data.msg,
          })
          console.log(res.data)
          fail(res.data);
        }
      } else {
        // wx.hideLoading();
        wx.showToast({
          title: '服务器错误，请稍后再试',
          icon: 'none'
        });
        fail('network 404');
      }
    },
    fail: function (res) {
      wx.showToast({
        title: '网络错误，请稍后再试',
        icon: 'none'
      })
      fail('network error');
    },
    complete: function (res) {

    }
  })
};
// 普通请求
function request(apiKey, params, success, fail) {
  const pages = getCurrentPages()                   //获取加载的页面
  let defaultParam = {
    appid: appId,
    //timestamp: Date.parse(new Date()) / 1000,
    version: '1.1.0',
    //os: 'mp',
    //channel: '',
  }
  if (apiKey != 'getUnionid') {
    // 解决部分iPhone用户微信本地数据库损坏
    defaultParam['unionid'] = wx.getStorageSync('unionid') || app.globalData.unionid;
    // defaultParam['unionid'] = wx.getStorageSync('unionid');
    console.log("defaultParam", defaultParam['unionid'], "globalData.unionid", app.globalData)
  }
  // 请求添加参数，数据埋点截取
  if (pages.length) {
    const currentPage = pages[pages.length - 1]     //获取当前页面的对象
    const pageUrl = currentPage.route               //当前页面url
    defaultParam['originpath'] = pageUrl
  }
  // defaultParam['shop_id'] = wx.getStorageSync('shopId');
  // console.log('params: ', params);
  // wx.showLoading({
  //   title: '获取数据中',
  //   icon: 'loading'
  // })
  wx.request({
    url: apiHost + apiMap[apiKey],
    data: Object.assign({}, params, defaultParam),
    header: {
      'content-Type': 'application/json'
    },
    method: 'post',
    success: function(res) {
      // console.log("成功", apiKey, Object.assign({}, params, defaultParam), res);
      if (res.statusCode == 200) {
        const errorCode = res.data.code;
        if (errorCode == 200) {
          success(res.data.result);
          // wx.hideLoading();
        } else {
          let errorMsg = res.data.err_message;
          console.log('api error: ', apiKey, errorMsg, Object.assign({}, params, defaultParam));
          // wx.hideLoading();
          wx.showToast({
            icon: "none",
            title: res.data.msg,
          })
          console.log(res.data)
          fail(res.data);
        }
      } else {
        // wx.hideLoading();
        wx.showToast({
          title: '服务器错误，请稍后再试',
          icon: 'none'
        });
        fail('network 404');
      }
    },
    fail: function(res) {
      wx.showToast({
        title: '网络错误，请稍后再试',
        icon: 'none'
      })
      fail('network error');
    },
    complete: function(res) {

    }
  })
}

// logs
function logsRequest(params, success, fail) {
  const pages = getCurrentPages() //获取加载的页面
  if (!pages.length) {
    return false;
  }
  const currentPage = pages[pages.length - 1] //获取当前页面的对象
  const url = currentPage.route //当前页面url
  let defaultParam = {
    appid: appId,
    version: '1.1.0',
    optype: "2", //页面访问国定为2    
  }
  defaultParam['unionid'] = wx.getStorageSync('unionid');
  defaultParam['openid'] = wx.getStorageSync('openid');
  console.log('发送数据: ', Object.assign({}, params, defaultParam));
  // wx.showNavigationBarLoading();
  wx.request({
    url: logsHost,
    data: Object.assign({}, params, defaultParam),
    header: {
      'content-Type': 'application/json'
    },
    method: 'post',
    success: function(res) {
      console.log(res);
      if (res.statusCode == 200) {
        let errorCode = res.data.code;
        if (errorCode == 0) {
          // success(res.data.data);
          wx.hideLoading();
        } else {
          let errorMsg = res.data.err_message;
          console.log('api error: ', errorMsg, Object.assign({}, params, defaultParam));
          // wx.hideLoading();

          // fail(res.data);
        }
      } else {
        // wx.hideLoading();
        // wx.showModal({
        //   content: 'api error' + logsHost,
        //   showCancel: false,
        //   success: function(res) {}
        // });
      }
      // wx.hideNavigationBarLoading()
    },
    fail: function(res) {
      // fail('network error');
      // wx.hideNavigationBarLoading()
    },
    complete: function(res) {
      // wx.hideNavigationBarLoading()
    }
  })
}
// 分享接口
/**
 * paramsFrom:参数
 * url:分享路径
 * title:分享title
 * imageUrl:分享图片
*/
function share(obj={}) {
  let datas={};
  let params = obj.paramsFrom || {};
  let query = {
    unionid: wx.getStorageSync('unionid')
  };
  const userinfo = wx.getStorageSync("userinfo");
  const nickname = userinfo.nickname;

  Object.assign(params, query);
  console.log("分享参数", params)
  let str = '';
  for (let val in params) {
    str += val + '=' + params[val] + '&';
  }
  // console.log(str)
  let pages = getCurrentPages() //获取加载的页面
  let currentPage = pages[pages.length - 1] //获取当前页面的对象

  const url =obj.url|| currentPage.route //当前页面url
  if (!pages.length) {
    return false;
  }
  
  let defaultParam = {
    appid: appId,
    version: '1.1.0',
    optype: "2", //页面访问国定为2  
    apipath: obj.apipath || "share_page",  
    apiparam: obj.apiparam || url
  }
  defaultParam['unionid'] = wx.getStorageSync('unionid');
  defaultParam['openid'] = wx.getStorageSync('openid');
  console.log('发送数据: ', Object.assign({}, params, defaultParam));
  // wx.showNavigationBarLoading();
  wx.request({
    url: logsHost,
    data: Object.assign({}, params, defaultParam),
    header: {
      'content-Type': 'application/json'
    },
    method: 'post',
    success: function (res) {
      console.log(res);
      if (res.statusCode == 200) {
        let errorCode = res.data.code;
        if (errorCode == 0) {
          wx.hideLoading();
        } else {
          let errorMsg = res.data.err_message;
          console.log('api error: ', errorMsg, Object.assign({}, params, defaultParam));
          // wx.hideLoading();

          // fail(res.data);
        }
      } else {
        // wx.hideLoading();
        wx.showModal({
          content: 'api error' + logsHost,
          showCancel: false,
          success: function (res) { }
        });
      }
      // wx.hideNavigationBarLoading()
    },
    fail: function (res) {
      // fail('network error');
      // wx.hideNavigationBarLoading()
    },
    complete: function (res) {
      console.log(res)
      // wx.hideNavigationBarLoading()
    }
  })
  datas.title = obj.title ? obj.title : `${nickname}邀请您一起培养好孩子`;
  console.log('str', str)
  datas.path = url + '?' + str;
  datas.imageUrl = obj.imageUrl ? obj.imageUrl : "https://zm-edu.oss-cn-beijing.aliyuncs.com/fixed_img/param_share_img/index_share_img.jpg"
  console.log(datas,"分享数据")
  return datas;
}


/* form request没用呢 */
function fmRequest(apiKey, filePath, params, success, fail) {
  let defaultParam = {
    appid: appId,
    timestamp: Date.parse(new Date()) / 1000,
    version: '1.1.0',
    os: 'mp',
    channel: '',
  }
  if (apiKey === 'getUid') {
    defaultParam['sign'] = md5.hexMD5('miniprogram' + defaultParam['appid'] + defaultParam['timestamp']);
  } else {
    defaultParam['uid'] = app.globalData['uid'];
    defaultParam['sign'] = md5.hexMD5('miniprogram' + defaultParam['uid'] + defaultParam['timestamp']);
  }
  console.log('upload audio file', apiKey, filePath, params);
  console.log(apiHost + apiMap[apiKey])
  wx.uploadFile({
    url: apiHost + apiMap[apiKey], //仅为示例，非真实的接口地址
    filePath: filePath,
    name: 'file',
    formData: Object.assign({}, params, defaultParam),
    header: {
      "Content-Type": "multipart/form-data"
    },
    success: function(res) {
      if (res.statusCode == 200) {
        let data = JSON.parse(res.data);
        let errorCode = data.code;
        if (errorCode == 200) {
          success(data.res.result);
        } else {
          let errorMsg = data.msg;
          // wx.hideLoading();
          wx.showModal({
            content: errorMsg,
            showCancel: false,
            success: function(res) {}
          });
          fail(data);
        }
      } else {
        // wx.hideLoading();
        wx.showModal({
          content: 'api error',
          showCancel: false,
          success: function(res) {}
        });
      }
    },
    fail: function(res) {
      fail('network error');
    },
    complete: function(res) {

    },
  })
}
// 发送formid
function reFormId(formid) {
  console.log("发送formid")
  request('uploadFormId', {
    formid
  }, (data) => {
    console.log('发送formid成功')
  }, err => {
    console.log('发送formid失败')
  })
}

function uploadImg(url, cb, err) {

  wx.uploadFile({
    url: `${apiHost}/Upfile/upload_file`,
    filePath: url,
    name: 'file',
    formData: {
      floder: "czy"
    },
    success: (res) => {
      console.log(res, '图片上传');

    }

  })
}
// 上传文件
function uploadFils(moduleName, filePathArr) {
  return uploadFilsSync(moduleName, filePathArr, 0, {success: [], fail: []})
    .then(res => {
      return res
    })
    .catch(error => {
      return error
    })
}

function uploadFilsSync(moduleName, filePathArr, index, result) {
  return upload(moduleName, filePathArr[index++], {})
    .then(res => {
      let resData = JSON.parse(res)
      if (resData.code == 200) {
        result.success.push(resData.result);
      }
      if (index === filePathArr.length) {
        return result;
      } else {
        return uploadFilsSync(moduleName, filePathArr, index, result);
      }
    })
    .catch(err => {
      if (index === filePathArr.length) {
        return result;
      } else {
        return uploadFilsSync(moduleName, filePathArr, index, result);
      }
    })
}

function upload(moduleName, filePath) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${apiHost}/Upfile/upload_file`,
      filePath: filePath,
      name: "file",
      formData: {
        floder: moduleName
      },
      success(res) {
        console.log(res.data, '图片上传');
        resolve(res.data);
      },
      fail: function(error) {
        reject(error);
      }
    });
  });
}


module.exports = {
  request: request,
  fmRequest: fmRequest,
  requestOrder: requestOrder,
  reFormId: reFormId,
  logsRequest: logsRequest,
  uploadFils: uploadFils,
  share: share
}