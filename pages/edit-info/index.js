// pages/edit-info/index.js
const app = getApp();
Page({
  data: {

    isIpx: app.globalData.isIpx,


    //群数组
    gradeCode: '001',
    groupList: [],
    groupIndex: 0,
    gid: 0,//提交接口用
    link: true,//控制路由重复跳转的控制参数
    userInfo: '',
    updateinfo: {},
    headerImg: '',
    nickname: '',
    imgfilePath: '',
    date: '',
    enddate: '',
    //宝宝性别配置项
    sexarray: [
      {
        id: 0,
        name: '请选择'
      },
      {
        id: 1,
        name: '男孩'
      },
      {
        id: 2,
        name: '女孩'
      },
    ],
    sexindex: 0,

    //宝宝就读的年级选项配置项
    gradeArray: [['请选择', '学前', '小学', '初中', '高中'], ['请选择']],
    showMoreCol: false,
    gradeIndex: [0, 0],
    postParam: '',
    getParam: '',

    //此次参与训练营的家长选项配置项
    parentarray: [
      {
        id: 0,
        name: '请选择'
      },
      {
        id: 1,
        name: '爸爸'
      },
      {
        id: 2,
        name: '妈妈'
      },
      {
        id: 3,
        name: '爸爸妈妈'
      },
      {
        id: 4,
        name: '其他'
      },
    ],
    parentindex: 0,

    //平时陪伴宝宝较多的人配置项
    loveItems: [
      { name: '1', value: '爸爸', },
      { name: '2', value: '妈妈', },
      { name: '3', value: '爷爷' },
      { name: '4', value: '奶奶' },
      { name: '11', value: '其他' },
    ],
    loveItemCheckd: [],
    loveItemShow: false,
    loveInputInfo: '',

    //学习方面现状配置项
    items: [
      // { name: '0', value: '请选择', },
      { name: '1', value: '良好', },
      { name: '2', value: '磨蹭、拖拉、马虎', },
      { name: '3', value: '厌学' },
      { name: '4', value: '休学' },
      { name: '11', value: '其他' },
    ],

    itemcheckd: [],
    itemShow: false,
    itemInputInfo: '',

    //地区所属配置项
    region: [],
    province: '',
    city: '',
    district: '',
    regionCNs: '', //区域中文名称
    selectRegion: false,
  },

  onLoad: function (options) {
    const userinfo = wx.getStorageSync('userinfo');
    console.log(userinfo, "us")
    if (userinfo) {
      this.setData({
        userInfo: userinfo
      })
    }else{
      this.getInfo()
    }


    // var that = this;
    // that.getInfo(function () {
    //   that.newCheckbox();
    //   that.new1CheckBox();
    //   console.log(that.data.gid);
    //   console.log(that.data.groupList);
    //   var gindex = 0;
    //   for (var i = 0; i < that.data.groupList.length; i++) {
    //     if (parseInt(that.data.groupList[i].group_id) == parseInt(that.data.gid)) {
    //       gindex = i;
    //       break;
    //     }
    //   }
    //   console.log('groupindex--' + gindex)
    //   that.setData({
    //     groupIndex: gindex,
    //     gid: that.data.gid,
    //     groupList: that.data.groupList,
    //   })
    // });
    // var enddate = app.func.getNowFormatDate();
    // if (options.extraInfo && options.motherid) {
    //   console.log("于康365");
    //   console.log(options.open_type)
    //   console.log(options.motherid)
    //   that.setData({
    //     extraInfo: options.extraInfo, //处理好妈妈课程完善个人资料的参数（0）
    //     motherid: options.motherid, //处理好妈妈课程,用于请求edu_course_info/my_detail查看extraInfo
    //     open_type: options.open_type,
    //   })
    // }
    // that.setData({
    //   enddate: enddate,
    // });
  },
  // 获取用户信息
  getInfo() {
    network.request('myInfo', {}, res => {
      this.setData({
        userInfo: res
      })
      wx.setStorageSync('userinfo', res)
    })
  },

  //选择宝宝就读年级
  bindMultiGradeChange: function (e) {
    var key1 = e.detail.value[0];
    var key2 = e.detail.value[1];
    console.log(key1);
    console.log(key2);
    //用于post请求提交数据
    this.doSwitch(key1, key2, 1);

    this.setData({
      gradeIndex: e.detail.value
    })
  },

  bindMultiGradeColumnChange: function (e) {
    console.log('detail:------>' + e.detail);
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 0) {//第1列
      if (e.detail.value == 0) {
        this.setData({//请选择
          gradeArray: [['请选择', '学前', '小学', '初中', '高中'], ['请选择']],
          showMoreCol: false,
        })
      };
      if (e.detail.value == 1) {//学前
        this.setData({
          gradeArray: [['请选择', '学前', '小学', '初中', '高中'], ['0-1岁', '1-2岁', '2-3岁', '幼儿园小班', '幼儿园中班', '幼儿园大班']],
          showMoreCol: true,
        })
      };
      if (e.detail.value == 2) {//小学
        this.setData({
          gradeArray: [['请选择', '学前', '小学', '初中', '高中'], ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']],
          showMoreCol: true,
        })
      }
      if (e.detail.value == 3) {//初中
        this.setData({
          gradeArray: [['请选择', '学前', '小学', '初中', '高中'], ['七年级', '八年级', '九年级']],
          showMoreCol: true,
        })
      }
      if (e.detail.value == 4) {//高中
        this.setData({
          gradeArray: [['请选择', '学前', '小学', '初中', '高中'], ['一年级', '二年级', '三年级']],
          showMoreCol: true,
        })
      }
    };

  },

  //选择初始化年级数组(status状态码：1:用于post;2:用于get)
  doSwitch: function (val1, val2, status) {
    switch (val1) {
      case 0:
        this.setData({
          gradeArray: [['请选择', '学前', '小学', '初中', '高中'], ['请选择']],
        })
        break;
      case 1:
        this.setData({
          gradeArray: [['请选择', '学前', '小学', '初中', '高中'], ['0-1岁', '1-2岁', '2-3岁', '幼儿园小班', '幼儿园中班', '幼儿园大班']],
        })
        break;
      case 2:
        this.setData({
          gradeArray: [['请选择', '学前', '小学', '初中', '高中'], ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']],
        })
        break;
      case 3:
        this.setData({
          gradeArray: [['请选择', '学前', '小学', '初中', '高中'], ['七年级', '八年级', '九年级']],
        })
        break;
      case 4:
        this.setData({
          gradeArray: [['请选择', '学前', '小学', '初中', '高中'], ['一年级', '二年级', '三年级']],
        })
        break;
    }

    //用于post请求
    if (status == 1) {
      var classNo = '0' + (val2 + 1).toString();
      this.setData({
        postParam: val1.toString().concat(classNo)
      })
      console.log('post参数：' + this.data.postParam);
    }
    //用于get请求
    if (status == 2) {
      this.setData({
        gradeIndex: [val1, val2],
        showMoreCol: true
      })
    }
  },

  // 选择生日
  bindDateChange: function (e) {
    var that = this;
    console.log('生日', e.detail.value)
    that.setData({
      date: e.detail.value
    })
    //处理根据宝宝生日预计年级
    //当前年份
    var currentYear = parseInt(new Date().getFullYear());
    //用户选择的年
    var pickYear = parseInt(that.data.date.substring(0, 4));
    //用户选择的月份
    var pickMonth = parseInt(that.data.date.substring(5, 7));
    var differYearVal = currentYear - pickYear;
    var differMonthVal = 8 - pickMonth;
    if (differMonthVal < 0) {
      var code = differYearVal + '0'
      that.matchCode(code)
      console.log('年级编号')
      console.log(that.data.gradeCode)
    } else {
      var code = differYearVal + '1'
      console.log(code)
      that.matchCode(code)
      console.log('年级编号')
      console.log(that.data.gradeCode)
    }

    var param = that.data.gradeCode;
    if (typeof param !== 'number') {
      var val1 = parseInt(param.toString().substring(0, param.toString().indexOf(',')));
      var val2 = parseInt(param.toString().substring(param.toString().indexOf(',') + 1)) % 100 - 1;

      console.log(val1);
      console.log(val2);
      //如果没有触发滚动change设置post请求参数
      that.doSwitch(val1, val2, 1)
      //设置前台展示的数据
      that.doSwitch(val1, val2, 2);
    }
  },

  //所在的群
  bindGroupChange: function (e) {
    var index = e.detail.value;
    var gid = this.data.groupList[index].group_id;
    console.log('gid' + gid);
    this.setData({
      gid: gid,
      groupIndex: e.detail.value,
    })
  },

  // 选择性别
  bindSexChange: function (e) {
    console.log('性别', e.detail.value);
    console.log('性别信息', e)
    this.setData({
      sexindex: e.detail.value
    })
  },

  // 选择参加的家长
  bindPeopleChange: function (e) {
    this.setData({
      parentindex: e.detail.value
    })
  },

  // 平时陪伴宝宝较多的人(多选)
  loveCheckboxChange: function (event) {
    this.setData({
      loveItemCheckd: event.detail.value.join(',')
    })
    if (this.data.loveItemCheckd.indexOf('11') > -1) {
      this.setData({
        loveItemShow: true
      })
    } else {
      this.setData({
        loveItemShow: false
      })
    }
  },

  getLoveOtherInfo: function (e) {
    this.setData({
      loveInputInfo: e.detail.value
    })
  },

  // 宝宝目前的学习状态
  checkboxChange: function (e) {
    this.setData({
      itemcheckd: e.detail.value.join(',')
    })
    if (this.data.itemcheckd.indexOf('11') > -1) {
      this.setData({
        itemShow: true
      })
    } else {
      this.setData({
        itemShow: false
      })
    }
  },

  //学习现状选择其他，输入的内容
  getOtherInfo: function (e) {
    this.setData({
      itemInputInfo: e.detail.value
    })
    console.log('学习现状，其他选项内容：' + this.data.itemInputInfo)
  },

  getInfo: function (cb) {
    var that = this;
    var params = {};
    app.server.getJSON('edu_user/my_detail', params, function (res) {
      console.log(res.extraInfo.groupList);
      var results = res['results'];
      var tempGroup = [];
      tempGroup = res.extraInfo.groupList;
      var gid = results['groupID'];
      that.setData({
        groupList: tempGroup,
        gid: gid,
        userInfo: results,
        headerImg: results['avatarPreview'],
        nickname: results['nickName'],
        date: results['bbBirthday'] || '请选择',
        sexindex: results['bbSex'],
        gradeindex: results['bbClassType'],
        parentindex: results['parentType'],
        itemcheckd: results['learnTypesArr'],//后台需要多一个其他的状态
        loveItemCheckd: results['accompanyTypeArr'],//accompany陪伴较多的人------类似itemcheckd
        itemInputInfo: results['learnLabel'],
        loveInputInfo: results['accompanyLabel'],
        getParam: results['bbClassTypeVlue'],
      });
      typeof cb == 'function' && cb(res);

      //处理宝宝班级
      if (that.data.date == '请选择') {
        var param = that.data.getParam;
        if (typeof param !== 'number') {
          var val1 = parseInt(param.toString().substring(0, param.toString().indexOf(',')));
          var val2 = parseInt(param.toString().substring(param.toString().indexOf(',') + 1)) % 100 - 1;
          console.log(val1);
          console.log(val2);
          //如果没有触发滚动change设置post请求参数
          that.doSwitch(val1, val2, 1)
          //设置前台展示的数据
          that.doSwitch(val1, val2, 2);
        }
      } else {
        if (that.data.getParam == 0) {
          //处理根据宝宝生日预计年级
          //当前年份
          var currentYear = parseInt(new Date().getFullYear());
          //用户选择的年
          var pickYear = parseInt(that.data.date.substring(0, 4));
          //用户选择的月份
          var pickMonth = parseInt(that.data.date.substring(5, 7));
          var differYearVal = currentYear - pickYear;
          var differMonthVal = 8 - pickMonth;
          if (differMonthVal < 0) {
            var code = differYearVal + '0'
            that.matchCode(code)
            console.log('年级编号')
            console.log(that.data.gradeCode)
          } else {
            var code = differYearVal + '1'
            console.log(code)
            that.matchCode(code)
            console.log('年级编号')
            console.log(that.data.gradeCode)
          }
          console.log('年级编码')
          console.log(that.data.gradeCode)
          console.log(typeof that.data.gradeCode)
          var param = that.data.gradeCode;
          if (typeof param !== 'number') {
            var val1 = parseInt(param.toString().substring(0, param.toString().indexOf(',')));
            var val2 = parseInt(param.toString().substring(param.toString().indexOf(',') + 1)) % 100 - 1;

            console.log(val1);
            console.log(val2);
            //如果没有触发滚动change设置post请求参数
            that.doSwitch(val1, val2, 1)
            //设置前台展示的数据
            that.doSwitch(val1, val2, 2);
          }
        } else {
          console.log(that.data.getParam)
          var param = that.data.getParam;
          if (typeof param !== 'number') {
            var val1 = parseInt(param.toString().substring(0, param.toString().indexOf(',')));
            var val2 = parseInt(param.toString().substring(param.toString().indexOf(',') + 1)) % 100 - 1;

            console.log(val1);
            console.log(val2);
            //如果没有触发滚动change设置post请求参数
            that.doSwitch(val1, val2, 1)
            //设置前台展示的数据
            that.doSwitch(val1, val2, 2);
          }
        }
      }

      //处理宝宝所属地区    
      var regionInfo = results['areaLabel'];
      var areaArr = [];
      areaArr = regionInfo.split(',');

      //areaArr.length ==1   说明没有选择区域给予默认
      if (areaArr.length == 1) {
        that.setData({
          region: [],
          province: '',
          city: '',
          district: '',
          regionCNs: '',
          selectRegion: false,
        })
        //接口区域字段不为空赋值接口数据
      } else {
        that.setData({
          selectRegion: true,
          region: areaArr,
          province: areaArr[0],
          city: areaArr[1],
          district: areaArr[2],
          regionCNs: results['areaLabel'],

        })
      }

    });
  },

  //修改头像
  updatePic: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;

        wx.uploadFile({
          url: app.server.url + 'axapi/up_file',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },

          success: function (res) {
            var newFile = JSON.parse(res.data);
            console.log("成功信息", newFile['results']['filePath']);
            app.func.showToast('上传成功');
            that.setData({
              headerImg: newFile['results']['preview'],
              imgfilePath: newFile['results']['filePath'],
            });

          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
            console.log("失败信息", res);
          }
        });
      }
    });
  },

  getName: function (e) {
    var val = e.detail.value;
    this.setData({
      nickname: val
    });
  },

  newCheckbox: function () {
    var that = this;
    var itemlist = that.data.items;
    var itemcheckd = that.data.itemcheckd;
    itemcheckd.forEach(function (currentValue, index) {
      itemcheckd[index] = parseInt(currentValue)
    })

    for (var i = 0; i < itemlist.length; i++) {
      var name = parseInt(itemlist[i]['name']);
      console.log("name", name);
      console.log("itemcheckdindexOf", itemcheckd.indexOf(name));
      if (itemcheckd.indexOf(name) != -1) {
        itemlist[i].checked = true;
        if (name == 11) {
          that.setData({
            itemShow: true
          })
          console.log('选择其他11：' + that.data.itemShow)
        } else {
          that.setData({
            itemShow: false
          })
          console.log('未选择其他11：' + that.data.itemShow)
        }
      }
    }
    that.setData({
      items: itemlist,
    });
  },

  new1CheckBox: function () {
    var that = this;
    var loveItemList = that.data.loveItems;
    var loveItemcheckd = that.data.loveItemCheckd;
    loveItemcheckd.forEach(function (currentValue, index) {
      loveItemcheckd[index] = parseInt(currentValue)
    })
    //平时陪伴宝宝较多的人
    for (var x = 0; x < loveItemList.length; x++) {
      var name = parseInt(loveItemList[x]['name']);
      console.log("name", name);
      console.log("loveItemcheckdIndexOf", loveItemcheckd.indexOf(name));
      if (loveItemcheckd.indexOf(name) != -1) {
        loveItemList[x].loveCheck = true;
        if (name == 11) {
          that.setData({
            loveItemShow: true
          })
          console.log('陪伴宝宝：选择其他：' + that.data.loveItemShow)
        } else {
          that.setData({
            loveItemShow: false
          })
          console.log('陪伴宝宝：未选择其他：' + that.data.loveItemShow)
        }
      }
    }
    that.setData({
      loveItems: loveItemList,
    })
  },

  //确定提交保存
  submitInfo: function () {
    var that = this;
    var params = {};
    params['nick_name'] = that.data.nickname;
    params['avatar'] = that.data.imgfilePath;
    params['bb_birthday'] = that.data.date;
    params['bb_sex'] = that.data.sexindex;
    params['bb_class_type'] = that.data.postParam;
    params['accompany_type'] = that.data.loveItemCheckd;
    params['learn_types'] = that.data.itemcheckd;
    params['learnLabel'] = that.data.itemInputInfo;
    params['parent_type'] = that.data.parentindex;
    params['accompanyLabel'] = that.data.loveInputInfo;
    params['parent_type'] = that.data.parentindex;
    params['area_label'] = that.data.regionCNs;
    params['groupID'] = that.data.gid;

    if (that.data.extraInfo == 0) {
      app.server.postJSON('edu_user/my_update', params, function (res) {
        if (res.isResultOk()) {
          var data = {};
          data.course_info_id = that.data.motherid;
          app.server.getJSON('edu_course_info/my_detail', data, res => {
            var extraInfo = res.extraInfo.isEdited;
            if (extraInfo == 1) {
              wx.redirectTo({
                url: '../../365course/pages/categeory_list_mather/index?id=' + that.data.motherid + '&open_type=' + that.data.open_type,
              })
            } else {
              app.func.toast('请完善必填选项后提交');
            }
          })
        }
        else {
          app.func.toast(res.errorStr);
        }
      });
    } else {
      app.server.postJSON('edu_user/my_update', params, function (res) {
        if (res.isResultOk()) {
          wx.reLaunch({
            url: '../../365course/pages/center/center',
          })
        }
        else {
          app.func.toast(res.errorStr);
        }
      });
    }
  },

  //更绑手机号
  changeSignTel: function () {
    var that = this;
    var preTel = that.data.userInfo.signTel;
    console.log('已经绑定的手机号：' + preTel);
    that.link('../change_tel/change_tel?preTel=' + preTel, that);
  },

  //处理重复跳转
  link: function (url, that) {
    if (that.data.link == true) {
      that.setData({
        link: false
      }, function () {
        wx.redirectTo({
          url: url,
          complete: function () {
            that.setData({
              link: true
            })
          }
        })
      })

    } else {
      return;
    }

  },

  //未绑定跳绑定手机号界面
  bindSignTel: function () {
    var that = this;
    that.link('../poster_login/poster_login', that);
  },

  //个人信息所属区域
  changeRegin: function (e) {
    this.setData({
      selectRegion: true,
      region: e.detail.value,
      province: e.detail.value[0],
      city: e.detail.value[1],
      district: e.detail.value[2],
      regionCNs: e.detail.value[0].concat(',').concat(e.detail.value[1]).concat(',').concat(e.detail.value[2]),
    });
  },

  //生日匹配年级编号
  matchCode: function (code) {
    var that = this;
    var code = code.toString();
    console.log(code)
    switch (code) {
      case '00':
        that.setData({
          gradeCode: '1,101',
          gid: 1,
          groupIndex: 1,
        })
        break;
      case '01':
        that.setData({
          gradeCode: '1,102',
          gid: 2,
          groupIndex: 2,
        })
        break;
      case '10':
        that.setData({
          gradeCode: '1,102',
          gid: 2,
          groupIndex: 2,
        })
        break;
      case '11':
        that.setData({
          gradeCode: '1,103',
          gid: 3,
          groupIndex: 3,
        })
        break;
      case '20':
        that.setData({
          gradeCode: '1,103',
          gid: 3,
          groupIndex: 3,
        })
        break;
      case '21':
        that.setData({
          gradeCode: '1,104',
          gid: 5,
          groupIndex: 5,
        })
        break;
      case '30':
        that.setData({
          gradeCode: '1,104',
          gid: 5,
          groupIndex: 5,
        })
        break;
      case '31':
        that.setData({
          gradeCode: '1,105',
          gid: 7,
          groupIndex: 7,
        })
        break;
      case '40':
        that.setData({
          gradeCode: '1,105',
          gid: 7,
          groupIndex: 7,
        })
        break;
      case '41':
        that.setData({
          gradeCode: '1,106',
          gid: 10,
          groupIndex: 10,
        })
        break;
      case '50':
        that.setData({
          gradeCode: '1,106',
          gid: 10,
          groupIndex: 10,
        })
        break;
      case '51':
        that.setData({
          gradeCode: '2,201',
          gid: 13,
          groupIndex: 13,
        })
        break;
      case '60':
        that.setData({
          gradeCode: '2,201',
          gid: 13,
          groupIndex: 13,
        })
        break;
      case '61':
        that.setData({
          gradeCode: '2,202',
          gid: 18,
          groupIndex: 18,
        })
        break;
      case '70':
        that.setData({
          gradeCode: '2,202',
          gid: 18,
          groupIndex: 18,
        })
        break;
      case '71':
        that.setData({
          gradeCode: '2,203',
          gid: 22,
          groupIndex: 22,
        })
        break;
      case '80':
        that.setData({
          gradeCode: '2,203',
          gid: 22,
          groupIndex: 22,
        })
        break;
      case '81':
        that.setData({
          gradeCode: '2,204',
          gid: 25,
          groupIndex: 25,
        })
        break;
      case '90':
        that.setData({
          gradeCode: '2,204',
          gid: 25,
          groupIndex: 25,
        })
        break;
      case '91':
        that.setData({
          gradeCode: '2,205',
          gid: 28,
          groupIndex: 28,
        })
        break;
      case '100':
        that.setData({
          gradeCode: '2,205',
          gid: 28,
          groupIndex: 28,
        })
        break;
      case '101':
        that.setData({
          gradeCode: '2,206',
          gid: 30,
          groupIndex: 30,
        })
        break;
      case '110':
        that.setData({
          gradeCode: '2,206',
          gid: 30,
          groupIndex: 30,
        })
        break;
      case '111':
        that.setData({
          gradeCode: '3,301',
          gid: 32,
          groupIndex: 32,
        })
        break;
      case '120':
        that.setData({
          gradeCode: '3,301',
          gid: 32,
          groupIndex: 32,
        })
        break;
      case '121':
        that.setData({
          gradeCode: '3,302',
          gid: 33,
          groupIndex: 33,
        })
        break;
      case '130':
        that.setData({
          gradeCode: '3,302',
          gid: 33,
          groupIndex: 33,
        })
        break;
      case '131':
        that.setData({
          gradeCode: '3,303',
          gid: 34,
          groupIndex: 34,
        })
        break;
      case '140':
        that.setData({
          gradeCode: '3,303',
          gid: 34,
          groupIndex: 34,
        })
        break;
      case '141':
        that.setData({
          gradeCode: '4,401',
          gid: 35,
          groupIndex: 35,
        })
        break;
      case '150':
        that.setData({
          gradeCode: '4,401',
          gid: 35,
          groupIndex: 35,
        })
        break;
      case '151':
        that.setData({
          gradeCode: '4,402',
          gid: 36,
          groupIndex: 36,
        })
        break;
      case '160':
        that.setData({
          gradeCode: '4,402',
          gid: 36,
          groupIndex: 36,
        })
        break;
      case '161':
        that.setData({
          gradeCode: '4,403',
          gid: 37,
          groupIndex: 37,
        })
        break;
      case '170':
        that.setData({
          gradeCode: '4,403',
          gid: 37,
          groupIndex: 37,
        })
        break;
      default:
        that.setData({
          gradeCode: '4,403',
          gid: 37,
          groupIndex: 37,
        })
        break;
    }
  },
})