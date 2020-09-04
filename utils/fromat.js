function add0(m) {
    return m < 10 ? '0' + m : m.toString()
}
const format = function(str) {
    //shijianchuo是整数，否则要parseInt转换
    const time = new Date(str);
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    const d = time.getDate();
    const h = time.getHours();
    const mm = time.getMinutes();
    const s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
const formstr = (str) => {
    str = Number(str);
    const d = Math.floor(str / (60 * 60 * 24));
    const h = Math.floor(str % (60 * 60 * 24) / 3600);
    const mm = Math.floor(str % (60 * 60) / 60);
    const s = Math.floor(str % 60);
    return [add0(d), add0(h), add0(mm), add0(s)]
}
const numToW = (num) => {
    let nums = Number(num);
    console.log(nums)
    if (nums > 9999) {
        nums = (nums / 1000).toFixed(2)
    }
    return nums;
}
const formatDate = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
    if (!date) {
      return ''
    }
    if (typeof date === 'string') {
      date = new Date(date.replace(/-/g, '/'))
    }
    if (typeof date === 'number') {
      date = new Date(date)
    }
    var o = {
      'M+': date.getMonth() + 1,
      'D+': date.getDate(),
      'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }
    var week = {
      '0': '\u65e5',
      '1': '\u4e00',
      '2': '\u4e8c',
      '3': '\u4e09',
      '4': '\u56db',
      '5': '\u4e94',
      '6': '\u516d'
    }
    if (/(Y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
}
export default {
    format,
    formstr,
    numToW,
    formatDate
}