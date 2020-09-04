import fromat from "../../utils/fromat"
Component({
    properties: {
        endTime:{
            type:String,
            value:''
        }
    },
    data: {
        totalTime: 0,
        timerInterval: null
    },
    methods: {
        handleTime (time) {
            let start = new Date().getTime();
            let endTime = time.replace(/-/g,"/");
            // let endTime = '2020/08/06 19:26:00'
            let end = new Date(endTime).getTime();
            let value  = parseInt(end - start)/1000;
            this.setData({totalTime: value})
            this.timer()
        },
        timer(){
            let localTime = this.data.totalTime
            this.data.timerInterval = setInterval(() => {
                if (localTime < 1) {
                    this.triggerEvent('timecallback')
                    clearInterval(this.data.timerInterval)
                    return
                }
                this.setData({
                    totalTime: localTime--,
                    timeData: fromat.formstr(localTime)
                })
            }, 1000);
        }
    },
    attached() {
        console.log('开始1')
        this.handleTime(this.data.endTime)
    },
    detached() {
        console.log('清除1')
        clearInterval(this.data.timerInterval)
        this.setData({ totalTime: 0, timeData: {} })
    },
    pageLifetimes: {
        show: function() {
            console.log('开始2')
            this.handleTime(this.data.endTime)
        },
        hide: function() {
            console.log('清除2')
            clearInterval(this.data.timerInterval)
            this.setData({ totalTime: 0, timeData: {} })
        }
    }
});