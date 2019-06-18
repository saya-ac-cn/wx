//app.js
App({
  onLaunch: function () {
    var that = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {}; 
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: function (res) {
                var objz = {};
                objz.avatarUrl = res.userInfo.avatarUrl;
                objz.nickName = res.userInfo.nickName;
                console.log(objz);
                wx.setStorageSync('userInfo', objz);//存储userInfo
              }
            });
            var url = 'http://127.0.0.1:8080/api/public/wx/wxuserinfo?js_code=' + res.code ;
            wx.request({
              url: url,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              // header: {}, // 设置请求的 header  
              success: function (res) {
                var obj = {};
                obj.openid = res.data.openid;
                obj.expires_in = Date.now() + res.data.expires_in;
                //console.log(obj);
                wx.setStorageSync('user', obj);//存储openid 
                console.log(obj) 
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
   }
  },
  globalData: {
    userInfo: null
  }
})