const router = require('../../utils/router.js');
import network from '../../utils/network';
Page({
  data: {
    rankingList: [],
    task_info: {},
    navList: [{value: '最热', key: 'hottest'}, {value: '最新', key: 'newest'}, {value: '精选', key: 'selected'}, {value: '我的', key: 'myTask'}],
    sort: 'hottest',
    tabIndex: 0,
    page_size: 10,
    page_num: 1,
    showBackTop: false,
    tabFixed: false
  },
  onLoad: function(options){
    this.setData({camp_times_id: options.camp_times_id, times_task_id: options.times_task_id, times_task_content_id: options.times_task_content_id})
    this.getEveryDayTaskView(this.data.sort)
  },
  likeFun (e) {
    const item = e.currentTarget['dataset']
    if (item.like === 1) { return }
    const index = e.currentTarget['dataset'].index
    const identify_id = e.currentTarget['dataset'].id
    let params = {
        identify_id: identify_id,
        action_type: 1,
        identify_type: 7,
        times_task_id: this.data.times_task_id
    }
    network.request('matchLike', params, res => {
        let taskZan = this.data.rankingList[index].valid_zan_nums
        let totalZan = this.data.rankingList[index].total_zan_num
        const valid = `rankingList[${index}].valid_zan_nums`
        const total = `rankingList[${index}].total_zan_num`
        const isLike = `rankingList[${index}].is_like`
        this.setData({[valid]: parseInt(taskZan) + 1, [total]: parseInt(totalZan) + 1, [isLike]: 1})
    })
  },
  onPageScroll (e) {
    let scroll_top = e.scrollTop
    if (scroll_top > 400 && !this.data.showBackTop) {
      this.data.showBackTop = true;
      this.setData({
        showBackTop: this.data.showBackTop
      })
    } else if (scroll_top < 400 && this.data.showBackTop) {
      this.data.showBackTop = false;
      this.setData({
        showBackTop: this.data.showBackTop
      })
    }
    if (this.data.tabFixed === (scroll_top > this.data.tabTop)) return;
    this.setData({
      tabFixed: (scroll_top > this.data.tabTop)
    })
  },
  backTop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({showBackTop: false})
  },
  // 查询tab距离文档顶部的距离tabTop
  initClientRect() {
    let _this = this
    var query = wx.createSelectorQuery()
    query.select('#tabwrap').boundingClientRect()
    query.exec(function(res) {
      _this.setData({
        tabTop: res[0].top
      })
    })
  },
  // 去评论
  clickComment (e) {
    // type: 2 代表是普通列表 1 是任务日历
    const index = e.currentTarget['dataset'].index
    const item = this.data.rankingList[index]
    let url = `pages/match-task-person/index?times_task_id=${this.data.times_task_id}&camp_times_id=${this.data.camp_times_id}&task_submit_id=${item.task_submit_id}&unionid=${item.unionid}&index=${index}&type=2`
    router.navigate({path: url})
  },
  tabChange(e) {
    const index = e.currentTarget['dataset'].id
    const sort = e.currentTarget['dataset'].key
    if (this.data.tabIndex === index) { return }
    this.setData({tabIndex: index, sort: sort, page_num: 1, rankingList: []})
    this.getEveryDayTaskView(sort)
  },
  getEveryDayTaskView(sortType) {
    if (this.data.isLoading) { return }
    wx.showLoading({
      title: '数据加载中',
    })
    this.setData({isLoading: true})
    let params = { sort: sortType, camp_times_id: this.data.camp_times_id, times_task_id: this.data.times_task_id, times_task_content_id: this.data.times_task_content_id, page_num: this.data.page_num,page_size: this.data.page_size }
    network.request('everyDayTaskView', params, data => {
      let count = data.sign.count
      this.setData({
        task_info: data.task_info,
        rankingList: this.data.rankingList.concat(data.rankingList?data.rankingList:[])
      })
      if (count < this.data.page_size) {
        this.setData({isFinish: true})
      }
      this.setData({isLoading: false})
      this.initClientRect()
      wx.hideLoading()
    }, error => {
      this.setData({isLoading: false})
      wx.hideLoading()
    })
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function() {
    if (this.data.isFinish) {
      wx.showToast({ title:"没有更多了",icon:"none"})
      return
    }
    this.setData({ page_num: this.data.page_num + 1 })
    this.getEveryDayTaskView(this.data.sort)
  }
});