const router = require('../../utils/router.js');
import network from '../../utils/network';
import fromat from "../../utils/fromat";
Page({
    data: {
        task_info: {},
        list: [],
        showBackTop: false,
        showList: false,
        showEmpty: false
    },
    onLoad: function(options){
        this.setData({camp_times_id: options.camp_times_id, times_task_id: options.times_task_id, type: options.type})
        this.getEveryDayTaskList()
    },
    onPageScroll (e) {
        let scroll_top = e.scrollTop
        if (scroll_top > 300 && !this.data.showBackTop) {
          this.data.showBackTop = true;
          this.setData({
            showBackTop: this.data.showBackTop
          })
        } else if (scroll_top < 300 && this.data.showBackTop) {
          this.data.showBackTop = false;
          this.setData({
            showBackTop: this.data.showBackTop
          })
        }
      },
    backTop() {
        wx.pageScrollTo({
          scrollTop: 0
        })
        this.setData({
            showBackTop: false
        })
    },
    queryDayDetail(e) {
        const item = e.currentTarget['dataset'].item
        const localTime = new Date(fromat.formatDate(new Date(), 'YYYY-MM-DD')).getTime()
        const calendarTime = new Date(item.task_content_time).getTime()
        // 如果task_visible_type为1，只能查看当天及之前的，未解锁的不能查看
        if (this.data.task_info.task_visible_type == 2 && calendarTime > localTime) {
            wx.showToast({
                title: '此任务尚未解锁，不可查阅',
                icon: 'none',
                duration: 2000
            })
            return
        }
        let url = `pages/match-task-details/index?camp_times_id=${item.camp_times_id}&times_task_id=${item.times_task_id}&times_task_content_id=${item.times_task_content_id}`
        router.navigate({path: url})
    },
    getEveryDayTaskList() {
        wx.showLoading({
            title: '数据加载中',
        })
        let params = {
            camp_times_id: this.data.camp_times_id,
            times_task_id: this.data.times_task_id
        }
        network.request('everyDayTaskList', params, data => {
            let taskList = data.list
            let tag = 0
            taskList.forEach(el => {
                if (el.dataList.length > 0) {
                    tag++
                }
            })
            if (tag <= 0) { this.setData({ showEmpty: true }) }
            this.setData({
                list: data.list,
                task_info: data.task_info
            })
            wx.hideLoading()
        }, error => {
            wx.hideLoading()
        })
    }
});