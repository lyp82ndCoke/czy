const router = require('../../utils/router.js');
import network from '../../utils/network';
import getCode from "../../utils/getCode";
import fromat from "../../utils/fromat"
const app = getApp();

var timerInterval
var backgroundAudioManager = wx.getBackgroundAudioManager();

Page({
	data: {
		loginShow: false,
		loginWrapShow: false,
		commontShow: true,
		loadingBtn: true,
		task_submit_id: "",
		times_task_id: "",
		list: [],
		times_task_user_info: {},
		task_info: {},
		times_task_content_info: {},
		task_submit_info: {},
		prize_info: {},
		adv_info: {},
		more_task_list: [],
		camp_times_info: {},
		totalTime: 0,
		page_num: 1,
		page_size: 10,
		showMore: false,
		commentText: "",
		comment_id: "",
		nickname: "",
		placeholderText: "说说你的想法...",
		count: 0,
		showPopup: false,

		userPlaySecond: 0,
		userPlayTotal: 0
	},
	onLoad: function (options) {
		this.setData({
			task_submit_id: options.task_submit_id,
			times_task_id: options.times_task_id
		})
		wx.showLoading({
			title: '数据加载中',
		})
		let unionid = wx.getStorageSync('unionid');
		if (unionid) {
			// 获取任务分享落地页详情
			this.getShareOpenInfo();
			// 获取评论
			this.getComment()
			this.getLoginStatus()
		} else {
			getCode.login().then(res => {
				this.getShareOpenInfo();
				this.getComment()
				this.getLoginStatus()
			})
		}
		wx.hideLoading()
	},
	onShow() {
		if (timerInterval) {
			// 颁奖倒计时计算
			this.handleTime(this.data.task_info.task_end_time)
		}
	},
	onHide() {
		clearInterval(timerInterval)
	},
	onUnload() {
		clearInterval(timerInterval)
	},
	closePopup() { this.setData({ showPopup: false }) },
	// 获取当前授权状态
	getLoginStatus() {
		getCode.loginShow().then(res => {
			if (res) {
				this.setData({
					loginWrapShow: true
				})
			} else {
				this.setData({
					loginWrapShow: false
				})
			}
		})
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
	// 全局唤醒授权点击框
	loginShow() {
		this.setData({
			loginShow: true
		});
	},
	// 任务分享落地页详情
	getShareOpenInfo() {
		const data = {
			task_submit_id: this.data.task_submit_id,
			times_task_id: this.data.times_task_id,
			unionid: wx.getStorageSync('unionid')
		}
		network.request('taskShareOpenInfo', data, res => {
			this.setData({
				times_task_user_info: res.times_task_user_info,
				task_info: res.task_info,
				times_task_content_info: res.times_task_content_info,
				task_submit_info: res.task_submit_info,
				prize_info: res.prize_info,
				camp_times_info: res.camp_times_info,
				more_task_list: res.more_task_list,
				adv_info: res.adv_info
			})
			// 判断有没有音频
			if (res.task_info.audio_url) {
				this.autoPlay()
			}
			// 颁奖倒计时计算
			this.handleTime(this.data.task_info.task_end_time)
		})
	},
	// 点赞
	activeZan(e) {
		// isZan 1已点赞 2未点赞
		const isZan = e.currentTarget.dataset.zan;
		if (isZan === '2') {
			const data = {
				unionid: wx.getStorageSync('unionid'),
				openid: wx.getStorageSync('openid'),
				identify_id: this.data.task_submit_id,
				action_type: 1,
				identify_type: 7,
			}
			network.request('matchLike', data, res => {
				this.setData({ showPopup: true })
				this.getShareOpenInfo();
			})
		} else {
			wx.showToast({
				title: "已点过赞啦~",
				icon: "success",
				duration: 1000,
				success: () => {
					setTimeout(() => {
						this.setData({ showPopup: true })
					}, 1000)
				}
			})
		}
	},
	// 显示评论弹层
	showCommon(e) {
		const comment_id = e.currentTarget.dataset.comment_id;
		const nickname = e.currentTarget.dataset.nickname;
		const placeholderText = comment_id ? '回复@' + nickname : '说说你的想法...';
		this.setData({
			commontShow: false,
			comment_id,
			nickname,
			placeholderText
		})
	},
	// 隐藏评论弹层
	hideCommon() {
		this.setData({
			commontShow: true
		})
	},
	// 绑定评论数据
	commontChange(e) {
		const text = e.detail.value;
		this.setData({
			commentText: text
		})
		if (text.trim().length) {
			this.setData({
				loadingBtn: false
			})
		} else {
			this.setData({
				loadingBtn: true
			})
		}
	},
	// 发表评论
	release() {
		const data = {
			unionid: wx.getStorageSync('unionid'),
			identify_id: this.data.task_submit_id,
			times_task_id: this.data.times_task_id,
			identify_type: 6,
			comment_contents: this.data.commentText
		}
		if (this.data.comment_id) {
			data.parent_id = this.data.comment_id;
		}
		network.request('insertComment', data, res => {
			wx.showToast({
				title: "发布成功",
				icon: "success"
			})
			this.setData({
				loadingBtn: false,
				commontShow: true,
				commentText: ""
			})
			this.data.page_num = 1;
			this.getComment();
		})
	},
	// 获取评论
	getComment(type) {
		let data = {
			identify_id: this.data.task_submit_id,
			times_task_id: this.data.times_task_id,
			identify_type: 6,
			page_num: this.data.page_num,
			page_size: this.data.page_size
		}
		network.request('getMatchComment', data, res => {
			var list = res.list;
			if (type && type === 'more') {
				list = this.data.list.concat(res.list)
			}
			var showMore = res.sign.count >= 10 ? true : false;
			this.setData({
				list,
				showMore,
				count: res.sign.count
			})
		})
	},
	moreComment() {
		if (this.data.count >= 10) {
			this.data.page_num += 1;
			this.getComment("more");
		}
	},
	handleTime(time) {
		if (!time) return
		let start = new Date().getTime();
		let endTime = time.replace(/-/g, "/");
		let end = new Date(endTime).getTime();
		let value = parseInt(end - start) / 1000;
		this.setData({
			totalTime: value
		})
		this.timer()
	},
	timer() {
		let localTime = this.data.totalTime

		timerInterval = setInterval(() => {
			if (localTime < 1) {
				clearInterval(timerInterval)
				return
			}
			this.setData({
				totalTime: localTime--,
				timeData: fromat.formstr(localTime)
			})
		}, 1000);
	},
	// 分享记录调用接口
	shareRecord() {
		let params = {
			task_submit_id: this.data.task_submit_id,
			unionid: wx.getStorageSync('unionid')
		}
		network.request('shareTaskSubmit', params, res => {
			console.log('分享成功')
		})
	},
	// 用户点击右上角分享
	onShareAppMessage: function (e) {
		// 记录分享
		this.shareRecord();
		const obj = {
			title: `${this.data.times_task_user_info.nickname}正在参加${this.data.camp_times_info.camp_times_name}，邀您一起陪孩子赢大奖`,
			imageUrl: this.data.task_info.face_img_url,
			paramsFrom: { times_task_id: this.data.times_task_id, task_submit_id: this.data.task_submit_id },
			url: 'pages/match-share-mytask/index'
		}
		return network.share(obj);
	},
	// 前往赛区
	goMatchArea() {
		let url = `pages/match-area-details/index?camp_times_id=${this.data.camp_times_info.camp_times_id}&times_task_id=${this.data.times_task_id}&sourceType=2`
		router.navigate({ path: url })
	},
	// 客服消息
	handleContact(e) {
		// 客服消息
		const params = e.currentTarget['dataset']
		network.logsRequest({ apipath: params.button_path, apiparam: params.goods_id }, data => {
			console.log("log日志")
		})
	},
	//监听滑动
	radioChange: function (e) {
		// 获取滑动当前位置
		const playValue = e.detail.value
		const duration = this.data.userPlayTotal;
		// 获得滑动位置比例
		const bar = playValue / this.data.userPlayTotal;
		// 获音频跳转时长
		const seek = bar * duration;
		backgroundAudioManager.seek(seek)
		setTimeout(() => {
			backgroundAudioManager.play();
		}, 500)
	},
	//全局播放暂停
	musicPlay: function () {
		if (backgroundAudioManager.paused) {
			if (!backgroundAudioManager.src) {
				const seek = backgroundAudioManager.currentTime
				backgroundAudioManager.src = this.data.task_info.audio_url
				backgroundAudioManager.title = this.data.task_info.audio_title
				this.autoPlay(seek)
			}
			backgroundAudioManager.play()
			this.setData({
				musicPlay: false
			})
		} else {
			backgroundAudioManager.pause()
			this.setData({
				musicPlay: true
			})
		}
	},
	// 自动播放音频
	autoPlay(seek) {
		if (seek) {
			backgroundAudioManager.seek(seek)
		} else {
			backgroundAudioManager.src = this.data.task_info.audio_url
			backgroundAudioManager.title = this.data.task_info.audio_title
			backgroundAudioManager.play()
		}
		this.setData({
			userPlayTotal: this.data.task_info.audio_length
		})
		backgroundAudioManager.onTimeUpdate(() => {
			this.setData({
				userPlaySecond: parseInt(backgroundAudioManager.currentTime)
			})
			if (!this.data.userPlayTotal) {
				this.setData({
					userPlayTotal: parseInt(backgroundAudioManager.duration)
				})
			} else {}
		})
		backgroundAudioManager.onError(err => {
			console.log(err)
		})
		backgroundAudioManager.onPause(() => {
			this.setData({
				musicPlay: true
			})
			app.globalData.onPlay = false
		})
		// 监听播放状态
		backgroundAudioManager.onPlay(() => {
			this.setData({
				musicPlay: false
			})
			app.globalData.onPlay = true;
		})
		// 监听自然停止状态
		backgroundAudioManager.onEnded(() => {
			// if (this.data.detail.next_song_course_id) {
			// 	this.nextCourse()
			// } else {
			// 	backgroundAudioManager.src = this.data.task_info.audio_url
			// 	backgroundAudioManager.title = this.data.task_info.audio_title
			// 	backgroundAudioManager.pause();
			// }
			this.setData({
				musicPlay: true
			})
			backgroundAudioManager.src = null // this.data.task_info.audio_url
			backgroundAudioManager.title = null // this.data.task_info.audio_title
			backgroundAudioManager.stop();
			this.setData({
				musicPlay: true
			})
		})
		// // 监听iOS面板上一曲
		// backgroundAudioManager.onPrev(()=>{
		//   this.prevCourse();
		// })
		// // 监听iOS面板下一曲
		// backgroundAudioManager.onNext(()=>{
		//   this.nextCourse();
		// })
		// 监听停止状态 退出小程序音频播放悬浮框关闭时
		backgroundAudioManager.onStop(() => {
			console.log("停止了，怎么办？", backgroundAudioManager)
			backgroundAudioManager.stop();
			this.setData({
				musicPlay: true
			})
		})
	}
});
