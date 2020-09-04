import network from "./network";
const datas = {
  title: ''
};

// console.log(from_user)
/**
 * 封装分享当前页面函数share
 * @param {* 分享文案：str } title 
 * @param {* 分享 params Object} paramsFrom 
 */
function getUrl(paramsFrom) {
  let params = paramsFrom || {};
  let str = '';
  for (let val in params) {
    str += val + '=' + params[val] + '&';
  }
  // console.log(str)
  let pages = getCurrentPages() //获取加载的页面
  let currentPage = pages[pages.length - 1] //获取当前页面的对象

  let url = currentPage.route + str //当前页面url
  return url;
}


function share(title, paramsFrom, imageUrl) {
  let params = paramsFrom || {};
  let query = {
    unionid: wx.getStorageSync('unionid')
  };
  const userinfo = wx.getStorageSync("userinfo");
  const nickname = userinfo.nickname;

  Object.assign(params, query);
  console.log("分享参数", params)
  let str = '';
  for (let val in params) {
    str += val + '=' + params[val] + '&';
  }
  // console.log(str)
  let pages = getCurrentPages() //获取加载的页面
  let currentPage = pages[pages.length - 1] //获取当前页面的对象

  let url = currentPage.route //当前页面url
  network.request('addShare', {
    url: url,
    params: params,
    goods_id: params["goods_id"] || "",
    unionid: params.unionid
  }, (data) => {
    // console.log(data.share_id)
  }, (error) => {
    //

  })
  datas.title = title ? title : `${nickname}邀请您一起培养好孩子`;
  console.log('str', str)
  datas.url = url + '?' + str;
  datas.imageUrl = imageUrl ? imageUrl:"https://zm-edu.oss-cn-beijing.aliyuncs.com/fixed_img/param_share_img/index_share_img.jpg"
  return datas;
}

/**
 * shareIndex 分享其他页面
 * @param {*} title 
 * @param {*} paramsFrom 
 */
// 分享带返回首页
function shareIndex(title, paramsFrom, toUrl) {
  let indexPath = 'pages/index/index?goIndex=1&nav=';
  console.log('转发信息', paramsFrom)
  let params = paramsFrom || {};
  console.log("form_user", wx.getStorageSync('user_id'))
  let query = {
    form_user: wx.getStorageSync('user_id')
  };
  console.log(query)
  Object.assign(params, query);
  console.log("分享参数", params)
  let pages = getCurrentPages() //获取加载的页面
  let currentPage = pages[pages.length - 1] //获取当前页面的对象
  let str = '';
  let url = toUrl ? toUrl : currentPage.route //当前页面url
  console.log('转发的url', url, params)
  for (let val in params) {
    str += val + '=' + params[val] + '&';
  }
  network.request('addShare', {
    url: url,
    params: params,
    goods_id: params["goods_id"] || "",
    user_id: params.form_user
  }, (data) => {
    // console.log(data.share_id)
  }, (error) => {
    //

  })
  console.log(str)
  datas.title = title || '';
  params = JSON.stringify(params)
  datas.url = indexPath + url + '&' + str;
  return datas;
}
export default {
  share,
  shareIndex,
  getUrl
}