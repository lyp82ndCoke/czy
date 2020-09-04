const router = require('../../utils/router.js');
import network from '../../utils/network';
Page({
	data: {
		times_task_user_info: {},
		camp_times_info: {},
		task_info: {},
		rankingList: [],
		sortTypeList: [{
			value: '最热',
			key: '1'
		}, {
			value: '未分享',
			key: '2'
		}, {
			value: '已分享',
			key: '3'
		}],
		sort_type: 1,
		tabIndex: 1,
		times_task_id: "",
		camp_times_id: "",
		task_view_unionid: "",
		tabFixed: false,
		showIsOpen: false
	},
	onLoad: function(options) {
		// type 1我的任务页  2他人任务页
		this.setData({
			times_task_id: options.times_task_id,
			camp_times_id: options.camp_times_id,
			type: options.type,
			task_view_unionid: options.task_view_unionid
		})
		this.getMyTaskInfo()
		this.userTaskList(1)
	},
	shareNow() {
		router.navigate({
			path: 'pages/match-task-person/index',
			params: {
				times_task_id: this.data.itemInfo.times_task_id,
				camp_times_id: this.data.itemInfo.camp_times_id,
				task_submit_id: this.data.itemInfo.task_submit_id,
				unionid: this.data.itemInfo.unionid,
				index: this.data.itemInfo.index,
				type: 2
			},
			success:() => {
				this.setData({showIsOpen: false, itemInfo: {}})
			}
		});
	},
	queryDetail(e) {
    	const times_task_id = e.currentTarget.dataset.task_id;
		const camp_times_id = e.currentTarget.dataset.camp_id;
		const task_submit_id = e.currentTarget.dataset.submit_id;
		const unionid = e.currentTarget.dataset.unionid;
		const index = e.currentTarget.dataset.index;
		const isOpen = e.currentTarget.dataset.is_open;
		if (this.data.tabIndex == 2 && isOpen == 2 && this.data.type == 1) {	// 自己且未分享且为未公开， 先公开在去详情
			let params = {times_task_id: times_task_id, task_submit_id: task_submit_id}
			network.request('taskSubmitSetOpen', params, res => {
				this.setData({
					showIsOpen: true,
					itemInfo: {
						times_task_id,
						camp_times_id,
						task_submit_id,
						unionid,
						index,
						isOpen
					}
				})
			})
			return
		}
		router.navigate({
			path: 'pages/match-task-person/index',
			params: {
				times_task_id,
				camp_times_id,
				task_submit_id,
				unionid,
				index,
				type: 2
			}
		});
	},
	handleContent() {
		let content = this.data.rankingList
		content.forEach(item => {
			item['isfold'] = true;
			let contentLength = 0;
			if (item['details']) {
				contentLength = item['details'].length;
				if (item['details'].indexOf("\n")) {
					// 统计换行次数 超过7行就显示全部
					var contentN = item['details'].split("\n").length - 1;
					if (contentN > 0) {
						contentLength += contentN * 25;
					}
				}
				item.contentLength = contentLength;
			}
		})
		this.setData({
			rankingList: content
		})
	},
	// 点赞
	clickZan(e) {
		const index = e.currentTarget.dataset.index;
		const identify_id = e.currentTarget.dataset.identify_id;
		const is_zan = e.currentTarget.dataset.is_zan;
		if(is_zan == 1){
			return;
		}
		const data = {
			unionid: wx.getStorageSync('unionid'),
			openid: wx.getStorageSync('openid'),
			identify_id: identify_id,
			action_type:1,
			identify_type:7
		}
		network.request('matchLike',data,res=>{
			this.data.rankingList[index].is_zan = res.is_zans;
			this.data.rankingList[index].zan_num = res.zan_num;
			this.setData({
				'times_task_user_info.zan_num': parseInt(this.data.times_task_user_info.zan_num) + 1, 
				rankingList: this.data.rankingList
			})
		})
	},
	onPageScroll (e) {
        let scroll_top = e.scrollTop
        if (this.data.tabFixed === (scroll_top > this.data.tabTop)) return;
        this.setData({
            tabFixed: (scroll_top > this.data.tabTop)
		})
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
	// 展开收起
	showDetail(e) {
		const index = e.currentTarget.dataset.index;
		this.data.rankingList[index]['isfold'] = !this.data.rankingList[index]['isfold'];
		this.setData({
			rankingList: this.data.rankingList
		});
	},
	getMyTaskInfo() {
		let params = {
			times_task_id: this.data.times_task_id,
			camp_times_id: this.data.camp_times_id,
			task_view_unionid: this.data.task_view_unionid
		}
		network.request('userTaskInfo', params, res => {
			this.setData({
				times_task_user_info: res.times_task_user_info,
				camp_times_info: res.camp_times_info,
				task_info: res.task_info
			})
		})
	},
	userTaskList(type) {
		let params = {
			times_task_id: this.data.times_task_id,
			sort_type: this.data.sort_type,
			task_view_unionid: this.data.task_view_unionid
		}
		network.request('userTaskList', params, res => {
			wx.hideLoading()
			this.setData({
				rankingList: res.submit_list
			})
			// 处理展开
			this.handleContent()
			// if (this.data.type == 2) return
			// 首次加载且是本人自己
			if (type === 1 && this.data.type == 1) {
				this.initClientRect()
			}
		})
	},
	clickTab(e) {
		wx.showLoading({
            title: '数据加载中',
        })
		const tag = e.currentTarget['dataset'].key
		this.setData({
			tabIndex: tag,
			sort_type: tag
		})
		this.userTaskList(2)
	},
	closeDialog() {
		const index = this.data.itemInfo.index
		const is_open = `rankingList[${index}].is_open`
		this.setData({showIsOpen: false, [is_open]: 1, itemInfo: {}})
	}
});
