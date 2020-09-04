const router = require('../../utils/router.js');
import network from '../../utils/network';
let timer = null
Page({
    data:{
        useTime: '00:00:00',
        answer_info: {
          total_nums: 50
        },
        questionInfo: {},
        questionList: [],
        answerIdList: [],
        orderNumber: 0,
        count: 0,
        checkInfo: {}
    },
    onLoad:function(options){
      this.setData({paper_id: options.paper_id, camp_times_id: options.camp_times_id, assess_id: options.assess_id, assess_paper_id: options.assess_paper_id, prevIndex: options.prevIndex})
      this.getQuestion()
    },
    onShow:function(){
      // 检查是否已经开始计时
      if (this.data.count <= 0) {
        return
      } else {
        // 重新开始计时
        this.startTime()
      }
    },
    onHide:function(){
      clearInterval(timer)
    },
    onUnload:function(){
      clearInterval(timer)
    },
    getQuestion() {
      wx.showLoading({
        title: '数据加载中',
      })
      const params = {paper_id: this.data.paper_id}
      network.request('paperContentList', params, res => {
        this.setData({
          questionList: res.list,
          questionInfo: res.list[this.data.orderNumber]
        })
        this.startTime()
        wx.hideLoading()
      }, error => {
        wx.hideLoading()
      })
    },
    // 计时器
    startTime(alreadTime) {
      timer = setInterval(() => {
        let count = this.data.count
        count++
        this.setData({
          useTime: `${this.add0(parseInt(count / 60 / 60))}:${this.add0(parseInt(count / 60) % 60)}:${this.add0(count % 60)}`,
          count: count
        })
      }, 1000)
    },
    clickCheck(e) {
      const index = e.currentTarget['dataset'].index
      let select_option = this.data.questionInfo.select_option
      select_option.forEach(el => {
        el.checked = false
      })
      select_option[index].checked = true
      this.setData({
        'questionInfo.select_option': select_option,
        checkInfo: {
          option_index: select_option[index].option_index,
          score: select_option[index].score,
          paper_select_option_id: select_option[index].paper_select_option_id,
          paper_select_id: select_option[index].paper_select_id,
          paper_id: select_option[index].paper_id,
          paper_content_id: select_option[index].paper_content_id,
          identity_id: this.data.questionInfo.identity_id,
          select_content: this.data.questionInfo.select_content,
          option_content: select_option[index].paper_content_id
        }
      })
    },
    submitData() {
      if (Object.keys(this.data.checkInfo).length <= 0) {
        wx.showToast({
          title: '请选择答案',
          icon: 'none'
        })
        return
      }
      let list = new Array()
      list.push(this.data.checkInfo)
      this.setData({answerIdList: this.data.answerIdList.concat(list)})
      if (this.data.answerIdList.length < this.data.questionList.length) {
        this.setData({orderNumber: this.data.orderNumber + 1})
        // 下一题
        this.setData({checkInfo: {}, questionInfo: this.data.questionList[this.data.orderNumber]})
      } else {
        // 提交
        clearInterval(timer)
        wx.showLoading({
          title: '提交中...'
        })
        const params = {
          camp_times_id: this.data.camp_times_id,
          paper_id: this.data.paper_id,
          submit_data: JSON.stringify(this.data.answerIdList),
          assess_paper_id: this.data.assess_paper_id,
          assess_id: this.data.assess_id
        }
        network.request('submitPaper', params, res => {
          this.fissionStatus()
          wx.showToast({
            title: '即将前往测评报告',
            icon: 'none',
            duration: 2000,
            success: () => {
              setTimeout(() => {
                const url = `pages/evaluation-report/index?paper_id=${this.data.paper_id}&camp_times_id=${this.data.camp_times_id}&assess_id=${this.data.assess_id}&assess_paper_id=${this.data.assess_paper_id}`
                router.redirect({path: url})
              }, 2000)
            }
          })
        }, error => {
          wx.hideLoading()
        })
      }
    },
    // 提交答题修改列表状态
    fissionStatus(){
      let pages = getCurrentPages();
      let prevPage = null; //上一个页面
      if (pages.length >= 3) {
        prevPage = pages[pages.length - 2]; //上上一个页面
      }
      const index = this.data.prevIndex;
      const isReport = `list[${index}].is_report`
      if (prevPage) {
        prevPage.setData({
          [isReport]: 1
        })
      }
    },
    add0(m) {
      return m < 10 ? '0' + m : m.toString()
    }
})