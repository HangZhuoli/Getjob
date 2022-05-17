//app.js
App({
  onLaunch: function () {
  //云开发初始化
  wx.cloud.init({
    env:"cloud1-7gzdxtdh37ab3a0f"
  })
  },
  globalData:{
    userinfo:null
  }
})
