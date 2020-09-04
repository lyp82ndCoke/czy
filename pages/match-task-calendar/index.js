const router = require('../../utils/router.js');
import network from '../../utils/network';
import getCode from "../../utils/getCode";
import fromat from "../../utils/fromat"
const WxParse = require('../../wxParse/wxParse.js');
var imgShow = false
Page({
    data: {
        times_task_user_info: {},
        camp_times_info: {},
        times_task_info: {},
        times_task_time_list: [],
        times_task_example_list: [],
        user_prize_info: {},
        task_list: [],
        adv_info: {},  // 下一营期的图片
        showPopup: false,
        showIsOpen: false,
        isSelect: 0,
        isShowRest: false,
        isFinishTask: false,
        // isRest: false,
        targetDate: '',
        showOpenStatus: false
    },
    onLoad: function(options){
        this.setData({camp_times_id: options.camp_times_id})
        this.initStatus()
    },
    onShow() {
        if (imgShow) {
            imgShow = false
            return
        }
        let crrentTime = wx.getStorageSync('task_crrent_time')
        if (crrentTime) {
            // 监听刷新页面 某日的任务列表
            this.selectDayList(crrentTime, data => {
                this.setData({task_list: data.task_list})
                if (data.task_list) {
                    // 处理展开收起
                    this.handleContent()
                }
                // 计算今日有没有全部完成任务
                this.computeTask()
                // 处理汉字
                // this.handleIndex()
            })
        }
    },
    onHide() {},
    onUnload() {
        // 离开页面清除日期缓存
        wx.removeStorageSync('task_crrent_time')
    },
    imgClickShow() {
        imgShow = true
    },
    refreshPage() {
        this.initStatus()
    },
    initStatus () {
        // 任务日历页
        // 刷新页面也要清除日期缓存
        wx.removeStorageSync('task_crrent_time')
        this.getCalendarList(data => {
            this.setData({
                times_task_user_info: data.times_task_user_info,
                camp_times_info: data.camp_times_info,
                times_task_info: data.times_task_info,
                times_task_time_list: data.times_task_time_list,
                times_task_example_list: data.times_task_example_list,
                user_prize_info: data.user_prize_info,
                adv_info: data.adv_info
            })
            if (data.times_task_info.task_rule_content){
                WxParse.wxParse('content', 'html', data.times_task_info.task_rule_content, this, 0);
            }
            this.setData({
                times_task_info: data.times_task_info,
            })
            // 处理时间格式
            this.handleTimeList(() => {
                // 某日的任务列表
                let targetDate = this.data.targetDate ? this.data.targetDate : this.data.times_task_time_list[0].task_content_time
                let timeList = this.data.times_task_time_list
                timeList.forEach(el => {
                    // if (el.is_have_task == 2 && targetDate == el.task_content_time) {
                    //     this.setData({isRest: true})
                    // }
                    if (targetDate == el.task_content_time) {   // 处理是当天查看是否是解锁状态
                        this.setData({isBlock: el.is_block})
                    }
                })
                this.selectDayList(targetDate, data => {
                    this.setData({task_list: data.task_list})
                    if (data.task_list) {
                        // 处理展开收起
                        this.handleContent()
                    }
                    // 计算今日有没有全部完成任务
                    this.computeTask()
                    // 处理汉字
                    // this.handleIndex()
                })
            })
        })
    },
    handleContent() {
        let content = this.data.task_list
        let example = this.data.times_task_example_list
        content.forEach(item => {
            if (item.submit_info) {
                item.submit_info['isfold'] = true;
                item.submit_info.contentLength = this.computeTextLength(item.submit_info['details'])
            }
            item.task_info['isfold'] = true;
            item.task_info.contentLength = this.computeTextLength(item.task_info['task_content'])
            
        })
        example.forEach(el => {
            el['isfold'] = true;
            el.contentLength = this.computeTextLength(el['details'])
        })
        this.setData({times_task_example_list: example, task_list: content})
    },
    computeTextLength(content) {
        var contentLength = 0;
        if (content) {
            contentLength = content.length;
            if (content.indexOf("\n")) {
              // 统计换行次数 超过7行就显示全部
              var contentN = content.split("\n").length - 1;
              if (contentN > 0) {
                contentLength += contentN * 25;
              }
            }
        }
        return contentLength
    },
    // 展开收起
    showDetail(e) {
        const index = e.currentTarget['dataset'].index;
        const type = e.currentTarget['dataset'].type
        if (type === 'task') {
            this.data.task_list[index].task_info['isfold'] = !this.data.task_list[index].task_info['isfold'];
            this.setData({
                task_list: this.data.task_list
            });
        } else if (type === 'result') {
            this.data.task_list[index].submit_info['isfold'] = !this.data.task_list[index].submit_info['isfold'];
            this.setData({
                task_list: this.data.task_list
            });
        } else if (type === 'example') {
            this.data.times_task_example_list[index]['isfold'] = !this.data.times_task_example_list[index]['isfold'];
            this.setData({
                times_task_example_list: this.data.times_task_example_list
            });
        }
    },
    goMatchArea() {
        let url
        if (this.data.times_task_info.is_bind_match == 2 ) {
            url = `pages/task-list/index?times_task_id=${this.data.times_task_info.times_task_id}&camp_times_id=${this.data.camp_times_info.camp_times_id}&sourceType=1&fromType=1`
        } else {
            url = `pages/match-area-details/index?camp_times_id=${this.data.camp_times_info.camp_times_id}&times_task_id=${this.data.times_task_info.times_task_id}&sourceType=1`
        }
        router.navigate({path: url})
    },
    // 获取Unionid
    getUnionid() {
        let unionid = wx.getStorageSync('unionid')
        if (unionid) {
            return unionid
        } else {
            getCode.login().then(res => {
                return wx.getStorageSync('unionid')
            })
        }
    },
    queryClick(e) {
        const type = e.currentTarget['dataset'].type
        const task_view_unionid = this.getUnionid()
        if (type === 'task') {
            let url = `pages/match-my-task/index?times_task_id=${this.data.times_task_info.times_task_id}&camp_times_id=${this.data.camp_times_info.camp_times_id}&type=1&task_view_unionid=${task_view_unionid}`
            router.navigate({path: url})
        } else if(type === 'rank') {
            let url = `pages/match-rank-list/index?camp_times_id=${this.data.camp_times_info.camp_times_id}&times_task_id=${this.data.times_task_info.times_task_id}&rank_type=1`
            router.navigate({path: url})
        }
    },
    clickBtn(e) {
        if (this.data.isBlock == 1) {
            wx.showToast({
                title: '任务还未开始，暂不能做任务',
                icon: 'none'
            })
            return
        }
        const index = e.currentTarget['dataset'].index
        const task_view_unionid = this.getUnionid()
        let item = this.data.task_list[index]
        item.crrentIndex = index
        this.setData({itemInfo: item, showOpenStatus: false})
        if (parseInt(this.data.times_task_info.time_status) === 3 && parseInt(item.task_info.is_submit) === 2) {
            wx.showToast({
                title: '任务已结束，不能继续做任务',
                icon: "none",
            })
            return
        }
        if (parseInt(this.data.times_task_info.time_status) === 1) {
            wx.showToast({
                title: '任务还未开始，暂不能做任务',
                icon: "none",
            })
            return
        }
        if (parseInt(item.task_info.is_submit) === 2) {
            // 去填写
            let time = this.data.times_task_time_list[this.data.isSelect].task_content_time
            wx.setStorageSync("task_crrent_time", time)
            let url = `pages/match-task-write/index?times_task_content_id=${item.task_info.times_task_content_id}&times_task_id=${this.data.times_task_info.times_task_id}&camp_times_id=${this.data.camp_times_info.camp_times_id}&task_view_unionid=${task_view_unionid}&index=${index}&is_bind_match=${this.data.times_task_info.is_bind_match}`
            router.navigate({path: url})
            return
        }
        // 除了去填写，其他都清除缓存
        wx.removeStorageSync('task_crrent_time')
        if ((parseInt(this.data.times_task_info.time_status) === 2) && parseInt(item.submit_info.is_open) === 1) {
            // 进行中且已公开
            let url
            if (this.data.times_task_info.is_bind_match == 2 ) {
                // 任务分享
                url = `pages/match-task-person/index?task_submit_id=${item.submit_info.task_submit_id}&times_task_id=${this.data.times_task_info.times_task_id}&camp_times_id=${this.data.camp_times_info.camp_times_id}&unionid=${this.data.times_task_user_info.unionid}&index=${index}&type=1&shareType=task`
            } else {
                // 赛区任务分享
                url = `pages/match-task-person/index?task_submit_id=${item.submit_info.task_submit_id}&times_task_id=${this.data.times_task_info.times_task_id}&camp_times_id=${this.data.camp_times_info.camp_times_id}&unionid=${this.data.times_task_user_info.unionid}&index=${index}&type=1`
            }
            router.navigate({path: url})
            return
        }
        if ((parseInt(this.data.times_task_info.time_status) === 3) && parseInt(item.submit_info.is_open) === 1) {
            // 结束且已公开，要弹窗提示
            this.setData({showIsOpen: true, showOpenStatus: false})
            return
        }
        if (parseInt(item.submit_info.is_open) === 2) {
            // 先公开，在分享
            let params = {times_task_id: this.data.times_task_info.times_task_id, task_submit_id: item.submit_info.task_submit_id}
            network.request('taskSubmitSetOpen', params, res => {
                // 置为公开
                const is_open = `task_list[${index}].is_open`
                this.setData({
                    showIsOpen: true,
                    showOpenStatus: false,
                    [is_open]: 1
                })
            })
        }
    },
    shareNow() {
        // 己公开去分享(任务详情) type: 1任务日历
        let url
        if (this.data.times_task_info.is_bind_match == 2 ) {
            // 任务分享
            url = `pages/match-task-person/index?task_submit_id=${this.data.itemInfo.submit_info.task_submit_id}&times_task_id=${this.data.times_task_info.times_task_id}&camp_times_id=${this.data.camp_times_info.camp_times_id}&unionid=${this.data.times_task_user_info.unionid}&index=${this.data.itemInfo.crrentIndex}&type=1&shareType=task`
        } else {
            // 赛区任务分享
            url = `pages/match-task-person/index?task_submit_id=${this.data.itemInfo.submit_info.task_submit_id}&times_task_id=${this.data.times_task_info.times_task_id}&camp_times_id=${this.data.camp_times_info.camp_times_id}&unionid=${this.data.times_task_user_info.unionid}&index=${this.data.itemInfo.crrentIndex}&type=1`
        }
        router.navigate({
            path: url,
            success:() => {
				this.setData({showIsOpen: false, showOpenStatus: false, itemInfo: {}})
			}
        })
    },
    getCalendarTask(e) {
        wx.showLoading({
            title: '数据加载中',
        })
        const index = e.currentTarget['dataset'].index
        const item = e.currentTarget['dataset'].item
        const localTime = new Date(fromat.formatDate(new Date(), 'YYYY-MM-DD')).getTime()
        const calendarTime = new Date(item.task_content_time).getTime()
        // 如果task_visible_type为1，只能查看当天及之前的，未解锁的不能查看
        if (this.data.times_task_info.task_visible_type == 1 && calendarTime > localTime) {
            wx.showToast({
                title: '此任务尚未解锁，不可查阅',
                icon: 'none',
                duration: 2000
            })
            return
        }
        if (parseInt(item.is_have_task) === 2) {
            this.setData({isShowRest: true, crrentTime: item.task_content_time})
        } else {
            this.setData({isShowRest: false, crrentTime: item.task_content_time})
        }
        this.setData({isSelect: index, isBlock: item.is_block})
        // 切换日历清除日期缓存
        wx.removeStorageSync('task_crrent_time')
        // 某日的任务列表
        this.selectDayList(item.task_content_time, data => {
            this.setData({task_list: data.task_list})
            if (data.task_list) {
                // 处理展开收起
                this.handleContent()
            }
            // 计算今日有没有全部完成任务
            this.computeTask()
            // 处理汉字
            // this.handleIndex()
        })
    },
    queryRule() { this.setData({showPopup: true}) },
    closePopup() { this.setData({showPopup: false}) },
    closeDialog() {
        if (!this.data.showOpenStatus) {
            const index = this.data.itemInfo.crrentIndex
            const isOpen = `task_list[${index}].submit_info.is_open`
            this.setData({
                [isOpen]: 1
            })
        }
        this.setData({showOpenStatus: false, showIsOpen: false})
    },
    computeTask() {
        if (!this.data.task_list) { return }
        let list = this.data.task_list
        let count = 0
        for (let index = 0; index < list.length; index++) {
            let element = list[index];
            if (parseInt(element.task_info.is_submit) === 1) { count++ }
        }
        if (list.length == count) {
            this.setData({isFinishTask: true})
        } else {
            this.setData({isFinishTask: false})
        }
    },
    queryPrize() {
        let url = `pages/match-award-list/index?camp_times_id=${this.data.camp_times_info.camp_times_id}&times_task_id=${this.data.times_task_info.times_task_id}&rank_type=2`
        router.navigate({
            path: url
        })
    },
    handleTimeList(cb) {
        let list = this.data.times_task_time_list
        for (let index = 0; index < list.length; index++) {
            let element = list[index]
            element.isToday = false
            let timeList = element.task_content_time.split('-')
            let localDay = new Date(`${new Date().getFullYear()}-${this.add0(new Date().getMonth() + 1)}-${this.add0(new Date().getDate())}`).getTime()
            let targetDate = new Date(element.task_content_time).getTime()
            element.task_format_time = `${timeList[1]}.${timeList[2]}`
            if (localDay === targetDate) {
                element.isToday = true
                this.setData({isSelect: index, targetDate: element.task_content_time})
            }
        }
        this.setData({times_task_time_list: list})
        if (parseInt(this.data.times_task_time_list[this.data.isSelect].is_have_task) === 2) {
            this.setData({isShowRest: true})
        }
        cb()
    },
    add0(m) {
        return m < 10 ? '0' + m : m.toString()
    },
    handleIndex () {
        // if (!this.data.task_list) { return }
        // let list = this.data.task_list
        // for (let index = 0; index < list.length; index++) {
        //     let element = list[index]
        //     element.task_info.orderName = this.toChinesNum(index + 1) 
        // }
        // this.setData({task_list: list})
    },
    //图片点击事件
    imgYu(event) {
        var src = event.currentTarget.dataset.src; //获取data-src
        var imgList = event.currentTarget.dataset.list; //获取data-list
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        })
    },
    // toChinesNum (num) {
    //     let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    //     let unit = ['', '十', '百', '千', '万']
    //     num = parseInt(num)
    //     let getWan = (temp) => {
    //       let strArr = temp.toString().split('').reverse()
    //       let newNum = ''
    //       for (var i = 0; i < strArr.length; i++) {
    //         newNum = (i === 0 && strArr[i] === 0 ? '' : (i > 0 && strArr[i] === 0 && strArr[i - 1] === 0 ? '' : changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]))) + newNum
    //       }
    //       return newNum
    //     }
    //     let overWan = Math.floor(num / 10000)
    //     let noWan = num % 10000
    //     if (noWan.toString().length < 4) {
    //       noWan = '0' + noWan
    //     }
    //     return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
    // },
    selectDayList(targetDate, cb) {
        let data = {camp_times_id: this.data.camp_times_id, times_task_id: this.data.times_task_info.times_task_id, date: targetDate}
        network.request('selectDayList', data, res => {
            wx.hideLoading()
            cb(res)
        }, error => {
            wx.hideLoading()
        })
    },
    handleDate (time) {
        if (!time) { return }
        let timeList = time.split('-')
        return `${timeList[1]}-${timeList[2]}`
    },
    getCalendarList(cb) {
        wx.showLoading({
            title: '数据加载中',
        })
        network.request('getTaskCalendar', {camp_times_id: this.data.camp_times_id}, res => {
            cb(res)
            wx.hideLoading()
        }, error => { wx.hideLoading() })
    },
    qieryOther(e) {
        // 留下缓存记录时间
        let time = this.data.crrentTime ? this.data.crrentTime : this.data.targetDate
        wx.setStorageSync("task_crrent_time", time); 
        let id = e.currentTarget['dataset'].id
        let url = `pages/match-task-other/index?times_task_content_id=${id}&camp_times_id=${this.data.camp_times_info.camp_times_id}`
        router.navigate({path: url})
    },
    showAnalysis(e) {
        const itemIndex = e.currentTarget['dataset'].task_index
        const task_content_analysis = this.data.task_list[itemIndex].task_info['task_content_analysis']
        this.setData({showIsOpen: true, showOpenStatus: true, task_content_analysis: task_content_analysis})
    },
    // 客服消息log
    handleContact(e) {
        // 客服消息log
        const params = e.currentTarget['dataset']
        network.logsRequest({ apipath: params.button_path, apiparam: params.goods_id }, data => {
            console.log("log日志")
        })
    }
});