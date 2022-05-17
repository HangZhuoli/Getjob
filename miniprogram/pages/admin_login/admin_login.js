// miniprogram/pages/admin_login/admin_login.js
let user_name = ""
let password = ""
Page({
  data: {

  },
  user(e){
    user_name = e.detail.value
  },
  passwd(e){
    password = e.detail.value
  },
  login(){
    if(user_name == 'zhixunlink' || password =='zhixunlink'){
    wx.navigateTo({
      url: '/pages/manage/index/index',
      success:res=>{
        wx.setNavigationBarTitle({
          title: '知询link管理端',
        })
      }
    })
  }
  else{
    wewx.showToast({
      title: '用户名或密码错误',
      duration:1000
    })
  }
}
})