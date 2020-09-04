// pages/questionnaire/index.js
const router = require('../../utils/router');
import getCode from "../../utils/getCode";
import network from '../../utils/network'
import WxValidate from "../../utils/WxValidate";
import fromat from "../../utils/fromat";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    begin_time: fromat.format(new Date().getTime()),
    animation: {},
    subList: [],
    questionaireInfo: {
      
    },
    loginShow: false,
    loginWrapShow: false,
    componentList: [
    ],
    draft:false,
  },
  // 获取当前授权状态
  getLoginStatus() {
    getCode.loginShow().then(res => {
      this.setData({
        loginWrapShow: res
      })
    })
  },
  // 全局唤醒授权点击框
  loginShow() {
    this.setData({
      loginShow: true
    });
  },
  // 授权成功
  loginHide() {
    this.setData({
      loginShow: false,
      loginWrapShow: false
    });
  },
  // 取消授权
  cancelLogin() {
    this.setData({
      loginShow: false
    });
  },
  
  // 返回首页
  goIndex(){
    router.goHome()
  },
  goShare() {
    // 跳转到转发分享页
    const url = `pages/questionnaire-forward/index?questionnaire_code=${this.data.options.questionnaire_code}`
    router.redirect({path: url})
  },
  // 重新答题
  continueAnswer(){
    const str = 'questionaireInfo.status'
    this.setData({
      [str]: 2
    })
  },
  // 继续答题
  retake(){
    const str = 'questionaireInfo.status'
    this.setData({
      subList:[],
      [str]:2
    })
  },
  // 获取问卷详情
  getQuestionnaire(){
    wx.showLoading({
      title: '数据加载中'
    })
    const params = this.data.options;
    network.request('getQuestionnaire',params,res=>{
      // console.log(res,"问卷详情")
      this.setData({
        questionaireInfo: res.questionaireInfo,
        componentList: res.componentList,
        subList: res.answer_list ? res.answer_list.componentList||[]:[]
      })
      wx.hideLoading();
    })
  },
  // 评分
  clickScore(e){
    // console.log(e.currentTarget.dataset,"评分")
    const index = e.currentTarget.dataset.index;
    const subIndex = e.currentTarget.dataset.subindex;
    const component_type = e.currentTarget.dataset.component_type;
    const obj = this.data.componentList[index].optionList[subIndex];
    obj['component_type'] = component_type;
    const str = `subList[${index}]`;
    this.setData({
      [str]: obj,
      draft:true
    })
  },
  // 填空输入
  changeTextarea(e) {
    // console.log(e.currentTarget.dataset)
    let fill_content = e.detail.value;
    const index = e.currentTarget.dataset.index;
    const component_type = e.currentTarget.dataset.component_type;
    const component_id = e.currentTarget.dataset.component_id;
    const str = `subList[${index}]`;
    const error = `componentList[${index}].error`
    this.setData({
      [error]: false
    })
    const obj = {
      fill_content,
      component_type,
      component_id
    }
    this.setData({
      [str]: obj,
      draft:true
    })
  },
  // 其他 输入框输入
  changeInput(e) {
    // console.log(e.currentTarget.dataset)
    const index = e.currentTarget.dataset.index;
    const subIndex = e.currentTarget.dataset.subindex;
    const option_value = e.detail.value;
    const component_type = e.currentTarget.dataset.component_type;
    const str = `subList[${index}].option_value`;
    const str1 = `subList[${index}].optionList[${subIndex}].option_value`;
    const error = `componentList[${index}].error`
    const optionError = `componentList[${index}].optionError`
    this.setData({
      [error]: false,
      [optionError]: false
    })
    if (component_type == 1) {
      this.setData({
        [str]: option_value,
        draft: true
      })
    } else if (component_type == 2) {
      this.setData({
        [str1]: option_value,
        draft: true
      })
    }
    // if (this.data.componentList[index].optionList[subIndex].selected){
    //   this.setData({
    //     [str]: option_value
    //   })
    // }
  },
  // 单选 多选 触发函数
  radioChange(e) {

    // console.log("参数",e.currentTarget.dataset)
    const index = e.currentTarget.dataset.index;
    const subIndex = e.currentTarget.dataset.subindex;
    const componentType = e.currentTarget.dataset.component_type;
    const show_type = e.currentTarget.dataset.show_type;
    const component_id = e.currentTarget.dataset.component_id;
    const option_id = e.currentTarget.dataset.option_id;
    const option_img_url = e.currentTarget.dataset.option_img_url;
    const str = `componentList[${index}].optionList`;
    let currentOptionList = this.data.componentList[index].optionList;
    console.log()
    const error = `componentList[${index}].error`
    const optionError = `componentList[${index}].optionError`
    this.setData({
      [error]: false,
      [optionError]: false
    })
    if (componentType == 1) {
      // 单选
      const str = `subList[${index}]`;
      let obj = {
        "component_type": componentType,
        component_id,
        option_id,
        show_type,
        option_img_url
      }
      this.setData({
        [str]: obj,
        draft: true
      })

      // currentOptionList.forEach(item=>{
      //   if (item.option_id === option_id){
      //     console.log(true)
      //     item.selected = true;
      //   }else{
      //     item.selected=false;
      //   }
      // })
    } else if (componentType == 2) {
      // 多选
      const str = `subList[${index}]`;
      const str1 = `subList[${index}].optionList[${subIndex}]`;
      let obj = this.data.subList[index];
      obj && obj.optionList ? obj.optionList : obj = {
        optionList: [],
        component_type: componentType,
        component_id
      }
      let obj1 = {
        option_id,
        show_type,
        option_img_url,
        draft: true
      }
      // let subOptionList = this.data.subList[index].optionList;
      // console.log(this.data.subList[index].optionList[subIndex])
      // console.log("存在", this.data.subList[index])
      if (this.data.subList[index] && this.data.subList[index].optionList && this.data.subList[index].optionList[subIndex]) {
        // console.log("存在",this.data.subList[index].optionList[subIndex])

        // const str = `subList[${index}].optionList[]`
        obj.optionList[subIndex] = undefined;
        this.setData({
          [str]: obj,
          draft: true
        })
        // console.log("数据", this.data.subList[index].optionList)
        return;
      }
      obj.optionList[subIndex] = obj1;
      this.setData({
        [str]: obj,
        draft: true
      })
      // console.log("数据", this.data.subList[index].optionList)
      // currentOptionList.forEach(item => {
      //   if (item.option_id === option_id) {
      //   item.selected = !item.selected ;
      //   }
      // })
    }
    // this.setData({
    //   [str]: currentOptionList
    // })
  },
  // 滚动到指定位置
  scorll(id) {
    const query = wx.createSelectorQuery()
    query.select(`#${id}`).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res[0].top, "===", res[1].scrollTop)
      // res[0].top       // #the-id节点的上边界坐标
      // res[1].scrollTop // 显示区域的竖直滚动位置
      const top = res[1].scrollTop + res[0].top - 70;
      console.log("top", top)
      wx.pageScrollTo({
        scrollTop: top
      })
    })

  },

  // 提交
  submit() {
    console.log(this.data.subList)
    let submit = true;
    const list = this.data.componentList;
    list.forEach((item,index)=>{
      item.error=false;
    })
    this.setData({
      componentList: list
    })
    for (var index = 0; index < list.length; index++) {
      const item = list[index];
      console.log(this)
      const subList = this.data.subList[index];
      const error = `componentList[${index}].error`;
      const optionError = `componentList[${index}].optionError`;
      console.log(item.componentInfo.component_type, "item.componentInfo.component_type")
      if (item.componentInfo.is_must_answer == 1) {
        if (item.componentInfo.component_type == 1) {
          if (subList && subList.option_id) {

          } else {
            // wx.showToast({
            //   title: '此项为必选',
            //   icon: "none"
            // })
           
            this.setData({
              errorText: "请选择选项",
              [error]: true
            })
            this.translate()
            submit = false;
            this.scorll(`item-${index}`);
            break;
          }
        } else if (item.componentInfo.component_type == 2) {
          let num = 0;
          let jump = false; 
          if (subList && subList.optionList.length) {
            for (var i = 0; i < subList.optionList.length;i++){
              const subItem = subList.optionList[i];
              if(subItem && subItem.option_id) {
                num++
              }
              if (subItem &&subItem.show_type == 2) {
                if (!subItem.option_value || !subItem.option_value.trim()) {
                  this.setData({
                    errorText: "请检查答案",
                    [error]: true,
                    [optionError]: true
                  })
                  this.translate()
                  submit = false;
                  jump=true;
                  this.scorll(`item-${index}`);
                  break;
                }
              }
            }
            if(jump){
              break;
            }
            // subList.optionList.forEach(subItem => {
            //   if (subItem && subItem.option_id) {
            //     num++
            //   }
            //   if (subItem.show_type == 2) { 
            //     if (!subItem.option_value || !subList.option_value.trim()){
            //       this.setData({
            //         errorText: "请检查答案",
            //         [error]: true,
            //         [optionError]: true
            //       })
            //       this.translate()
            //       submit = false;
            //       this.scorll(`item-${index}`);
            //       break;
            //     }
            //   }
            // })
          }

          if (num < item.componentInfo.low_select_limit) {
           
            if (num == 0) {
              this.setData({
                errorText: "请选择选项",
                [error]: true
              })
            } else {
              this.setData({
                errorText: `最少选择${item.componentInfo.low_select_limit}项`,
                [error]: true
              })
            }
            this.translate()
            // wx.showToast({
            //   title: `最少选择${item.componentInfo.low_select_limit}项`,
            //   icon: "none"
            // })
            submit = false;
            this.scorll(`item-${index}`)
            break;
          }
        } else if (item.componentInfo.component_type == 3) {
          if (!subList || !subList.fill_content.trim()) {
            this.setData({
              errorText: "请输入内容",
              [error]: true
            })
            // wx.showToast({
            //   title: `此项为必填`,
            //   icon: "none"
            // })
            this.translate()
            submit = false;
            this.scorll(`item-${index}`)
            break;
          }
        } else if (item.componentInfo.component_type == 4) {
          // 评分
          if (!subList || !subList.option_id) {
            this.setData({
              errorText: "请完成打分",
              [error]: true
            })
            // wx.showToast({
            //   title: `此项为必填`,
            //   icon: "none"
            // })
            this.translate()
            submit = false;
            this.scorll(`item-${index}`)
            break;
          }
        }
      }
      if (subList && subList.component_type == 1 && subList.show_type == 2){
        if (!subList.option_value||!subList.option_value.trim()){
          this.setData({
            errorText: "请检查答案",
            [error]: true,
            [optionError]: true
          })
          this.translate()
          submit = false;
          this.scorll(`item-${index}`)
          break;
        }
      }
      

    }

    // })
    if(submit){
      this.submitData(1);
    }
    console.log("顶顶顶顶")
  },
  // 提交数据 
  submitData(is_click){
    if (this.data.options.is_preview){
      return;
    }
    if(is_click==1){
      wx.showLoading({
        title: '提交中',
        mask:true
      })
    }
    const params = {
      begin_time: this.data.questionaireInfo.begin_time || this.data.begin_time,
      questionnaire_code: this.data.options.questionnaire_code,
      is_click,
      componentList:this.data.subList
    }
    network.request('submitQuestionnaire', params, res => {
     wx.hideLoading()
     
     if (res.is_redirect_share == 1) {
      wx.showToast({
        title: '即将前往转发分享',
        icon: 'none',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            // 跳转到转发分享页
            const url = `pages/questionnaire-forward/index?questionnaire_code=${this.data.options.questionnaire_code}`
            router.redirect({path: url})
          }, 2000)
        }
      })
      return
     }
      this.setData({
        draft: false
      })
      if (is_click==1){
        this.setData({
          submmitStatus: 1,
        })
      }
     
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "调查问卷" })
    if (options.scene){
      options.questionnaire_code = options.scene;
    }
    this.setData({
      options: options
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  translate: function () {
    let animation = wx.createAnimation({ duration: 100 });
    // this.animation.opacity(0).step()
    animation.translate(5, 0).step()
    animation.translate(-5, 0).step()
    animation.translate(5, 0).step()
    animation.translate(-5, 0).step()
    animation.translate(5, 0).step()
    animation.translate(-4, 0).step()
    animation.translate(4, 0).step()
    animation.translate(-3, 0).step()
    animation.translate(3, 0).step()
    animation.translate(-2, 0).step()
    animation.translate(2, 0).step()
    animation.translate(-1, 0).step()
    animation.translate(1, 0).step()
    animation.translate(0,0).step()

    this.setData({
      animation: animation.export()
    })
    setTimeout(()=>{
      animation.translate(0, 0).step();
      this.setData({
        animation: animation.export()
      })
    },1500)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    const time = new Date().getTime();
    
    // console.log(fromat)
    console.log(fromat.format(time))
    const begin_time = fromat.format(time);
    this.setData({
      begin_time
    })
    let unionid = wx.getStorageSync('unionid');
    if (unionid) {
      this.getQuestionnaire()
    } else {
      getCode.login().then(res => {
        this.getQuestionnaire();
      })
    }
    this.getLoginStatus();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.draft){
      this.submitData(2)
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const obj = {
      title: this.data.questionaireInfo.wx_share_title,
      imageUrl: this.data.questionaireInfo.wx_share_pic || "",
      paramsFrom: { questionnaire_code: this.data.options.questionnaire_code },
    }
    return network.share(obj);
  }
})